import React, { useState } from 'react';
import { 
  PhoneCall, 
  Search, 
  Clock, 
  Play, 
  Pause, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Sparkles, 
  ChevronRight, 
  ShieldCheck, 
  Volume2, 
  Flame,
  User,
  Filter
} from 'lucide-react';
import { useClient } from '../../context/ClientContext';
import { speechService } from '../../services/speechService';

export const CallLogsView = () => {
  const { activeClient } = useClient();
  const callLogs = activeClient.callLogs || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCall, setSelectedCall] = useState(callLogs[0] || null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const filteredCalls = callLogs.filter(c => 
    c.callerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.intent.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.outcome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.callerNumber.includes(searchQuery)
  );

  const handlePlayRecording = (call) => {
    if (isPlayingAudio) {
      speechService.stopSpeaking();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    // Simulate audio playback of the call transcript
    const fullSpeech = call.transcript.map(t => `${t.speaker}: ${t.text}`).join('. ');
    speechService.speak(fullSpeech, {
      pitch: 1.0,
      rate: 1.05,
      onEnd: () => setIsPlayingAudio(false)
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950/40 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            AI CALL INTELLIGENCE, RECORDINGS & TRANSCRIPTS
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            Call Logs & Structured Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Every call automatically generates an executive AI summary, structured intent, audio recording playback, and step-by-step tool actions log.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300">
            {callLogs.length} Total Calls Audited
          </span>
        </div>
      </div>

      {/* Two Column Layout: Call List on Left, Deep Dive on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Search & Call Logs Table / List */}
        <div className="lg:col-span-5 space-y-3">
          
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by caller, intent, or outcome..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="space-y-3 max-h-[640px] overflow-y-auto">
            {filteredCalls.map((call) => {
              const isSelected = selectedCall?.id === call.id;
              return (
                <div
                  key={call.id}
                  onClick={() => setSelectedCall(call)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2.5 ${
                    isSelected
                      ? 'bg-slate-900 border-brand-500 shadow-lg shadow-brand-500/10 ring-1 ring-brand-500/40'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{call.callerName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{call.callerNumber}</span>
                    </div>
                    <span className="font-mono text-[10px] text-cyan-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {call.duration}
                    </span>
                  </div>

                  <p className="text-xs text-brand-300 font-medium truncate">
                    Intent: {call.intent}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                    <span className="text-emerald-400 font-semibold">{call.outcome}</span>
                    <span>{call.timestamp}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Dive Call Intelligence Viewer (#19382 style) */}
        {selectedCall && (
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-6 animate-fadeIn">
            
            {/* Call Overview Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-cyan-400 block mb-1">
                  CALL AUDIT {selectedCall.id.toUpperCase()}
                </span>
                <h2 className="text-xl font-bold font-display text-white">{selectedCall.callerName}</h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedCall.callerNumber} &bull; {selectedCall.timestamp}</p>
              </div>

              {/* Audio Playback Simulator */}
              <button
                onClick={() => handlePlayRecording(selectedCall)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all ${
                  isPlayingAudio
                    ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                    : 'bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 text-white'
                }`}
              >
                {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlayingAudio ? 'Stop Audio Call Playback' : 'Play Call Recording'}</span>
              </button>
            </div>

            {/* AI Executive Summary Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-950/40 to-slate-950 border border-brand-500/30 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                AI Call Summary & Key Takeaways
              </span>
              <p className="text-xs text-slate-200 leading-relaxed italic">
                "{selectedCall.aiSummary}"
              </p>
              <div className="pt-2 flex items-center gap-4 text-xs">
                <span className="text-slate-400">Outcome: <strong className="text-emerald-400">{selectedCall.outcome}</strong></span>
                <span className="text-slate-400">Sentiment: <strong className="text-cyan-300">{selectedCall.sentiment}</strong></span>
              </div>
            </div>

            {/* AI Tool Actions Executed */}
            <div className="space-y-2.5">
              <h3 className="font-bold text-xs text-slate-300 uppercase tracking-wider">
                Autonomous AI Actions Executed During Call
              </h3>
              <div className="space-y-2">
                {selectedCall.aiActions?.map((action, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Full Conversation Transcript */}
            <div className="space-y-2.5">
              <h3 className="font-bold text-xs text-slate-300 uppercase tracking-wider">
                Word-for-Word Call Audio Transcript
              </h3>
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 max-h-60 overflow-y-auto text-xs">
                {selectedCall.transcript?.map((line, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <span className={`font-bold text-[10px] uppercase ${line.speaker === 'Aura' ? 'text-brand-400' : 'text-cyan-400'}`}>
                      {line.speaker}:
                    </span>
                    <p className="text-slate-300 leading-relaxed">{line.text}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
