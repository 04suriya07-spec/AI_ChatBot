import React, { useState } from 'react';
import { 
  Sliders, 
  Volume2, 
  Sparkles, 
  Bot, 
  Check, 
  Globe, 
  HeartHandshake, 
  Smile, 
  Zap, 
  ShieldCheck, 
  Key, 
  Play
} from 'lucide-react';
import { useReceptionist } from '../../context/ReceptionistContext';
import { useClient } from '../../context/ClientContext';
import { accentsList, voiceProviders } from '../../services/voiceEmotionService';
import { speechService } from '../../services/speechService';

export const VoiceStudio = () => {
  const { activeClient, updateClient } = useClient();
  const { playGreeting } = useReceptionist();

  const [selectedAccent, setSelectedAccent] = useState('en-US-general');
  const [selectedProvider, setSelectedProvider] = useState('browser');
  const [warmth, setWarmth] = useState(85);
  const [empathy, setEmpathy] = useState(90);
  const [energy, setEnergy] = useState(70);
  const [formality, setFormality] = useState(80);
  const [enableFillers, setEnableFillers] = useState(true);
  const [enableBreathing, setEnableBreathing] = useState(true);
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleTestVoice = (samplePhrase) => {
    const text = samplePhrase || `Hello! Thank you for calling ${activeClient.name}. I'm Aura, your AI receptionist. Let me assist you right away.`;
    speechService.speak(text, {
      pitch: activeClient.voiceConfig?.voicePitch || 1.0,
      rate: activeClient.voiceConfig?.voiceRate || 1.0
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateClient(activeClient.id, {
      voiceConfig: {
        ...activeClient.voiceConfig,
        accent: selectedAccent,
        provider: selectedProvider,
        warmth,
        empathy,
        energy,
        formality,
        enableFillers,
        enableBreathing
      }
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-400 border border-purple-800 text-[11px] font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            HUMAN REALISM & EMOTION STUDIO
          </div>
          <h2 className="text-xl font-bold font-display text-white">
            Human-Grade Voice, Accents & Behavior Tuning
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure emotional warmth, regional accents, natural speech pauses, and conversational disfluencies for {activeClient.name}.
          </p>
        </div>

        {savedSuccess && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-semibold animate-fadeIn">
            <Check className="w-3.5 h-3.5" />
            Studio Profile Saved
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        
        {/* 1. Regional Accents & Dialects */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              1. Select Regional Human Accent
            </h3>
            <span className="text-[11px] text-slate-400">Click any sample to audition live</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {accentsList.map((acc) => {
              const isSelected = selectedAccent === acc.id;
              return (
                <div
                  key={acc.id}
                  onClick={() => {
                    setSelectedAccent(acc.id);
                    handleTestVoice(acc.sample);
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-brand-950/70 border-brand-500 shadow-lg shadow-brand-500/20'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-lg">{acc.flag}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTestVoice(acc.sample);
                      }}
                      className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400"
                      title="Audition accent"
                    >
                      <Play className="w-3 h-3" />
                    </button>
                  </div>
                  <h4 className="font-bold text-slate-100 text-xs">{acc.name}</h4>
                  <p className="text-[10px] text-slate-400 italic mt-1">"{acc.sample}"</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Emotional Tone & Persona Sliders */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-5">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-rose-400" />
            2. Emotional Inflection & Conversational Warmth Sliders
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Warmth */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex justify-between font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Smile className="w-3.5 h-3.5 text-amber-400" />
                  Conversational Warmth & Welcoming Tone
                </span>
                <span className="font-mono text-amber-400">{warmth}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={warmth}
                onChange={(e) => setWarmth(parseInt(e.target.value))}
                className="w-full accent-amber-400"
              />
              <p className="text-[10px] text-slate-500">Adds smiling intonation, friendly pitch modulation, and hospitable warmth.</p>
            </div>

            {/* Empathy */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex justify-between font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
                  Empathy & Active Listening
                </span>
                <span className="font-mono text-rose-400">{empathy}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={empathy}
                onChange={(e) => setEmpathy(parseInt(e.target.value))}
                className="w-full accent-rose-400"
              />
              <p className="text-[10px] text-slate-500">Crucial for clinics and client services — softens responses to stressed callers.</p>
            </div>

            {/* Energy */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex justify-between font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  Vocal Energy & Upbeat Pacing
                </span>
                <span className="font-mono text-cyan-400">{energy}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={energy}
                onChange={(e) => setEnergy(parseInt(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <p className="text-[10px] text-slate-500">Adjusts dynamic pacing so the receptionist never sounds robotic or monotone.</p>
            </div>

            {/* Formality */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex justify-between font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
                  Corporate Formality & Politeness
                </span>
                <span className="font-mono text-brand-400">{formality}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={formality}
                onChange={(e) => setFormality(parseInt(e.target.value))}
                className="w-full accent-brand-500"
              />
              <p className="text-[10px] text-slate-500">High formality for law firms and executive suites; casual for salons and modern studios.</p>
            </div>
          </div>
        </div>

        {/* 3. Conversational Human Realism (Fillers & Breathing) */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Bot className="w-4 h-4 text-emerald-400" />
            3. Natural Human Speech Realism & Disfluencies
          </h3>

          <div className="space-y-3">
            <label className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={enableFillers}
                onChange={(e) => setEnableFillers(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-brand-600 accent-brand-500"
              />
              <div>
                <span className="font-bold text-slate-200 block">Natural Conversational Fillers & Affirmations</span>
                <span className="text-slate-400 text-[11px]">
                  Inserts natural human phrases like <em>"Let me check that for you...", "Ah, got it!", "Sure thing, one second..."</em> before looking up records.
                </span>
              </div>
            </label>

            <label className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={enableBreathing}
                onChange={(e) => setEnableBreathing(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-brand-600 accent-brand-500"
              />
              <div>
                <span className="font-bold text-slate-200 block">Subtle Natural Breathing & Micro-Pauses</span>
                <span className="text-slate-400 text-[11px]">
                  Adds micro-pauses at punctuation boundaries to mimic authentic human lung capacity and cadence.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* 4. Ultra-Realistic Voice Providers */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-purple-400" />
              4. Next-Gen Voice Synthesis Engine
            </h3>
            <span className="text-[10px] bg-purple-950 text-purple-400 border border-purple-800 px-2 py-0.5 rounded font-bold">
              Production Telephony Grade
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {voiceProviders.map((vp) => (
              <div
                key={vp.id}
                onClick={() => setSelectedProvider(vp.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  selectedProvider === vp.id
                    ? 'bg-purple-950/60 border-purple-500 shadow-lg shadow-purple-500/20'
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-xs">{vp.name}</h4>
                  <span className="font-mono text-[10px] text-cyan-400">{vp.latency}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Quality: <strong className="text-slate-300">{vp.quality}</strong></p>
              </div>
            ))}
          </div>

          {selectedProvider === 'elevenlabs' && (
            <div className="pt-2 animate-fadeIn">
              <label className="block text-slate-400 mb-1">ElevenLabs API Key (Optional)</label>
              <input
                type="password"
                value={elevenLabsApiKey}
                onChange={(e) => setElevenLabsApiKey(e.target.value)}
                placeholder="sk_..."
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono text-xs"
              />
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <Check className="w-4 h-4" />
            Apply Human Voice Studio Tuning
          </button>
        </div>

      </form>
    </div>
  );
};
