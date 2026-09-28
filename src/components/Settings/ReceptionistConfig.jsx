import React, { useState } from 'react';
import { 
  Sliders, 
  Volume2, 
  Key, 
  Sparkles, 
  Bot, 
  Check, 
  Building, 
  Stethoscope, 
  Hotel, 
  Scissors,
  Save
} from 'lucide-react';
import { useReceptionist } from '../../context/ReceptionistContext';
import { industryTemplates } from '../../services/mockData';

export const ReceptionistConfig = () => {
  const { 
    settings, 
    setSettings, 
    companyInfo, 
    setCompanyInfo, 
    changeIndustryMode, 
    availableVoices, 
    playGreeting 
  } = useReceptionist();

  const [savedSuccess, setSavedSuccess] = useState(false);

  const industries = [
    { id: 'corporate', name: 'Corporate Office', icon: Building, desc: 'Visitor badges, meetings, boardrooms, staff directory' },
    { id: 'medical', name: 'Medical / Clinic', icon: Stethoscope, desc: 'Patient check-in, doctor appointments, triage guidance' },
    { id: 'hospitality', name: 'Hotel & Resort', icon: Hotel, desc: 'Guest check-in, concierge, amenities, room reservations' },
    { id: 'salon', name: 'Salon & Spa', icon: Scissors, desc: 'Stylist sessions, beauty bookings, service pricing' }
  ];

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-brand-400" />
            Receptionist Persona & Voice Intelligence
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tune Aura's voice characteristics, LLM intelligence parameters, and industry operational mode.
          </p>
        </div>

        {savedSuccess && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-semibold animate-fadeIn">
            <Check className="w-3.5 h-3.5" />
            Settings Saved
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Industry Persona Mode Selector */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Bot className="w-4 h-4 text-brand-400" />
            Select Industry Persona Mode
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {industries.map((ind) => {
              const Icon = ind.icon;
              const isSelected = settings.industry === ind.id;
              return (
                <div
                  key={ind.id}
                  onClick={() => changeIndustryMode(ind.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-brand-950/60 border-brand-500 shadow-lg shadow-brand-500/10'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-brand-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{ind.name}</h4>
                      {isSelected && <span className="text-[10px] text-brand-400 font-semibold">&bull; Active Mode</span>}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 pl-11">{ind.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Voice Parameters & TTS Tuning */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              Speech & Natural Voice Synthesis Tuning
            </h3>
            <button
              type="button"
              onClick={() => playGreeting()}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5" />
              Test Voice Playback
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            
            {/* Voice Dropdown */}
            <div className="col-span-full">
              <label className="block text-slate-400 mb-1 font-medium">Text-to-Speech Synthetic Voice</label>
              <select
                value={settings.voiceURI}
                onChange={(e) => setSettings(prev => ({ ...prev, voiceURI: e.target.value }))}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs"
              >
                <option value="">Default High-Definition Browser Voice</option>
                {availableVoices.map((v, i) => (
                  <option key={i} value={v.voiceURI || v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>

            {/* Pitch */}
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Voice Pitch</span>
                <span className="font-mono text-cyan-400">{settings.voicePitch}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.05"
                value={settings.voicePitch}
                onChange={(e) => setSettings(prev => ({ ...prev, voicePitch: parseFloat(e.target.value) }))}
                className="w-full accent-cyan-400"
              />
            </div>

            {/* Speed Rate */}
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Speaking Rate</span>
                <span className="font-mono text-brand-400">{settings.voiceRate}x</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.4"
                step="0.05"
                value={settings.voiceRate}
                onChange={(e) => setSettings(prev => ({ ...prev, voiceRate: parseFloat(e.target.value) }))}
                className="w-full accent-brand-500"
              />
            </div>

          </div>

          {/* Toggles */}
          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-6 text-xs text-slate-300">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.soundFxEnabled}
                onChange={(e) => setSettings(prev => ({ ...prev, soundFxEnabled: e.target.checked }))}
                className="w-4 h-4 rounded text-brand-600 accent-brand-500"
              />
              <span>Play audio chimes & feedback tones</span>
            </label>
          </div>
        </div>

        {/* Gemini LLM API Key (Optional Turbo Power) */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-purple-400" />
              Google Gemini LLM Integration (Optional)
            </h3>
            <span className="text-[10px] bg-purple-950 text-purple-400 border border-purple-800 px-2 py-0.5 rounded font-semibold">
              Zero-Setup Fallback Enabled
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Aura has a built-in high-precision receptionist semantic engine that works 100% offline out-of-the-box. Providing a Gemini API key unlocks unlimited natural conversation, advanced reasoning, and multilingual hospitality capabilities.
          </p>

          <div>
            <label className="block text-slate-400 mb-1 text-xs">Gemini API Key</label>
            <input
              type="password"
              value={settings.geminiApiKey}
              onChange={(e) => setSettings(prev => ({ ...prev, geminiApiKey: e.target.value }))}
              placeholder="AIzaSy..."
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs font-mono"
            />
          </div>
        </div>

        {/* Custom Greeting Script */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-400" />
            Custom Front Desk Greeting Message
          </h3>

          <div>
            <textarea
              rows={3}
              value={settings.customGreeting || industryTemplates[settings.industry]?.greeting}
              onChange={(e) => setSettings(prev => ({ ...prev, customGreeting: e.target.value }))}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs leading-relaxed"
              placeholder="Enter custom spoken greeting when guests approach the virtual front desk..."
            />
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <Save className="w-4 h-4" />
              Save Configuration
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};
