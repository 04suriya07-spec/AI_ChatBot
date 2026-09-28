# AuraDesk AI Backend

This is the production Node.js backend that powers real inbound phone calls, live AI conversations, calendar booking, and SMS follow-ups.

## Quick Start (Local Development)

```bash
# 1. Install dependencies
cd backend
npm install

# 2. Copy and fill in your API keys
cp .env.example .env
# Edit .env and add your keys (see .env.example for instructions)

# 3. Run the backend server
npm run dev
# Server starts at http://localhost:4000

# 4. In a NEW terminal window, expose it to Twilio via ngrok
# Install ngrok: https://ngrok.com/download
ngrok http 4000
# Copy the HTTPS URL (e.g. https://abc123.ngrok-free.app)
# Paste it into PUBLIC_URL in your .env file
```

## Verify Your Backend is Running

Open: http://localhost:4000/health

You should see:
```json
{
  "status": "ok",
  "service": "AuraDesk AI Backend",
  "env": {
    "deepgram": true,
    "gemini": true,
    "elevenlabs": true,
    "twilio": true,
    "supabase": true
  }
}
```

## Connect Twilio Phone Number

1. Go to [Twilio Console](https://console.twilio.com) → Phone Numbers → Manage → Your Number
2. Set **A Call Comes In → Webhook → HTTP POST** to:
   ```
   https://YOUR_NGROK_URL.ngrok-free.app/api/twilio/incoming-call
   ```
3. Set **Call Status Changes** to:
   ```
   https://YOUR_NGROK_URL.ngrok-free.app/api/twilio/status-callback
   ```

## Database Setup (Supabase)

1. Go to [supabase.com](https://supabase.com) → New Project
2. SQL Editor → paste the contents of `db/schema.sql` → Run
3. Copy your **Project URL** and **Service Role Key** into `.env`

## Required API Keys (Priority Order)

| Priority | Service | Purpose | Free? |
|:---|:---|:---|:---|
| 🔴 Required | **Twilio** | Real phone calls | $15 trial |
| 🔴 Required | **Gemini API** | AI brain | Yes (free tier) |
| 🟡 Important | **Deepgram** | Real-time STT | $200 credit |
| 🟡 Important | **Supabase** | Database | Yes (free tier) |
| 🟢 Optional | **ElevenLabs** | Ultra-realistic TTS | 10k chars/month |
| 🟢 Optional | **Google Calendar** | Real slot booking | Yes (free) |

## Architecture

```
Customer calls Twilio number
        ↓
POST /api/twilio/incoming-call
        ↓ Returns TwiML <Connect><Stream>
WebSocket /media-stream connected
        ↓
Twilio streams mulaw 8kHz audio chunks
        ↓
Deepgram STT (nova-2 model, real-time)
        ↓
Final transcript utterance
        ↓
Gemini 1.5 Flash (with business knowledge context)
        ↓ Tool calling JSON
Execute: book_appointment | capture_lead | transfer | emergency
        ↓
Write to Supabase DB + Google Calendar + Send SMS
        ↓
ElevenLabs TTS → mp3 audio
        ↓
Twilio plays audio to caller
        ↓
Dashboard updates via Server-Sent Events (live)
```
