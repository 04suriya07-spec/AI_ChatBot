import React, { useState } from 'react';
import { 
  MessageSquare, 
  PhoneCall, 
  Clock, 
  User, 
  Building, 
  AlertCircle, 
  CheckCircle2, 
  Volume2, 
  Search,
  Filter
} from 'lucide-react';
import { useReceptionist } from '../../context/ReceptionistContext';

export const MessagesView = () => {
  const { messages, updateMessageStatus, playGreeting } = useReceptionist();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUrgency, setFilterUrgency] = useState('ALL');

  const filteredMessages = messages.filter(m => {
    const matches = 
      m.callerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.content.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterUrgency === 'HIGH') return matches && m.urgency === 'High';
    if (filterUrgency === 'PENDING') return matches && m.status === 'Pending';
    return matches;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-400" />
            Front Desk Message Center & Callbacks
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Voice notes, caller voicemails, and urgent contact requests captured automatically by Aura.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Total Unresolved:</span>
          <span className="px-2.5 py-1 rounded-full bg-amber-950 text-amber-400 border border-amber-800 font-bold text-xs">
            {messages.filter(m => m.status === 'Pending').length}
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages by caller, recipient, or note text..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'HIGH', 'PENDING'].map((f) => (
            <button
              key={f}
              onClick={() => setFilterUrgency(f)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                filterUrgency === f
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              {f === 'ALL' ? 'All Messages' : f === 'HIGH' ? '🔥 High Priority' : 'Pending Only'}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMessages.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 text-xs bg-slate-900/40 rounded-2xl border border-slate-800">
            No logged messages matching your filter.
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`p-5 rounded-2xl bg-slate-900/70 border shadow-xl space-y-4 transition-all ${
                msg.urgency === 'High' 
                  ? 'border-amber-500/40 bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-900' 
                  : 'border-slate-800'
              }`}
            >
              {/* Message Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md ${
                    msg.urgency === 'High' ? 'bg-amber-600' : 'bg-slate-700'
                  }`}>
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">{msg.callerName}</h3>
                    <p className="text-xs text-slate-400">{msg.callerCompany || 'Caller'} &bull; {msg.callerContact}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold mb-1 ${
                    msg.urgency === 'High'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {msg.urgency} Urgency
                  </span>
                  <span className="text-[11px] text-slate-500 block">{msg.timestamp}</span>
                </div>
              </div>

              {/* Message Note Content */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-200">
                <div className="text-slate-400 text-[11px] mb-1 font-semibold flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-brand-400" />
                  Target Staff: <span className="text-slate-200">{msg.recipientName}</span>
                </div>
                <p className="italic text-slate-300">"{msg.content}"</p>
              </div>

              {/* Message Footer Controls */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <button
                  onClick={() => playGreeting(`Message from ${msg.callerName} for ${msg.recipientName}: ${msg.content}`)}
                  className="text-slate-400 hover:text-white flex items-center gap-1.5 text-[11px] transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5 text-brand-400" />
                  Audio Readout
                </button>

                {msg.status === 'Pending' ? (
                  <button
                    onClick={() => updateMessageStatus(msg.id, 'Resolved')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/80 flex items-center gap-1 text-[11px] font-medium transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Mark as Handled
                  </button>
                ) : (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Handled
                  </span>
                )}
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
