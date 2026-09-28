/**
 * AuraDesk AI — Production Backend Server
 * 
 * Start: npm run dev  (local with nodemon)
 * Prod:  npm start
 * 
 * Local dev setup:
 * 1. cp .env.example .env && fill in your keys
 * 2. npm install
 * 3. npm run dev
 * 4. In a separate terminal: ngrok http 4000
 * 5. Copy the ngrok URL to PUBLIC_URL in .env
 * 6. Set Twilio webhook to: https://YOUR_NGROK.ngrok-free.app/api/twilio/incoming-call
 */

import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const server = http.createServer(app);

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    /\.ngrok-free\.app$/,       // Allow ngrok tunnels
    /\.railway\.app$/,          // Allow Railway deployments
    /\.onrender\.com$/          // Allow Render deployments
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Serve TTS audio files temporarily ───────────────────────────────────────
const AUDIO_DIR = '/tmp';
app.use('/audio', express.static(AUDIO_DIR, {
  maxAge: '5m',
  setHeaders: (res) => res.set('Content-Type', 'audio/mpeg')
}));

// Cleanup old audio files older than 10 minutes
setInterval(() => {
  try {
    const files = fs.readdirSync(AUDIO_DIR).filter(f => f.startsWith('aura_'));
    const now = Date.now();
    files.forEach(f => {
      const filePath = path.join(AUDIO_DIR, f);
      const stat = fs.statSync(filePath);
      if (now - stat.mtimeMs > 10 * 60 * 1000) {
        fs.unlinkSync(filePath);
      }
    });
  } catch {}
}, 5 * 60 * 1000);

// ─── SSE Emitter (Server-Sent Events for live dashboard) ─────────────────────
app.sseClients = new Map();

function sseEmit(eventKey, payload) {
  // eventKey format: "transcript:clientId" or "action:clientId"
  const [, clientId] = eventKey.split(':');
  const clients = app.sseClients?.get(clientId);
  if (!clients?.size) return;

  const data = `data: ${JSON.stringify({ event: eventKey, ...payload })}\n\n`;
  clients.forEach(res => {
    try { res.write(data); } catch {}
  });
}

// ─── Routes ──────────────────────────────────────────────────────────────────
import twilioRoutes from './routes/twilio.js';
import apiRoutes from './routes/api.js';

app.use('/api/twilio', twilioRoutes);
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'AuraDesk AI Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    env: {
      deepgram: !!process.env.DEEPGRAM_API_KEY,
      gemini: !!process.env.GEMINI_API_KEY,
      elevenlabs: !!process.env.ELEVENLABS_API_KEY,
      twilio: !!process.env.TWILIO_ACCOUNT_SID,
      supabase: !!process.env.SUPABASE_URL,
      googleCalendar: !!process.env.GOOGLE_CLIENT_ID
    }
  });
});

// ─── WebSocket Media Stream ───────────────────────────────────────────────────
import { attachWebSocketServer } from './routes/ws.js';
attachWebSocketServer(server, sseEmit);

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════╗
║           AuraDesk AI Backend Server                 ║
╠══════════════════════════════════════════════════════╣
║  🚀  HTTP + WebSocket:  http://localhost:${PORT}       ║
║  🌐  Public URL:        ${process.env.PUBLIC_URL || 'Not set (run ngrok)'}  ║
╠══════════════════════════════════════════════════════╣
║  API Keys Status:                                    ║
║  Twilio:      ${process.env.TWILIO_ACCOUNT_SID ? '✅ Configured' : '❌ Missing (TWILIO_ACCOUNT_SID)'}      ║
║  Deepgram:    ${process.env.DEEPGRAM_API_KEY    ? '✅ Configured' : '❌ Missing (DEEPGRAM_API_KEY)'}        ║
║  Gemini:      ${process.env.GEMINI_API_KEY      ? '✅ Configured' : '❌ Missing (GEMINI_API_KEY)'}          ║
║  ElevenLabs:  ${process.env.ELEVENLABS_API_KEY  ? '✅ Configured' : '⚠️  Missing (using Polly fallback)'}  ║
║  Supabase:    ${process.env.SUPABASE_URL        ? '✅ Configured' : '⚠️  Missing (no DB persistence)'}     ║
╠══════════════════════════════════════════════════════╣
║  📞 Twilio Webhook URL (set in Twilio console):      ║
║  ${(process.env.PUBLIC_URL || 'YOUR_NGROK_URL') + '/api/twilio/incoming-call'}  ║
╚══════════════════════════════════════════════════════╝
  `);
});

export default app;
