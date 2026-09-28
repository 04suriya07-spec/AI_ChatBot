/**
 * AuraDesk AI — ElevenLabs TTS Service
 * 
 * Converts Gemini's text reply → ultra-realistic audio (mp3)
 * then streams it back to the caller via Twilio <Play> TwiML.
 * 
 * Also supports browser Web Speech API fallback for local dev.
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const ELEVENLABS_BASE = 'https://api.elevenlabs.io/v1';

/**
 * Synthesize speech using ElevenLabs Streaming API
 * Returns audio as a Buffer (mp3 bytes)
 * 
 * @param {string} text - Text to convert to speech
 * @param {Object} options
 * @param {string} options.voiceId - ElevenLabs voice ID
 * @param {number} options.stability - Voice stability 0-1 (default 0.5)
 * @param {number} options.similarityBoost - Similarity boost 0-1 (default 0.75)
 * @param {number} options.style - Style exaggeration 0-1 (default 0.0)
 * @returns {Buffer|null} mp3 audio buffer
 */
export async function synthesizeSpeech(text, {
  voiceId,
  stability = 0.5,
  similarityBoost = 0.75,
  style = 0.0,
  speakerBoost = true
} = {}) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voice = voiceId || process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM'; // Default: Rachel

  if (!apiKey) {
    console.warn('⚠️  ELEVENLABS_API_KEY not set — TTS disabled. Falling back to Twilio Polly.');
    return null;
  }

  // Clean text for speech (remove markdown, long pauses, etc.)
  const cleanText = text
    .replace(/[*_#`~[\]()]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 5000); // ElevenLabs limit

  if (!cleanText) return null;

  try {
    const response = await fetch(`${ELEVENLABS_BASE}/text-to-speech/${voice}/stream`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg'
      },
      body: JSON.stringify({
        text: cleanText,
        model_id: 'eleven_turbo_v2',  // Lowest latency model
        voice_settings: {
          stability,
          similarity_boost: similarityBoost,
          style,
          use_speaker_boost: speakerBoost
        },
        output_format: 'mp3_22050_32'
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('ElevenLabs TTS error:', response.status, errText);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);

  } catch (err) {
    console.error('ElevenLabs fetch error:', err.message);
    return null;
  }
}

/**
 * Get available voices from ElevenLabs account
 * Useful for populating the Voice Studio UI
 */
export async function listVoices() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) return [];

  try {
    const res = await fetch(`${ELEVENLABS_BASE}/voices`, {
      headers: { 'xi-api-key': apiKey }
    });
    const data = await res.json();
    return data.voices?.map(v => ({
      id: v.voice_id,
      name: v.name,
      category: v.category,
      preview: v.preview_url
    })) || [];
  } catch {
    return [];
  }
}

/**
 * Fallback: Twilio built-in neural TTS (Polly)
 * Used when ElevenLabs key is not available or as backup.
 * Returns a TwiML <Say> XML string instead of audio bytes.
 */
export function getTwiMLSay(text, voice = 'Polly.Joanna-Neural') {
  const clean = text.replace(/[<>&'"]/g, ' ').trim();
  return `<Say voice="${voice}">${clean}</Say>`;
}
