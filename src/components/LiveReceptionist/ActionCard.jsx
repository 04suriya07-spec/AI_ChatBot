import React from 'react';
import { 
  CheckCircle2, 
  Calendar, 
  MailCheck, 
  UserCheck, 
  Wifi, 
  MapPin, 
  ExternalLink,
  QrCode,
  Clock,
  PhoneCall
} from 'lucide-react';
import { useReceptionist } from '../../context/ReceptionistContext';

export const ActionCard = ({ action }) => {
  const { setSelectedVisitorForPass } = useReceptionist();
  if (!action || !action.type) return null;

  switch (action.type) {
    case 'CHECK_IN_VISITOR': {
      const visitor = action.data;
      return (
        <div className="mt-3 p-3.5 rounded-xl bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/40 shadow-lg animate-fadeIn text-left">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-500/20">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <UserCheck className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Visitor Checked In
              </span>
            </div>
            <span className="font-mono text-xs text-emerald-300 font-bold bg-emerald-900/50 px-2 py-0.5 rounded border border-emerald-700/50">
              {visitor.badgeNumber}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 mb-3">
            <div>
              <span className="text-slate-500 block text-[10px]">Guest Name</span>
              <span className="font-medium text-slate-100">{visitor.name}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Meeting Host</span>
              <span className="font-medium text-slate-100">{visitor.hostName}</span>
            </div>
          </div>

          <button
            onClick={() => setSelectedVisitorForPass(visitor)}
            className="w-full py-1.5 px-3 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
          >
            <QrCode className="w-3.5 h-3.5" />
            View Digital Security Pass
          </button>
        </div>
      );
    }

    case 'BOOK_APPOINTMENT': {
      const appt = action.data;
      return (
        <div className="mt-3 p-3.5 rounded-xl bg-gradient-to-br from-brand-950/70 via-slate-900 to-slate-900 border border-brand-500/40 shadow-lg animate-fadeIn text-left">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-brand-500/20">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-brand-500/20 text-brand-400">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">
                Appointment Confirmed
              </span>
            </div>
            <span className="text-[10px] text-brand-300 font-medium bg-brand-900/50 px-2 py-0.5 rounded border border-brand-700/50">
              {appt.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
            <div>
              <span className="text-slate-500 block text-[10px]">Date & Time</span>
              <span className="font-medium text-slate-100 flex items-center gap-1">
                <Clock className="w-3 h-3 text-brand-400" />
                {appt.date} @ {appt.time}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">With</span>
              <span className="font-medium text-slate-100">{appt.hostName}</span>
            </div>
          </div>
        </div>
      );
    }

    case 'TAKE_MESSAGE': {
      const msg = action.data;
      return (
        <div className="mt-3 p-3.5 rounded-xl bg-gradient-to-br from-amber-950/70 via-slate-900 to-slate-900 border border-amber-500/40 shadow-lg animate-fadeIn text-left">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-500/20">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <MailCheck className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Priority Message Logged
              </span>
            </div>
            <span className="text-[10px] text-amber-300 font-bold bg-amber-900/50 px-2 py-0.5 rounded border border-amber-700/50">
              {msg.urgency} Urgency
            </span>
          </div>

          <div className="text-xs text-slate-300">
            <p className="text-[11px] text-slate-400 mb-1">
              For: <span className="text-slate-200 font-medium">{msg.recipientName}</span>
            </p>
            <p className="p-2 rounded bg-slate-950/60 border border-slate-800 text-slate-300 italic text-[11px]">
              "{msg.content}"
            </p>
          </div>
        </div>
      );
    }

    case 'STAFF_LOOKUP': {
      const staff = action.data;
      return (
        <div className="mt-3 p-3.5 rounded-xl bg-slate-900 border border-cyan-500/40 shadow-lg animate-fadeIn text-left">
          <div className="flex items-center gap-3">
            <img src={staff.avatar} alt={staff.name} className="w-10 h-10 rounded-full object-cover border border-cyan-500/40" />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-white truncate">{staff.name}</h4>
              <p className="text-[11px] text-cyan-300">{staff.role} &bull; {staff.department}</p>
              <p className="text-[10px] text-slate-400">Ext: <span className="text-slate-200 font-mono font-medium">{staff.phoneExt}</span> | Office: {staff.location}</p>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
              staff.status === 'Available' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
              staff.status === 'In Meeting' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
              'bg-rose-950 text-rose-400 border border-rose-800'
            }`}>
              {staff.status}
            </span>
          </div>
        </div>
      );
    }

    case 'FAQ_ANSWER': {
      return (
        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300">
          <CheckCircle2 className="w-3 h-3 text-cyan-400" />
          <span>Verified from Front Desk Knowledge Base</span>
        </div>
      );
    }

    default:
      return null;
  }
};
