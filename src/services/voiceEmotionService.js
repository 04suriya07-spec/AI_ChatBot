// Voice Emotion, Human Speech Realism & Accent Service

export const accentsList = [
  { id: 'en-US-general', name: 'American (General / Standard)', flag: '🇺🇸', sample: 'Hello, welcome to our office!' },
  { id: 'en-GB-rp', name: 'British (Received Pronunciation / London)', flag: '🇬🇧', sample: 'Good day, welcome to our front desk.' },
  { id: 'en-AU-sydney', name: 'Australian (Sydney / Warm)', flag: '🇦🇺', sample: 'G\'day, how can I help you today?' },
  { id: 'en-IN-delhi', name: 'Indian English (Professional)', flag: '🇮🇳', sample: 'Namaste, welcome! How may I assist you?' },
  { id: 'en-US-southern', name: 'American (Southern Warmth)', flag: '🇺🇸', sample: 'Hi there! So glad to have you with us today.' },
  { id: 'en-CA-toronto', name: 'Canadian (Clear / Friendly)', flag: '🇨🇦', sample: 'Hello, welcome! How can I help you out?' }
];

export const voiceProviders = [
  { id: 'elevenlabs', name: 'ElevenLabs Ultra-HD (Hyper-Realistic Human)', latency: '~220ms', quality: 'Studio 100%' },
  { id: 'openai', name: 'OpenAI Realtime Voice (Alloy, Nova, Shimmer)', latency: '~200ms', quality: 'Conversational 98%' },
  { id: 'cartesia', name: 'Cartesia Sonic (Sub-100ms Ultra-Fast)', latency: '~95ms', quality: 'Instant 95%' },
  { id: 'browser', name: 'Browser Neural TTS (Zero-Latency Offline)', latency: '~20ms', quality: 'Native HD' }
];

export const naturalFillers = [
  "Let me check that right away for you...",
  "Ah, absolutely!",
  "Sure thing, one moment please...",
  "Got it, looking into the schedule now...",
  "Certainly! Let me pull up those details...",
  "Right away!"
];

export function enrichWithHumanRealism(text, { useFillers = true, warmth = 0.8, empathy = 0.7 }) {
  if (!text) return text;

  // Optionally prepend a natural human conversational filler if processing a request
  let enriched = text;

  if (useFillers && (text.includes('check in') || text.includes('appointment') || text.includes('message') || text.includes('booked'))) {
    const filler = naturalFillers[Math.floor(Math.random() * naturalFillers.length)];
    if (!text.startsWith("Let me") && !text.startsWith("Sure thing") && !text.startsWith("Ah,")) {
      enriched = `${filler} ${text}`;
    }
  }

  return enriched;
}
