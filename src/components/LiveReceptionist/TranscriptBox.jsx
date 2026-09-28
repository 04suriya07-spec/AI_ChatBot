import React, { useEffect, useRef } from 'react';
import { Bot, User, Sparkles, Volume2 } from 'lucide-react';
import { useReceptionist } from '../../context/ReceptionistContext';
import { ActionCard } from './ActionCard';

export const TranscriptBox = () => {
  const { conversation, interimText, receptionistState } = useReceptionist();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation, interimText, receptionistState]);

  return (
    <div className="flex flex-col h-full bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl">
      {/* Transcript Header */}
      <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Live Front Desk Transcript
          </h3>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">
          {conversation.length} interaction{conversation.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Messages Stream */}
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto space-y-4 text-sm"
      >
        {conversation.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
          >
            {msg.sender !== 'user' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center text-white flex-shrink-0 shadow-md">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 ${
              msg.sender === 'user'
                ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-br-none shadow-md shadow-brand-600/10'
                : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-bl-none shadow-lg'
            }`}>
              <div className="flex items-center justify-between gap-4 mb-1 text-[11px] opacity-70">
                <span className="font-semibold">
                  {msg.sender === 'user' ? 'Visitor / Guest' : 'Aura (AI Receptionist)'}
                </span>
                <span>{msg.timestamp}</span>
              </div>

              <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

              {/* Action Attachment */}
              {msg.action && <ActionCard action={msg.action} />}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-200 flex-shrink-0 shadow-md">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {/* Real-time Interim User Speech Preview */}
        {interimText && (
          <div className="flex justify-end gap-3 animate-pulse">
            <div className="max-w-[75%] rounded-2xl rounded-br-none p-3.5 bg-brand-900/40 border border-brand-500/40 text-brand-200">
              <span className="text-[10px] text-brand-300 font-semibold block mb-0.5">Listening to voice...</span>
              <p className="italic text-sm">"{interimText}"</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-brand-800/60 flex items-center justify-center text-brand-300">
              <User className="w-4 h-4 animate-spin" />
            </div>
          </div>
        )}

        {/* Receptionist Thinking Indicator */}
        {receptionistState === 'thinking' && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-purple-300 text-xs w-fit animate-pulse">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Aura is consulting schedule and directory...</span>
          </div>
        )}
      </div>
    </div>
  );
};
