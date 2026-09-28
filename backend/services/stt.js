/**
 * AuraDesk AI — Deepgram Real-Time Streaming STT Service
 * 
 * Connects Twilio's Media Stream WebSocket (raw mulaw audio)
 * to Deepgram's Streaming API for live transcription.
 * 
 * Flow:
 * Twilio WS → This module → Deepgram WS → transcribed text
 */

import { WebSocket } from 'ws';
import dotenv from 'dotenv';
dotenv.config();

const DEEPGRAM_URL = 'wss://api.deepgram.com/v1/listen';

/**
 * Creates a Deepgram streaming WebSocket connection.
 * Returns the DG WebSocket so audio chunks can be sent to it.
 * 
 * @param {Function} onTranscript - Called with (finalText, interimText) when words are recognized
 * @param {Function} onError - Called on connection failure
 * @returns {WebSocket} deepgramWs
 */
export function createDeepgramStream(onTranscript, onError) {
  const apiKey = process.env.DEEPGRAM_API_KEY;

  if (!apiKey) {
    console.warn('⚠️  DEEPGRAM_API_KEY not set — STT disabled. Using fallback text input.');
    return null;
  }

  // Deepgram streaming params configured for Indian English (en-IN) with fallback
  const params = new URLSearchParams({
    encoding: 'mulaw',
    sample_rate: '8000',
    channels: '1',
    model: 'nova-2',
    language: 'en-IN',          // Indian English (optimised for Indian accents & terms)
    endpointing: '350',         // Fast turnaround after user stops speaking (350ms)
    interim_results: 'true',
    smart_format: 'true',
    utterance_end_ms: '1200',
    vad_events: 'true'
  });

  const dgWs = new WebSocket(`${DEEPGRAM_URL}?${params}`, {
    headers: { Authorization: `Token ${apiKey}` }
  });

  dgWs.on('open', () => {
    console.log('🎙️  Deepgram STT stream connected.');
  });

  dgWs.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      
      // Handle speech transcription events
      if (msg.type === 'Results') {
        const alt = msg.channel?.alternatives?.[0];
        if (!alt) return;

        const transcript = alt.transcript?.trim();
        if (!transcript) return;

        const isFinal = msg.is_final === true;
        const isSpeechFinal = msg.speech_final === true;

        if (isSpeechFinal && transcript) {
          // Complete utterance detected — trigger AI processing
          onTranscript(transcript, true);
        } else if (!isFinal && transcript) {
          // Interim result — show in UI but don't process yet
          onTranscript(transcript, false);
        }
      }

      // VAD: Utterance end event (speech stopped)
      if (msg.type === 'UtteranceEnd') {
        // Can be used to flush partial transcript if needed
      }

    } catch (e) {
      // Ignore malformed messages
    }
  });

  dgWs.on('error', (err) => {
    console.error('Deepgram WS error:', err.message);
    if (onError) onError(err);
  });

  dgWs.on('close', (code, reason) => {
    console.log(`Deepgram stream closed: ${code} ${reason}`);
  });

  return dgWs;
}

/**
 * Send Twilio's raw mulaw audio payload to Deepgram
 * Twilio sends base64-encoded audio in the 'media' event
 */
export function sendAudioChunk(dgWs, base64Payload) {
  if (!dgWs || dgWs.readyState !== WebSocket.OPEN) return;
  const audioBuffer = Buffer.from(base64Payload, 'base64');
  dgWs.send(audioBuffer);
}

/**
 * Cleanly close the Deepgram stream
 */
export function closeDeepgramStream(dgWs) {
  if (dgWs && dgWs.readyState === WebSocket.OPEN) {
    // Send CloseStream message before closing
    dgWs.send(JSON.stringify({ type: 'CloseStream' }));
    setTimeout(() => dgWs.terminate(), 500);
  }
}
