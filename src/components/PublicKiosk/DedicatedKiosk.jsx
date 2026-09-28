import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Stethoscope, 
  Scale, 
  Hotel, 
  Scissors, 
  Sparkles, 
  Clock, 
  MapPin, 
  Wifi, 
  Car, 
  X, 
  Minimize2, 
  Volume2, 
  CheckCircle2, 
  HelpCircle,
  PhoneCall
} from 'lucide-react';
import { useReceptionist } from '../../context/ReceptionistContext';
import { VoiceVisualizer } from '../VoiceVisualizer';
import { TranscriptBox } from '../LiveReceptionist/TranscriptBox';
import { VoiceControls } from '../LiveReceptionist/VoiceControls';

export const DedicatedKiosk = ({ client, onClose }) => {
  const { 
    companyInfo, 
    receptionistState, 
    toggleListening, 
    visitors, 
    appointments 
  } = useReceptionist();

  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const brandColor = client.branding?.primaryColor || '#3b82f6';
  const accentColor = client.branding?.accentColor || '#06b6d4';

  const getIndustryIcon = (ind) => {
    switch (ind) {
      case 'medical': return Stethoscope;
      case 'hospitality': return Hotel;
      case 'salon': return Scissors;
      default: return Building2;
    }
  };

  const Icon = getIndustryIcon(client.industry);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col justify-between overflow-y-auto animate-fadeIn select-none">
      
      {/* Background Ambience tailored to Client Brand Color */}
      <div 
        className="fixed top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none opacity-20"
        style={{ backgroundColor: brandColor }}
      />
      <div 
        className="fixed bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-15"
        style={{ backgroundColor: accentColor }}
      />

      {/* Kiosk Top Navigation Bar */}
      <header className="p-4 sm:p-6 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl shrink-0 z-10">
        
        {/* Brand Header */}
        <div className="flex items-center gap-3.5">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-brand-500/20"
            style={{ backgroundColor: brandColor }}
          >
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
                {client.name}
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/10 text-slate-300">
                Front Desk Kiosk
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{client.companyInfo?.address}</span>
            </p>
          </div>
        </div>

        {/* Digital Clock & Exit Button */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <span className="text-xl font-bold font-mono text-white tracking-wider block leading-tight">
              {currentTime}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              {currentDate}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white flex items-center gap-2 text-xs font-semibold shadow-lg transition-colors"
            title="Exit Standalone Kiosk Mode"
          >
            <Minimize2 className="w-4 h-4" />
            <span className="hidden md:inline">Exit Kiosk</span>
          </button>
        </div>

      </header>

      {/* Main Kiosk Interactivity Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left Column: AI Voice Avatar & Welcome */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center text-center space-y-6">
          
          <div className="space-y-2">
            <span 
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-md"
              style={{ backgroundColor: `${brandColor}20`, borderColor: `${brandColor}40`, color: brandColor }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Autonomous Voice Concierge
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
              {client.branding?.kioskTitle || `Welcome to ${client.name}`}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              "{client.voiceConfig?.customGreeting || client.branding?.welcomeMessage}"
            </p>
          </div>

          {/* Central Animated Orb */}
          <div className="py-2">
            <VoiceVisualizer 
              state={receptionistState} 
              onClick={toggleListening} 
            />
          </div>

          {/* Amenities Badges */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-sm text-xs">
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center gap-2">
              <Wifi className="w-4 h-4 text-cyan-400 shrink-0" />
              <div className="text-left truncate">
                <span className="text-slate-500 block text-[10px]">Guest Wi-Fi</span>
                <span className="font-mono font-bold text-slate-200 truncate block">{client.companyInfo?.wifiName}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center gap-2">
              <Car className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="text-left truncate">
                <span className="text-slate-500 block text-[10px]">Parking</span>
                <span className="font-bold text-slate-200 truncate block">Validated on-site</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Live Transcript & Controls Dock */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4 h-[600px] lg:h-[680px]">
          <div className="flex-1 min-h-0">
            <TranscriptBox />
          </div>
          <div>
            <VoiceControls />
          </div>
        </div>

      </main>

      {/* Kiosk Footer */}
      <footer className="p-4 border-t border-slate-900 text-center text-xs text-slate-500 bg-slate-950/80 shrink-0">
        <span>Powered by AuraDesk AI Autonomous Front Desk Engine &bull; {client.name}</span>
      </footer>

    </div>
  );
};
