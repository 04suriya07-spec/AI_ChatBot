/**
 * AuraDesk AI — Twilio Webhook Route
 * 
 * Handles inbound phone calls from Twilio.
 * 
 * POST /api/twilio/incoming-call
 *   ↓ Returns TwiML that connects the call to a WebSocket media stream
 * 
 * POST /api/twilio/recording-complete
 *   ↓ Handles recording callback when call ends
 */

import { Router } from 'express';
import twilio from 'twilio';
import dotenv from 'dotenv';
import { getClient } from '../db/client.js';
import { insertCall } from '../db/client.js';
dotenv.config();

const router = Router();

/**
 * POST /api/twilio/incoming-call
 * 
 * Twilio calls this when someone dials your AuraDesk phone number.
 * We return TwiML to:
 * 1. Give a brief hello using Polly (while we set up the WS connection)
 * 2. Connect the call audio to our WebSocket media stream handler
 */
router.post('/incoming-call', async (req, res) => {
  const callerNumber = req.body.From || 'Unknown';
  const twilioNumber = req.body.To;
  const callSid = req.body.CallSid;

  console.log(`📞 Inbound call: ${callerNumber} → ${twilioNumber} [${callSid}]`);

  // Look up which client owns this Twilio number
  const client = await getClient(twilioNumber).catch(() => null) 
    || await getClientByTwilioNumber(twilioNumber);

  const clientName = client?.name || 'AuraDesk';
  const aiName = client?.ai_name || 'Maya';
  const wsUrl = `wss://${req.headers.host}/media-stream`;

  // Create initial call record in database
  if (client) {
    await insertCall({
      client_id: client.id,
      caller_number: callerNumber,
      twilio_call_sid: callSid,
      direction: 'inbound',
      outcome: 'in-progress'
    }).catch(e => console.warn('DB insertCall warn:', e.message));
  }

  // TwiML response: brief pause + connect to our WebSocket for real-time AI
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="${wsUrl}">
      <Parameter name="clientId" value="${client?.id || 'default'}" />
      <Parameter name="callerNumber" value="${callerNumber}" />
      <Parameter name="callSid" value="${callSid}" />
    </Stream>
  </Connect>
</Response>`;

  res.type('text/xml').send(twiml);
});

/**
 * POST /api/twilio/recording-complete
 * 
 * Twilio calls this when call recording is available.
 * We store the recording URL in the database.
 */
router.post('/recording-complete', async (req, res) => {
  const { RecordingUrl, RecordingSid, CallSid, RecordingDuration } = req.body;
  console.log(`🎙️  Recording available: ${RecordingUrl}`);

  // Update call record with recording URL
  const { supabase } = await import('../db/client.js');
  await supabase
    .from('calls')
    .update({
      recording_url: `${RecordingUrl}.mp3`,
      recording_sid: RecordingSid,
      duration_seconds: parseInt(RecordingDuration || '0')
    })
    .eq('twilio_call_sid', CallSid)
    .catch(e => console.warn('DB recording update warn:', e.message));

  res.sendStatus(200);
});

/**
 * POST /api/twilio/status-callback
 * 
 * Called when call status changes (ringing, in-progress, completed).
 */
router.post('/status-callback', async (req, res) => {
  const { CallSid, CallStatus, CallDuration } = req.body;
  console.log(`📊 Call ${CallSid} status: ${CallStatus} (${CallDuration}s)`);

  if (CallStatus === 'completed' || CallStatus === 'failed') {
    const { supabase } = await import('../db/client.js');
    await supabase
      .from('calls')
      .update({
        ended_at: new Date().toISOString(),
        duration_seconds: parseInt(CallDuration || '0')
      })
      .eq('twilio_call_sid', CallSid)
      .catch(e => console.warn('DB status update warn:', e.message));
  }

  res.sendStatus(200);
});

/**
 * POST /api/twilio/call-me
 * Triggers Twilio to dial the user's phone number directly.
 */
router.post('/call-me', async (req, res) => {
  const targetNumber = req.body.phone || process.env.HUMAN_TRANSFER_NUMBER || '+919843187793';
  const twilioNumber = process.env.TWILIO_PHONE_NUMBER || '+16066032230';
  const publicUrl = process.env.PUBLIC_URL || 'https://mandi-unconciliative-nonfatally.ngrok-free.dev';

  console.log(`🚀 Initiating outbound call: Twilio (${twilioNumber}) → Target (${targetNumber})`);

  try {
    const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    
    // Create outbound call with TwiML pointing to our incoming-call webhook
    const call = await twilioClient.calls.create({
      url: `${publicUrl}/api/twilio/incoming-call`,
      to: targetNumber,
      from: twilioNumber,
      statusCallback: `${publicUrl}/api/twilio/status-callback`,
      statusCallbackMethod: 'POST'
    });

    console.log(`✅ Outbound call dispatched! Call SID: ${call.sid}`);
    res.json({ success: true, callSid: call.sid, to: targetNumber });
  } catch (err) {
    console.error('❌ Failed to trigger outbound call:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
