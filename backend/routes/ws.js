/**
 * AuraDesk AI — WebSocket Media Stream Handler
 * 
 * This is the heart of the real-time voice pipeline.
 * 
 * Flow per call:
 * 1. Twilio connects via WebSocket and sends raw audio chunks (mulaw 8kHz)
 * 2. We pipe audio chunks → Deepgram STT (real-time transcription)
 * 3. Deepgram sends back final transcript utterances
 * 4. Transcript → Gemini LLM (with business context + conversation history)
 * 5. Gemini returns reply text (+ optional tool call e.g. book_appointment)
 * 6. Tool call → execute action (DB write, calendar, SMS)
 * 7. Reply text → ElevenLabs TTS → mp3 audio
 * 8. Audio served as URL → send to Twilio via REST API to play to caller
 * 9. Dashboard clients notified via Server-Sent Events
 */

import { WebSocketServer } from 'ws';
import { createDeepgramStream, sendAudioChunk, closeDeepgramStream } from '../services/stt.js';
import { generateAIReply, getOpeningGreeting } from '../services/llm.js';
import { synthesizeSpeech, getTwiMLSay } from '../services/tts.js';
import { sendAppointmentConfirmation, sendLeadFollowUp } from '../services/sms.js';
import { createCalendarEvent, getAvailableSlots } from '../services/calendar.js';
import { getClient, getKnowledgeContext, insertLead, insertAppointment, updateCall } from '../db/client.js';
import twilio from 'twilio';
import { supabase } from '../db/client.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
dotenv.config();

// In-memory map: callSid → { callState }
const activeCalls = new Map();

/**
 * Attach WebSocket server to the HTTP server for Twilio Media Streams
 */
export function attachWebSocketServer(httpServer, sseEmitter) {
  const wss = new WebSocketServer({ server: httpServer, path: '/media-stream' });

  wss.on('connection', (ws, req) => {
    console.log('🔗 Twilio Media Stream WebSocket connected');

    let callState = {
      clientId: null,
      callerNumber: null,
      callSid: null,
      client: null,
      knowledgeContext: '',
      conversationHistory: [],
      transcript: [],
      dgWs: null,
      isProcessing: false,  // Prevent overlapping AI calls
      streamSid: null,
      callDbId: null
    };

    // ── Handle incoming messages from Twilio ──────────────────────────────────
    ws.on('message', async (data) => {
      try {
        const msg = JSON.parse(data.toString());

        switch (msg.event) {
          // ── Call stream starts ──
          case 'start': {
            callState.streamSid = msg.streamSid;
            callState.callSid = msg.start.callSid;

            // Extract parameters passed from TwiML
            const params = msg.start.customParameters || {};
            callState.clientId = params.clientId;
            callState.callerNumber = params.callerNumber;

            console.log(`📞 Stream started: ${callState.callSid} | Client: ${callState.clientId}`);

            // Load client config + knowledge base from database
            if (callState.clientId && callState.clientId !== 'default') {
              callState.client = await getClient(callState.clientId);
              callState.knowledgeContext = await getKnowledgeContext(callState.clientId);
            }

            // Fetch the call DB record
            if (callState.callSid) {
              const { data: callRow } = await supabase
                .from('calls')
                .select('id')
                .eq('twilio_call_sid', callState.callSid)
                .single();
              callState.callDbId = callRow?.id;
            }

            // Initialize Deepgram STT stream
            callState.dgWs = createDeepgramStream(
              async (transcript, isFinal) => {
                if (isFinal && transcript && !callState.isProcessing) {
                  await handleTranscript(ws, callState, transcript, sseEmitter);
                } else if (!isFinal) {
                  // Emit interim transcript to dashboard
                  if (sseEmitter) {
                    sseEmitter(`interim:${callState.clientId}`, { transcript, callSid: callState.callSid });
                  }
                }
              },
              (err) => console.error('DG error for call', callState.callSid, err)
            );

            // Play opening greeting to caller
            await playGreeting(ws, callState);
            break;
          }

          // ── Audio chunk from caller ──
          case 'media': {
            if (callState.dgWs) {
              sendAudioChunk(callState.dgWs, msg.media.payload);
            }
            break;
          }

          // ── Call disconnected ──
          case 'stop': {
            console.log(`📴 Stream stopped: ${callState.callSid}`);
            await handleCallEnd(callState, sseEmitter);
            activeCalls.delete(callState.callSid);
            ws.terminate();
            break;
          }
        }

      } catch (e) {
        console.error('WS message parse error:', e.message);
      }
    });

    ws.on('close', async () => {
      if (callState.callSid) {
        await handleCallEnd(callState, sseEmitter);
        activeCalls.delete(callState.callSid);
      }
      closeDeepgramStream(callState.dgWs);
    });

    ws.on('error', (err) => {
      console.error('WS error:', err.message);
    });
  });

  console.log('🔌 WebSocket media stream server attached at /media-stream');
  return wss;
}

