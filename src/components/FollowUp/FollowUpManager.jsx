import React, { useState } from 'react';
import { 
  RotateCw, 
  PhoneOutgoing, 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  Play, 
  Sparkles, 
  Volume2, 
  AlertCircle 
} from 'lucide-react';
import { useClient } from '../../context/ClientContext';
import { speechService } from '../../services/speechService';

export const FollowUpManager = () => {
  const { activeClient } = useClient();
  const leads = activeClient.leads || [];
  const [activeOutboundCall, setActiveOutboundCall] = useState(null);
  const [callProgress, setCallProgress] = useState('calling'); // 'calling' | 'connected' | 'completed'

  const scheduledFollowUps = leads.filter(l => l.followUpDate);

  const handleSimulateOutboundCall = (lead) => {
    setActiveOutboundCall(lead);
    setCallProgress('calling');

    setTimeout(() => {
      setCallProgress('connected');
      const script = `Hi ${lead.name}, this is Maya calling from ${activeClient.name}. You spoke with us yesterday regarding the ${lead.requirement} in ${lead.location || 'Chennai'}. I wanted to check if you had any questions or if you'd like to schedule your private tour?`;
      speechService.speak(script, {
        pitch: activeClient.voiceConfig?.voicePitch || 1.0,
        rate: activeClient.voiceConfig?.voiceRate || 1.0,
        onEnd: () => {
          setTimeout(() => setCallProgress('completed'), 1500);
        }
      });
    }, 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950/40 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-bold mb-2">
            <RotateCw className="w-3.5 h-3.5" />
            AUTOMATED OUTBOUND FOLLOW-UP CALLS
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            Scheduled AI Callbacks & Lead Retention
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            When a caller says <em>"I'll think about it"</em> or asks for pricing, Aura schedules automated follow-up calls to re-engage the lead and close the appointment.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-slate-900/90 border border-slate-800 text-right">
          <span className="text-[10px] text-slate-400 font-semibold block">Scheduled Queue</span>
          <span className="text-xl font-bold font-display text-cyan-400">{scheduledFollowUps.length} Pending Callbacks</span>
        </div>
      </div>

      {/* Outbound Scheduled Call Queue */}
      <div className="space-y-4">
        {scheduledFollowUps.map((lead) => (
          <div
            key={lead.id}
            className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-bold text-lg shrink-0">
                <PhoneOutgoing className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-white">{lead.name}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    lead.status === 'HOT' ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {lead.status} LEAD
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Topic: <strong className="text-brand-300">{lead.requirement}</strong> ({lead.budget}) &bull; Location: {lead.location}
                </p>
                <p className="text-[11px] text-slate-400 flex items-center gap-2 pt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  Scheduled For: <strong className="text-slate-200">{lead.followUpDate} at {lead.followUpTime}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <button
                onClick={() => handleSimulateOutboundCall(lead)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-600/20 transition-all hover:scale-105"
              >
                <PhoneOutgoing className="w-4 h-4" />
                Simulate AI Outbound Call
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Live Simulated Outbound Call Modal */}
      {activeOutboundCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-6 text-center">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                {callProgress === 'calling' ? 'DIALING PROSPECT...' : callProgress === 'connected' ? 'AI OUTBOUND CALL IN PROGRESS' : 'CALL COMPLETED'}
              </span>
              <h3 className="text-xl font-bold font-display text-white">{activeOutboundCall.name}</h3>
              <p className="text-xs font-mono text-slate-400">{activeOutboundCall.phone}</p>
            </div>

            <div className="py-6 flex justify-center">
              <div className={`w-28 h-28 rounded-full flex items-center justify-center transition-all ${
                callProgress === 'calling' ? 'bg-cyan-500/20 border-2 border-cyan-400 animate-ping' :
                callProgress === 'connected' ? 'bg-emerald-500/20 border-2 border-emerald-400 shadow-xl shadow-emerald-500/30 scale-105' :
                'bg-slate-800'
              }`}>
                <PhoneOutgoing className={`w-12 h-12 ${callProgress === 'connected' ? 'text-emerald-400 animate-bounce' : 'text-cyan-400'}`} />
              </div>
            </div>

            {callProgress === 'connected' && (
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 italic text-left space-y-1">
                <span className="text-[10px] text-cyan-400 font-bold not-italic block">Maya Speaking to Customer:</span>
                <p>"Hi {activeOutboundCall.name}, this is Maya calling from {activeClient.name}. You spoke with us yesterday regarding {activeOutboundCall.requirement}. I wanted to check if you had any questions or would like to schedule your private tour?"</p>
              </div>
            )}

            <button
              onClick={() => {
                speechService.stopSpeaking();
                setActiveOutboundCall(null);
              }}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
            >
              Hang Up / Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
