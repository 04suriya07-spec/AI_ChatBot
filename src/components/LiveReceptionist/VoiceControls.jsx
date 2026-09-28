import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Send, 
  Sparkles, 
  RotateCcw, 
  Volume2, 
  AlertCircle,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { useReceptionist } from '../../context/ReceptionistContext';
import { speechService } from '../../services/speechService';

export const VoiceControls = () => {
  const { 
    receptionistState, 
    toggleListening, 
    handleUserUtterance, 
    clearConversation,
    playGreeting 
  } = useReceptionist();

  const [textInput, setTextInput] = useState('');
  const [micAudioLevel, setMicAudioLevel] = useState(0);
  const [micError, setMicError] = useState(null);
  const animationFrameRef = useRef(null);

  // Listen for speech errors
  useEffect(() => {
    speechService.onErrorCallback = (errorMsg) => {
      setMicError(errorMsg);
      setTimeout(() => setMicError(null), 8000);
    };
  }, []);

  // Monitor live audio input decibels using Web Audio API when listening
  useEffect(() => {
    let audioCtx;
    let analyser;
    let source;

    if (receptionistState === 'listening' && speechService.mediaStream) {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        source = audioCtx.createMediaStreamSource(speechService.mediaStream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const checkVolume = () => {
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const average = sum / dataArray.length;
          setMicAudioLevel(Math.min(100, Math.round((average / 128) * 100)));
          animationFrameRef.current = requestAnimationFrame(checkVolume);
        };

        checkVolume();
      } catch (e) {
        console.warn('Audio meter setup error:', e);
      }
    } else {
      setMicAudioLevel(0);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioCtx && audioCtx.state !== 'closed') {
        try { audioCtx.close(); } catch (e) {}
      }
    };
  }, [receptionistState]);

  const handleSendText = (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    handleUserUtterance(textInput.trim());
    setTextInput('');
  };

  const samplePrompts = [
    { label: "👋 Check In (John to meet Sarah)", text: "Hi, I'm John Doe from Apex Capital to check in for my meeting with Sarah Connor." },
    { label: "📅 Book Appointment (David @ 2 PM)", text: "I'd like to book an appointment with David Miller tomorrow at 2:00 PM." },
    { label: "📶 WiFi & Parking Info", text: "What is the guest Wi-Fi password and where can I park?" },
    { label: "📞 Leave Message for CEO", text: "Marcus is in a meeting? Please take an urgent message that Thomas called from Oracle regarding contract terms." },
    { label: "🔍 Find Staff Location", text: "Is Dr. Jessica Chen available and where is her clinic office?" },
    { label: "🚪 Check Out", text: "I have finished my meeting and would like to check out." }
  ];

  return (
    <div className="space-y-4">
      
      {/* Microphone Error / Permission Alert Banner */}
      {micError && (
        <div className="p-3.5 rounded-2xl bg-amber-950/80 border border-amber-500/50 text-amber-200 text-xs flex items-center justify-between gap-3 animate-fadeIn shadow-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{micError}</span>
          </div>
          <button
            onClick={toggleListening}
            className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] shrink-0"
          >
            Grant Mic Access
          </button>
        </div>
      )}

      {/* Quick Action Suggestion Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          Quick Speak:
        </span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleUserUtterance(p.text)}
            className="shrink-0 px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-brand-900/60 border border-slate-700 hover:border-brand-500/50 text-xs text-slate-300 hover:text-white transition-all shadow-sm active:scale-95"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Primary Voice Dock & Controls */}
      <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 shadow-2xl flex flex-col md:flex-row items-center gap-4">
        
        {/* Main Microphone Button & Live Decibel Meter */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-center">
          <div className="relative">
            {receptionistState === 'listening' && (
              <span className="absolute -inset-2 rounded-full bg-cyan-500/30 animate-ping"></span>
            )}
            <button
              onClick={toggleListening}
              className={`relative z-10 p-4 rounded-full font-bold text-white shadow-xl transition-all duration-300 transform active:scale-90 flex items-center justify-center ${
                receptionistState === 'listening'
                  ? 'bg-cyan-500 hover:bg-cyan-400 ring-4 ring-cyan-500/30 shadow-cyan-500/50 scale-105'
                  : receptionistState === 'speaking'
                  ? 'bg-emerald-600 hover:bg-emerald-500 ring-4 ring-emerald-500/30 shadow-emerald-500/50'
                  : 'bg-brand-600 hover:bg-brand-500 hover:scale-105 shadow-brand-600/30'
              }`}
              title={receptionistState === 'listening' ? 'Click to stop listening' : 'Click to speak to receptionist'}
            >
              {receptionistState === 'listening' ? (
                <MicOff className="w-6 h-6 animate-pulse" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </button>
          </div>

          <div className="text-left hidden sm:block min-w-[140px]">
            <span className="text-xs font-bold block text-slate-200">
              {receptionistState === 'listening' ? 'Listening to voice...' : 'Tap Mic & Speak'}
            </span>
            
            {/* Live Audio Level Meter */}
            {receptionistState === 'listening' ? (
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-20 h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-75"
                    style={{ width: `${Math.max(10, micAudioLevel)}%` }}
                  />
                </div>
                <span className="text-[10px] text-cyan-400 font-mono font-bold">{micAudioLevel > 15 ? 'Speaking' : 'Mic Active'}</span>
              </div>
            ) : (
              <span className="text-[11px] text-slate-400">
                Click mic or talk naturally
              </span>
            )}
          </div>
        </div>

        {/* Text Input Fallback Bar */}
        <form onSubmit={handleSendText} className="flex-1 flex items-center gap-2 w-full">
          <div className="relative flex-1">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Or type a question / command (e.g. Check in Sarah's guest)..."
              className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-950/80 border border-slate-700/80 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-slate-100 placeholder-slate-500 text-sm outline-none transition-all"
            />
            {textInput && (
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Utility Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => playGreeting()}
              title="Repeat Receptionist Greeting"
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={clearConversation}
              title="Reset Conversation Transcript"
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
