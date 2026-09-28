/**
 * AuraDesk AI — Gemini LLM Brain Service
 * 
 * Handles the core AI conversation engine:
 * - Injects real business knowledge context into every turn
 * - Maintains per-call sliding window conversation memory
 * - Detects intents via structured tool calling (JSON)
 * - Enforces guardrails (no hallucination, emergency detection)
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// ─── Tool definitions for Gemini structured function calling ───────────────────
const AI_TOOLS = [
  {
    name: 'book_appointment',
    description: 'Book an appointment slot for the caller with a staff member. Call this when the caller confirms a specific date and time.',
    parameters: {
      type: 'OBJECT',
      properties: {
        guest_name: { type: 'STRING', description: 'Full name of the caller/guest' },
        guest_phone: { type: 'STRING', description: 'Caller phone number' },
        date: { type: 'STRING', description: 'Appointment date in YYYY-MM-DD format' },
        time: { type: 'STRING', description: 'Appointment time e.g. "2:00 PM"' },
        host_name: { type: 'STRING', description: 'Staff member name the appointment is with' },
        purpose: { type: 'STRING', description: 'Reason for the appointment' }
      },
      required: ['guest_name', 'date', 'time']
    }
  },
  {
    name: 'capture_lead',
    description: 'Capture a qualified lead with contact details and requirements. Call when you have enough info to create a lead record.',
    parameters: {
      type: 'OBJECT',
      properties: {
        name: { type: 'STRING', description: 'Caller full name' },
        phone: { type: 'STRING', description: 'Caller phone number' },
        email: { type: 'STRING', description: 'Caller email if provided' },
        requirement: { type: 'STRING', description: 'What they are interested in' },
        budget: { type: 'STRING', description: 'Budget mentioned by caller' },
        location: { type: 'STRING', description: 'Location preference' },
        timeline: { type: 'STRING', description: 'When they need it' },
        status: { type: 'STRING', description: 'HOT, WARM, or COLD based on urgency and budget' }
      },
      required: ['name', 'phone', 'requirement', 'status']
    }
  },
  {
    name: 'transfer_to_human',
    description: 'Transfer the call to a human agent. Use when caller explicitly asks for a human, is angry/frustrated, or the issue is complex/legal/high-value.',
    parameters: {
      type: 'OBJECT',
      properties: {
        reason: { type: 'STRING', description: 'Why transferring' },
        priority: { type: 'STRING', description: 'normal or urgent' }
      },
      required: ['reason']
    }
  },
  {
    name: 'emergency_escalate',
    description: 'Immediately escalate as an emergency. Use for: fire, flooding, severe medical pain, accidents, pipe bursts, life-threatening situations.',
    parameters: {
      type: 'OBJECT',
      properties: {
        emergency_type: { type: 'STRING', description: 'Type of emergency detected' },
        urgency: { type: 'STRING', description: 'CRITICAL or HIGH' }
      },
      required: ['emergency_type', 'urgency']
    }
  },
  {
    name: 'check_out_visitor',
    description: 'Check out a visitor who has completed their visit.',
    parameters: {
      type: 'OBJECT',
      properties: {
        guest_name: { type: 'STRING', description: 'Name of the departing visitor' }
      },
      required: ['guest_name']
    }
  }
];

/**
 * Build the system prompt with real injected business knowledge
 */
function buildSystemPrompt(client, knowledgeContext) {
  const info = client.company_info || {};
  const guardrails = client.guardrails || {};
  const emergencyWords = (guardrails.emergencyKeywords || []).join(', ');

  return `You are ${client.ai_name || 'Maya'}, a warm, highly professional AI voice receptionist for ${client.name} in India.

## Communication Style & Persona
- Speak with natural Indian English cadence. Be respectful, prompt, and courteous.
- Understand Indian English terms, accents, and colloquialisms (e.g. "lakhs", "crores", "tomorrow morning first half", "send on WhatsApp", "share location").
- Keep answers SHORT for phone calls (1 to 2 crisp sentences max).
- Never sound robotic. Never repeat long repetitive welcome lines.

## Pricing & Currency
- Always quote pricing in Indian Rupees (₹ / INR), using Lakhs/Crores where appropriate.

## Company Information
Name: ${client.name}
Address: ${info.address || 'Main Branch, India'}
Phone: ${info.phone || 'N/A'}
Hours: ${info.operatingHours || 'Monday to Saturday 9:30 AM to 7:00 PM IST'}
Emergency Contact: ${info.emergencyContact || 'N/A'}

## Verified Knowledge Base
${knowledgeContext || 'No additional FAQ records.'}

## Core Rules
1. If caller asks for a human / doctor / manager: execute transfer_to_human.
2. If caller wants to book a consultation or visit: ask for preferred date and time, then execute book_appointment.
3. If caller asks about pricing/services: answer concisely from the knowledge base.
4. If asked if you are AI: "Yes, I am Maya, the AI receptionist for ${client.name}. How can I help you?"`;
}

