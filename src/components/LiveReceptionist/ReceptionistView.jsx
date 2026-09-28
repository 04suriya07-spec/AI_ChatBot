import React from 'react';
import { 
  Building2, 
  Clock, 
  MapPin, 
  Phone, 
  Users, 
  CalendarCheck, 
  MessageSquareText, 
  Wifi, 
  Car,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useReceptionist } from '../../context/ReceptionistContext';
import { VoiceVisualizer } from '../VoiceVisualizer';
import { TranscriptBox } from './TranscriptBox';
import { VoiceControls } from './VoiceControls';

export const ReceptionistView = () => {
  const { 
    companyInfo, 
    receptionistState, 
    toggleListening, 
    visitors, 
    appointments, 
    messages 
  } = useReceptionist();

  const activeVisitorsCount = visitors.filter(v => v.status === 'Checked In').length;
  const todayAppointmentsCount = appointments.filter(a => a.status === 'Confirmed').length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      
      {/* Left Column: Virtual Front Desk & AI Avatar Kiosk */}
      <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
        
        {/* Company & Kiosk Title Header */}
        <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-xl">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold">
                <Building2 className="w-3.5 h-3.5" />
                VIRTUAL FRONT DESK KIOSK
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
                {companyInfo?.name || 'Apex Global Technologies'}
              </h1>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span className="truncate">{companyInfo?.address}</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center text-white font-display font-extrabold text-lg shadow-lg">
              A
            </div>
          </div>

          {/* Quick Facility Info Badges */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 truncate">
              <Wifi className="w-3.5 h-3.5 text-cyan-400" />
              <span>WiFi: <strong className="text-slate-200 font-mono">{companyInfo?.wifiName}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Car className="w-3.5 h-3.5 text-emerald-400" />
              <span>Parking: <strong className="text-slate-200">Level B2 Free</strong></span>
            </div>
          </div>
        </div>

        {/* Central Glowing AI Voice Avatar Orb */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 rounded-3xl bg-gradient-to-b from-slate-900/80 to-slate-950/90 backdrop-blur-2xl border border-slate-800/80 shadow-2xl relative overflow-hidden">
          
          {/* Ambient Background Aura */}
          <div className="absolute w-72 h-72 rounded-full bg-brand-500/10 blur-3xl pointer-events-none"></div>
          
          <VoiceVisualizer 
            state={receptionistState} 
            onClick={toggleListening} 
          />

          <div className="mt-4 text-center">
            <h2 className="text-lg font-bold font-display text-slate-100 flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-400" />
              Aura Voice Assistant
            </h2>
            <p className="text-xs text-slate-400 max-w-xs mt-1">
              Tap the orb or microphone below to speak naturally. Aura will answer, book, check in, and guide you.
            </p>
          </div>
        </div>

        {/* Front Desk Live Pulse Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">Active Guests</span>
            <span className="text-lg font-bold font-display text-emerald-400">{activeVisitorsCount}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">Today's Appts</span>
            <span className="text-lg font-bold font-display text-cyan-400">{todayAppointmentsCount}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">Messages</span>
            <span className="text-lg font-bold font-display text-purple-400">{messages.length}</span>
          </div>
        </div>

      </div>

      {/* Right Column: Live Conversation Transcript & Dock */}
      <div className="lg:col-span-7 flex flex-col justify-between space-y-4 h-[650px] lg:h-auto">
        <div className="flex-1 min-h-0">
          <TranscriptBox />
        </div>

        <div>
          <VoiceControls />
        </div>
      </div>

    </div>
  );
};