// ─────────────────────────────────────────────────────────────────────────────
// Core: Handle final transcript → AI → speak to caller
// ─────────────────────────────────────────────────────────────────────────────
async function handleTranscript(ws, callState, transcript, sseEmitter) {
  if (callState.isProcessing) return;
  callState.isProcessing = true;

  console.log(`👂 [${callState.callSid}] Caller said: "${transcript}"`);

  // Add to transcript log
  callState.transcript.push({ speaker: 'Caller', text: transcript });

  // Emit to dashboard via SSE
  if (sseEmitter) {
    sseEmitter(`transcript:${callState.clientId}`, {
      speaker: 'Caller',
      text: transcript,
      callSid: callState.callSid
    });
  }

  try {
    // ── Generate AI reply with Gemini ────────────────────────────────────────
    const { reply, toolCall, updatedHistory } = await generateAIReply({
      client: callState.client,
      knowledgeContext: callState.knowledgeContext,
      history: callState.conversationHistory,
      userMessage: transcript
    });

    callState.conversationHistory = updatedHistory;
    callState.transcript.push({ speaker: 'AI', text: reply });

    // ── Execute tool actions ─────────────────────────────────────────────────
    if (toolCall) {
      await executeToolAction(toolCall, callState, sseEmitter);
    }

    // ── Speak reply to caller via Twilio ────────────────────────────────────
    await speakToTwilio(callState.callSid, callState.streamSid, reply);
    console.log(`🗣️  [${callState.callSid}] AI said: "${reply}"`);

    // Emit AI response to dashboard
    if (sseEmitter) {
      sseEmitter(`transcript:${callState.clientId}`, {
        speaker: 'AI',
        text: reply,
        callSid: callState.callSid,
        toolCall
      });
    }

  } catch (err) {
    console.error('handleTranscript error:', err.message);
  } finally {
    callState.isProcessing = false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Play AI greeting when call first connects
// ─────────────────────────────────────────────────────────────────────────────
async function playGreeting(ws, callState) {
  const greeting = getOpeningGreeting(callState.client);
  callState.transcript.push({ speaker: 'AI', text: greeting });
  await speakToTwilio(callState.callSid, callState.streamSid, greeting);
}

// ─────────────────────────────────────────────────────────────────────────────
// Convert text to speech and play it to the Twilio caller
// Uses ElevenLabs TTS → hosted mp3 → Twilio REST /calls/{sid}/play
// ─────────────────────────────────────────────────────────────────────────────
async function speakToTwilio(callSid, streamSid, text) {
  try {
    const twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    // Try ElevenLabs first for ultra-realistic voice
    const voiceId = process.env.ELEVENLABS_VOICE_ID;
    const audioBuffer = await synthesizeSpeech(text, { voiceId });

    if (audioBuffer) {
      // Save mp3 temporarily and serve it
      const audioPath = `/tmp/aura_${callSid}_${Date.now()}.mp3`;
      fs.writeFileSync(audioPath, audioBuffer);
      const publicUrl = `${process.env.PUBLIC_URL}/audio/${path.basename(audioPath)}`;

      await twilioClient.calls(callSid).update({
        twiml: `<Response><Play>${publicUrl}</Play><Pause length="60"/></Response>`
      });
    } else {
      // Fallback: Twilio Polly neural TTS (good quality, immediate)
      await twilioClient.calls(callSid).update({
        twiml: `<Response>${getTwiMLSay(text)}<Pause length="60"/></Response>`
      });
    }
  } catch (err) {
    console.error('speakToTwilio error:', err.message);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Execute Gemini tool calls (book appointment, capture lead, etc.)
// ─────────────────────────────────────────────────────────────────────────────
async function executeToolAction(toolCall, callState, sseEmitter) {
  const { name, args } = toolCall;
  const client = callState.client;

  console.log(`🔧 Tool call: ${name}`, args);

  switch (name) {

    case 'book_appointment': {
      // Write to database
      const apt = await insertAppointment({
        client_id: client?.id,
        call_id: callState.callDbId,
        guest_name: args.guest_name,
        guest_phone: callState.callerNumber,
        host_name: args.host_name,
        purpose: args.purpose,
        appointment_date: args.date,
        appointment_time: args.time,
        status: 'Confirmed'
      });

      // Write to Google Calendar if configured
      if (client?.google_tokens?.refresh_token) {
        const eventId = await createCalendarEvent(
          client.google_tokens.refresh_token,
          client.google_cal_id,
          { ...args, guest_phone: callState.callerNumber }
        );
        if (eventId && apt?.id) {
          await supabase.from('appointments').update({ google_event_id: eventId }).eq('id', apt.id);
        }
      }

      // Send confirmation SMS
      if (callState.callerNumber) {
        await sendAppointmentConfirmation(callState.callerNumber, {
          guestName: args.guest_name,
          date: args.date,
          time: args.time,
          hostName: args.host_name,
          address: client?.company_info?.address,
          clientName: client?.name
        });
      }

      // Update call outcome
      if (callState.callDbId) {
        await updateCall(callState.callDbId, { outcome: 'booked', appointment_id: apt?.id });
      }

      // Notify dashboard
      if (sseEmitter) {
        sseEmitter(`action:${client?.id}`, { type: 'appointment_booked', data: apt });
      }
      break;
    }

    case 'capture_lead': {
      // Score the lead based on available data
      const score = calculateLeadScore(args);

      const lead = await insertLead({
        client_id: client?.id,
        call_id: callState.callDbId,
        name: args.name,
        phone: callState.callerNumber || args.phone,
        email: args.email,
        requirement: args.requirement,
        budget: args.budget,
        budget_numeric: parseBudgetToNumber(args.budget),
        location: args.location,
        timeline: args.timeline,
        status: args.status || 'WARM',
        score,
        source: 'inbound_call',
        ai_summary: `Caller interested in ${args.requirement}. Budget: ${args.budget}. Timeline: ${args.timeline}.`
      });

      // Send WhatsApp info follow-up
      if (callState.callerNumber) {
        await sendLeadFollowUp(callState.callerNumber, {
          guestName: args.name,
          requirement: args.requirement,
          clientName: client?.name,
          infoUrl: `https://app.auradesk.ai/${client?.slug}/info`
        });
      }

      if (callState.callDbId) {
        await updateCall(callState.callDbId, {
          outcome: 'lead_captured',
          lead_id: lead?.id,
          intent: args.requirement
        });
      }

      if (sseEmitter) {
        sseEmitter(`action:${client?.id}`, { type: 'lead_captured', data: lead });
      }
      break;
    }

    case 'transfer_to_human': {
      if (callState.callDbId) {
        await updateCall(callState.callDbId, { outcome: 'transferred' });
      }
      if (sseEmitter) {
        sseEmitter(`action:${client?.id}`, {
          type: 'human_handoff',
          data: { reason: args.reason, callSid: callState.callSid }
        });
      }
      // Actual Twilio transfer via REST call redirect
      try {
        const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        // Use HUMAN_TRANSFER_NUMBER env var first, then fallback to client's company phone
        const transferTo = process.env.HUMAN_TRANSFER_NUMBER || client?.company_info?.phone;
        if (transferTo) {
          await twilioClient.calls(callState.callSid).update({
            twiml: `<Response><Dial action="${process.env.PUBLIC_URL}/api/twilio/dial-complete"><Number>${transferTo}</Number></Dial></Response>`
          });
        }
      } catch (e) {
        console.warn('Transfer error:', e.message);
      }
      break;
    }

    case 'emergency_escalate': {
      if (callState.callDbId) {
        await updateCall(callState.callDbId, { outcome: 'emergency', intent: args.emergency_type });
      }
      // Notify on-call staff immediately
      const { notifyStaff } = await import('../services/sms.js');
      const emergencyContact = client?.company_info?.emergencyContact;
      if (emergencyContact) {
        const alertPhone = emergencyContact.match(/\+?[\d\s\-().]+/)?.[0]?.replace(/\s/g, '');
        if (alertPhone) {
          await notifyStaff(alertPhone,
            `🚨 EMERGENCY CALL from ${callState.callerNumber}\nType: ${args.emergency_type}\nCall SID: ${callState.callSid}`
          );
        }
      }
      if (sseEmitter) {
        sseEmitter(`action:${client?.id}`, {
          type: 'emergency',
          data: { ...args, callerNumber: callState.callerNumber }
        });
      }
      break;
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Handle call cleanup when call ends
// ─────────────────────────────────────────────────────────────────────────────
async function handleCallEnd(callState, sseEmitter) {
  if (!callState.callDbId || callState.transcript.length === 0) return;

  // Generate AI summary of the full conversation
  const summary = await generateCallSummary(callState);

  // Update final call record
  await updateCall(callState.callDbId, {
    ended_at: new Date().toISOString(),
    transcript: callState.transcript,
    ai_summary: summary,
    outcome: summary ? 'resolved' : 'completed'
  });

  closeDeepgramStream(callState.dgWs);

  if (sseEmitter) {
    sseEmitter(`call_ended:${callState.clientId}`, {
      callSid: callState.callSid,
      summary
    });
  }
}

// Simple AI summary of transcript
async function generateCallSummary(callState) {
  if (!callState.transcript.length) return '';
  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const transcriptText = callState.transcript
      .map(t => `${t.speaker}: ${t.text}`)
      .join('\n');

    const result = await model.generateContent(
      `Summarize this customer service call in 2-3 sentences. Include: caller intent, outcome, and next action.\n\n${transcriptText}`
    );
    return result.response.text().trim();
  } catch {
    return '';
  }
}

// Helpers
function calculateLeadScore(args) {
  let score = 40;
  if (args.budget) score += 20;
  if (args.timeline?.includes('immediate') || args.timeline?.includes('December')) score += 20;
  if (args.status === 'HOT') score += 20;
  if (args.email) score += 10;
  return Math.min(100, score);
}

function parseBudgetToNumber(budgetStr) {
  if (!budgetStr) return 0;
  const match = budgetStr.match(/[\d,.]+/);
  if (!match) return 0;
  const num = parseFloat(match[0].replace(/,/g, ''));
  if (budgetStr.toLowerCase().includes('cr') || budgetStr.toLowerCase().includes('crore')) return num * 10000000;
  if (budgetStr.toLowerCase().includes('lakh')) return num * 100000;
  return num;
}