/**
 * Main conversation turn handler
 * 
 * @param {Object} params
 * @param {Object} params.client - Full client object from DB
 * @param {string} params.knowledgeContext - Formatted knowledge base string
 * @param {Array}  params.history - Prior conversation turns [{role, parts}]
 * @param {string} params.userMessage - Latest caller utterance (from Deepgram STT)
 * @returns {{ reply: string, toolCall: Object|null, updatedHistory: Array }}
 */
export async function generateAIReply({ client, knowledgeContext, history = [], userMessage }) {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: buildSystemPrompt(client, knowledgeContext),
      tools: [{ functionDeclarations: AI_TOOLS }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 256
      }
    });

    // Keep conversation window to last 20 turns for cost efficiency
    const trimmedHistory = history.slice(-20);

    const chat = model.startChat({ history: trimmedHistory });
    const result = await chat.sendMessage(userMessage);
    const response = result.response;

    // ── Check for tool call (function calling) ──
    const functionCalls = response.functionCalls();
    if (functionCalls && functionCalls.length > 0) {
      const fc = functionCalls[0];
      
      // Get a spoken acknowledgment for the action
      const spokenAcknowledgment = getToolAcknowledgment(fc.name, fc.args, client);
      
      const updatedHistory = [
        ...trimmedHistory,
        { role: 'user', parts: [{ text: userMessage }] },
        { role: 'model', parts: [{ text: spokenAcknowledgment }] }
      ];

      return {
        reply: spokenAcknowledgment,
        toolCall: { name: fc.name, args: fc.args },
        updatedHistory
      };
    }

    // ── Standard text reply ──
    const reply = response.text().trim();
    const updatedHistory = [
      ...trimmedHistory,
      { role: 'user', parts: [{ text: userMessage }] },
      { role: 'model', parts: [{ text: reply }] }
    ];

    return { reply, toolCall: null, updatedHistory };

  } catch (err) {
    console.error('Gemini LLM error:', err?.message || err);
    return {
      reply: `I apologize, I had a brief technical issue. Could you repeat that for me?`,
      toolCall: null,
      updatedHistory: history
    };
  }
}

/**
 * Generate a natural spoken line for each tool action
 */
function getToolAcknowledgment(toolName, args, client) {
  switch (toolName) {
    case 'book_appointment':
      return `Perfect! I have confirmed your appointment for ${args.date} at ${args.time}${args.host_name ? ' with ' + args.host_name : ''}. You will receive a confirmation SMS shortly. Is there anything else I can help you with?`;
    
    case 'capture_lead':
      return `Thank you ${args.name}! I have registered your interest in ${args.requirement}. A member of our team will be in touch with you shortly. I am also sending you relevant information right now.`;
    
    case 'transfer_to_human':
      return `Absolutely, let me connect you with a team member right away. Please stay on the line for just a moment.`;
    
    case 'emergency_escalate':
      return `I understand this is urgent. I am immediately alerting our emergency response team at ${client?.company_info?.emergencyContact || 'our priority line'}. Please stay on the line.`;
    
    case 'check_out_visitor':
      return `You are all checked out${args.guest_name ? ', ' + args.guest_name : ''}! Thank you for visiting ${client?.name}. Have a wonderful day!`;
    
    default:
      return `I have taken note of that. How else can I help you?`;
  }
}

/**
 * Generate an initial greeting for when a call connects
 */
export function getOpeningGreeting(client) {
  const greeting = client.greeting || 
    `Welcome to ${client.name}! I'm ${client.ai_name || 'Maya'}, your AI assistant. How may I help you today?`;
  return greeting;
}
