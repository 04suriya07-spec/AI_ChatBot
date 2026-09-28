import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  User, 
  Building2, 
  Clock, 
  Send,
  RotateCcw
} from 'lucide-react';
import { useReceptionist } from '../../context/ReceptionistContext';
import { useClient } from '../../context/ClientContext';

export const PhoneSimulator = () => {
  const { activeClient } = useClient();
  const { 
    receptionistState, 
    toggleListening, 
    handleUserUtterance, 
    conversation, 
    interimText,
    playGreeting 
  } = useReceptionist();

  const [callStatus, setCallStatus] = useState('idle'); // 'idle' | 'ringing' | 'connected'
  const [callerNumber, setCallerNumber] = useState('+1 (415) 890-2134');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [typedInput, setTypedInput] = useState('');

  const scrollRef = useRef(null);

  // Call duration counter
  useEffect(() => {
    let timer;
    if (callStatus === 'connected') {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [callStatus]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation, interimText]);

  const formatDuration = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleStartInboundCall = () => {
    setCallStatus('ringing');
  };

  const handleAnswerCall = () => {
    setCallStatus('connected');
    playGreeting(activeClient.voiceConfig?.customGreeting || `Thank you for calling ${activeClient.name}. I'm Aura, your AI receptionist. How may I direct your call?`);
  };

  const handleEndCall = () => {
    setCallStatus('idle');
  };

  const handleSendText = (e) => {
    e.preventDefault();
    if (!typedInput.trim()) return;
    handleUserUtterance(typedInput.trim());
    setTypedInput('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-[11px] font-bold mb-1">
            <PhoneCall className="w-3.5 h-3.5" />
            TELEPHONY & PHONE CALL SIMULATOR
          </div>
          <h2 className="text-xl font-bold font-display text-white">
            Incoming Phone Call Experience: {activeClient.name}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Test how Aura answers real callers dialing the business phone line in real-time conversational audio.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={async () => {
              try {
                const res = await fetch('http://localhost:4000/api/twilio/call-me', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ phone: '+919843187793' })
                });
                const data = await res.json();
                if (data.success) {
                  alert('📲 Calling your phone (+91 9843187793) right now! Please pick up.');
                } else {
                  alert('Call error: ' + (data.error || 'Failed'));
                }
              } catch (e) {
                alert('Backend not reachable: ' + e.message);
              }
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all hover:scale-105"
          >
            <PhoneCall className="w-4 h-4 animate-bounce" />
            📞 Call My Phone (+91 9843187793)
          </button>

          {callStatus === 'idle' && (
            <button
              onClick={handleStartInboundCall}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all hover:scale-105"
            >
              <Phone className="w-4 h-4" />
              Browser Mic Call
            </button>
          )}
        </div>
      </div>

      {/* Simulator Device Frame & Live Transcripts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left: Smartphone Screen Frame */}
        <div className="md:col-span-5 flex justify-center">
          <div className="w-[320px] h-[580px] rounded-[44px] bg-slate-950 border-4 border-slate-800 shadow-2xl p-4 flex flex-col justify-between relative overflow-hidden ring-1 ring-slate-700/50">
            
            {/* Dynamic Speaker Notch */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-4 rounded-full bg-slate-900 flex items-center justify-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800"></div>
              <div className="w-10 h-1 rounded-full bg-slate-800"></div>
            </div>

            {/* IDLE STATE */}
            {callStatus === 'idle' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 pt-8">
                <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 shadow-inner">
                  <Phone className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">Virtual Phone Line</h3>
                  <p className="text-xs text-slate-400 font-mono">{activeClient.companyInfo?.phone || '+1 (800) 555-0199'}</p>
                </div>
                <p className="text-[11px] text-slate-500 max-w-[200px]">
                  Click below to simulate a customer dialing this business phone number.
                </p>
                <button
                  onClick={handleStartInboundCall}
                  className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-xl shadow-emerald-600/30 transition-all hover:scale-105"
                >
                  <PhoneCall className="w-4 h-4 animate-bounce" />
                  Place Call to Receptionist
                </button>
              </div>
            )}

            {/* RINGING STATE */}
            {callStatus === 'ringing' && (
              <div className="flex-1 flex flex-col items-center justify-between text-center py-10 animate-fadeIn">
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-cyan-400 animate-pulse tracking-wider">INCOMING CALL...</span>
                  <h3 className="text-xl font-bold text-white">{activeClient.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">{callerNumber}</p>
                </div>

                <div className="w-24 h-24 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 animate-ping">
                  <PhoneCall className="w-10 h-10" />
                </div>

                {/* Answer / Decline Actions */}
                <div className="flex items-center justify-around w-full px-4">
                  <button
                    onClick={handleEndCall}
                    className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 transition-transform active:scale-95"
                    title="Decline"
                  >
                    <PhoneOff className="w-6 h-6" />
                  </button>

                  <button
                    onClick={handleAnswerCall}
                    className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/40 transition-transform active:scale-95 animate-bounce"
                    title="Answer Call"
                  >
                    <Phone className="w-6 h-6" />
                  </button>
                </div>
              </div>
            )}

            {/* CONNECTED CALL STATE */}
            {callStatus === 'connected' && (
              <div className="flex-1 flex flex-col justify-between py-6 animate-fadeIn">
                
                {/* Caller & Timer Header */}
                <div className="text-center space-y-1">
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center justify-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Call Active &bull; HD Voice
                  </span>
                  <h3 className="text-lg font-bold text-white">{activeClient.name}</h3>
                  <p className="text-sm font-mono text-slate-300 font-semibold">{formatDuration(callDuration)}</p>
                </div>

                {/* Animated Voice Orb Center */}
                <div className="flex flex-col items-center justify-center py-4">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
                    receptionistState === 'speaking'
                      ? 'bg-emerald-500/20 border-2 border-emerald-400 shadow-emerald-500/50 scale-110'
                      : receptionistState === 'listening'
                      ? 'bg-cyan-500/20 border-2 border-cyan-400 shadow-cyan-500/50 scale-105'
                      : 'bg-slate-900 border border-slate-700'
                  }`}>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
                      A
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 mt-2">
                    {receptionistState === 'speaking' ? 'Aura is speaking...' : receptionistState === 'listening' ? 'Aura is listening...' : 'Aura connected'}
                  </span>
                </div>

                {/* Phone Call Controls Grid */}
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3 text-center text-[10px] text-slate-400">
                    <button
                      onClick={toggleListening}
                      className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-colors ${
                        receptionistState === 'listening'
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <Mic className="w-5 h-5" />
                      <span>{receptionistState === 'listening' ? 'Listening' : 'Mute/Mic'}</span>
                    </button>

                    <button
                      onClick={() => playGreeting()}
                      className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 flex flex-col items-center justify-center gap-1 transition-colors"
                    >
                      <Volume2 className="w-5 h-5 text-brand-400" />
                      <span>Repeat</span>
                    </button>

                    <button
                      onClick={() => setCallStatus('idle')}
                      className="p-3 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 hover:bg-rose-900 flex flex-col items-center justify-center gap-1 transition-colors"
                    >
                      <PhoneOff className="w-5 h-5 text-rose-400" />
                      <span>End Call</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* Bottom Bar */}
            <div className="w-32 h-1 rounded-full bg-slate-800 mx-auto mt-2 shrink-0"></div>
          </div>
        </div>

        {/* Right: Live Call Transcription & Text Injection */}
        <div className="md:col-span-7 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl h-[480px] flex flex-col justify-between">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Live Phone Audio Stream Transcript
                </h3>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {callStatus === 'connected' ? 'Bi-Directional Telephony Active' : 'Waiting for call'}
              </span>
            </div>

            {/* Conversation Log */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto py-3 space-y-3 text-xs">
              {conversation.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`p-3 rounded-2xl max-w-[80%] ${
                    msg.sender === 'user'
                      ? 'bg-brand-600 text-white rounded-br-none'
                      : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                  }`}>
                    <span className="block text-[10px] opacity-70 mb-0.5 font-semibold">
                      {msg.sender === 'user' ? 'Caller' : 'Aura (Phone Receptionist)'} &bull; {msg.timestamp}
                    </span>
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}

              {interimText && (
                <div className="flex justify-end animate-pulse">
                  <div className="p-3 rounded-2xl bg-brand-950 border border-brand-500/40 text-brand-300 max-w-[80%]">
                    <span className="text-[10px] block font-bold">Caller Speaking...</span>
                    <p className="italic">"{interimText}"</p>
                  </div>
                </div>
              )}
            </div>

            {/* In-Call Text Input Fallback */}
            <form onSubmit={handleSendText} className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <input
                type="text"
                disabled={callStatus !== 'connected'}
                value={typedInput}
                onChange={(e) => setTypedInput(e.target.value)}
                placeholder={callStatus === 'connected' ? "Type what the caller says..." : "Answer call first to talk..."}
                className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={callStatus !== 'connected'}
                className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>

          {/* Quick Voice Phrases */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] text-slate-400 font-semibold shrink-0">Quick Caller Audio:</span>
            {[
              "Hi, I'd like to book an appointment with Dr. Sterling tomorrow at 2 PM.",
              "Is Sarah Connor in the office right now?",
              "What is your address and what time do you close?",
              "Please leave a message that Bob called regarding the invoice."
            ].map((p, idx) => (
              <button
                key={idx}
                disabled={callStatus !== 'connected'}
                onClick={() => handleUserUtterance(p)}
                className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-brand-900 border border-slate-700 text-slate-300 hover:text-white text-[11px] truncate max-w-[200px] shrink-0 disabled:opacity-40"
              >
                "{p}"
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
