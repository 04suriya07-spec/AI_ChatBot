/**
 * AuraDesk AI — Google Calendar Integration Service
 * 
 * Reads available slots and creates/updates appointment events.
 * Uses OAuth2 with offline refresh tokens for server-side access.
 */

import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

function getOAuth2Client() {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || 'http://localhost:4000/api/auth/google/callback'
  );
  return client;
}

function getCalendarClient(refreshToken) {
  const auth = getOAuth2Client();
  auth.setCredentials({ refresh_token: refreshToken });
  return google.calendar({ version: 'v3', auth });
}

export async function getAvailableSlots(refreshToken, calendarId = 'primary', date, possibleSlots = [
  '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'
]) {
  if (!refreshToken || !process.env.GOOGLE_CLIENT_ID) {
    console.warn('Google Calendar not configured. Returning mock slots.');
    return ['11:30 AM', '2:00 PM', '4:30 PM'];
  }

  try {
    const calendar = getCalendarClient(refreshToken);
    const dayStart = new Date(`${date}T00:00:00`);
    const dayEnd = new Date(`${date}T23:59:59`);

    const busyRes = await calendar.freebusy.query({
      requestBody: {
        timeMin: dayStart.toISOString(),
        timeMax: dayEnd.toISOString(),
        items: [{ id: calendarId }]
      }
    });

    const busyPeriods = busyRes.data.calendars?.[calendarId]?.busy || [];

    const availableSlots = possibleSlots.filter(slot => {
      const [hour, minute] = slot.split(':').map(Number);
      const slotStart = new Date(date);
      slotStart.setHours(hour, minute, 0);
      const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000);
      return !busyPeriods.some(busy => {
        const busyStart = new Date(busy.start);
        const busyEnd = new Date(busy.end);
        return slotStart < busyEnd && slotEnd > busyStart;
      });
    });

    return availableSlots.map(slot => {
      const [hour, minute] = slot.split(':').map(Number);
      const d = new Date(2000, 0, 1, hour, minute);
      return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    });

  } catch (err) {
    console.error('Google Calendar getAvailableSlots error:', err.message);
    return ['11:30 AM', '2:00 PM', '5:00 PM'];
  }
}

export async function createCalendarEvent(refreshToken, calendarId = 'primary', appointment) {
  if (!refreshToken || !process.env.GOOGLE_CLIENT_ID) {
    console.warn('Google Calendar not configured. Skipping event creation.');
    return `mock-event-${Date.now()}`;
  }

  try {
    const calendar = getCalendarClient(refreshToken);
    const { date, time, guest_name, guest_email, purpose, host_name, duration_minutes = 60 } = appointment;

    const startDt = new Date(`${date} ${time}`);
    const endDt = new Date(startDt.getTime() + duration_minutes * 60 * 1000);

    const event = {
      summary: `[AuraDesk] ${purpose || 'Appointment'} — ${guest_name}`,
      description: `Booked by AuraDesk AI Voice Receptionist\nGuest: ${guest_name}\nHost: ${host_name || 'Assigned Staff'}`,
      start: { dateTime: startDt.toISOString(), timeZone: 'Asia/Kolkata' },
      end: { dateTime: endDt.toISOString(), timeZone: 'Asia/Kolkata' },
      attendees: [...(guest_email ? [{ email: guest_email, displayName: guest_name }] : [])],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 }
        ]
      },
      colorId: '5'
    };

    const res = await calendar.events.insert({
      calendarId,
      requestBody: event,
      sendUpdates: guest_email ? 'all' : 'none'
    });

    console.log(`📅 Google Calendar event created: ${res.data.id}`);
    return res.data.id;

  } catch (err) {
    console.error('Google Calendar createEvent error:', err.message);
    return null;
  }
}

export function getAuthUrl() {
  const auth = getOAuth2Client();
  return auth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/calendar']
  });
}

export async function exchangeCodeForTokens(code) {
  const auth = getOAuth2Client();
  const { tokens } = await auth.getToken(code);
  return tokens;
}
