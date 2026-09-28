/**
 * AuraDesk AI — Twilio SMS & WhatsApp Messaging Service
 * 
 * Sends automated post-call messages:
 * - Appointment confirmation SMS
 * - Brochure / info pack WhatsApp message
 * - 24-hour prior reminder SMS
 * - Lead follow-up message
 */

import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

function getClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token || sid.startsWith('AC__')) {
    return null;
  }
  return twilio(sid, token);
}

const FROM_NUMBER = process.env.TWILIO_PHONE_NUMBER;

/**
 * Send a standard SMS message
 */
export async function sendSMS(to, body) {
  const client = getClient();
  if (!client) {
    console.log(`[SMS SIMULATED] To: ${to}\n${body}`);
    return { simulated: true };
  }

  try {
    const msg = await client.messages.create({ from: FROM_NUMBER, to, body });
    console.log(`📱 SMS sent to ${to}: ${msg.sid}`);
    return { sid: msg.sid, status: msg.status };
  } catch (err) {
    console.error('SMS send error:', err.message);
    return null;
  }
}

/**
 * Send a WhatsApp message (requires WhatsApp Business account linked to Twilio)
 * Format: 'whatsapp:+1XXXXXXXXXX'
 */
export async function sendWhatsApp(to, body) {
  const client = getClient();
  if (!client) {
    console.log(`[WHATSAPP SIMULATED] To: ${to}\n${body}`);
    return { simulated: true };
  }

  const whatsappFrom = `whatsapp:${FROM_NUMBER}`;
  const whatsappTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;

  try {
    const msg = await client.messages.create({
      from: whatsappFrom,
      to: whatsappTo,
      body
    });
    console.log(`💬 WhatsApp sent to ${to}: ${msg.sid}`);
    return { sid: msg.sid, status: msg.status };
  } catch (err) {
    console.error('WhatsApp send error:', err.message);
    return null;
  }
}

/**
 * Post-call: Send appointment confirmation
 */
export async function sendAppointmentConfirmation(to, { guestName, date, time, hostName, address, clientName }) {
  const body = `Hi ${guestName}! ✅ Your appointment with ${clientName} is confirmed for ${date} at ${time}${hostName ? ' with ' + hostName : ''}.

📍 Location: ${address || 'Our office'}

Reply CANCEL to reschedule or call us for any changes.
– AuraDesk AI`;

  return sendSMS(to, body);
}

/**
 * Post-call: Send lead follow-up with info
 */
export async function sendLeadFollowUp(to, { guestName, requirement, clientName, infoUrl }) {
  const body = `Hi ${guestName}! Thank you for calling ${clientName}. 

As discussed, here's the information on ${requirement}: ${infoUrl || 'https://app.auradesk.ai/info'}

Our team will be in touch shortly. Feel free to call anytime!
– AuraDesk AI`;

  return sendWhatsApp(to, body);
}

/**
 * Send 24-hour prior reminder
 */
export async function sendAppointmentReminder(to, { guestName, date, time, clientName }) {
  const body = `⏰ Reminder: ${guestName}, your appointment at ${clientName} is tomorrow at ${time}.

Reply YES to confirm or CANCEL to reschedule.
– AuraDesk AI`;

  return sendSMS(to, body);
}

/**
 * Notify staff of hot lead or emergency transfer
 */
export async function notifyStaff(staffPhone, message) {
  return sendSMS(staffPhone, `🚨 AuraDesk AI Alert:\n${message}`);
}
