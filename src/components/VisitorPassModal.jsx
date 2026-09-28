import React from 'react';
import { ShieldCheck, Printer, X, Building, User, Calendar, Clock, QrCode } from 'lucide-react';
import { useReceptionist } from '../context/ReceptionistContext';

export const VisitorPassModal = () => {
  const { selectedVisitorForPass, setSelectedVisitorForPass, companyInfo } = useReceptionist();

  if (!selectedVisitorForPass) return null;

  const visitor = selectedVisitorForPass;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Pass Header */}
        <div className="bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg leading-tight">VISITOR SECURITY PASS</h3>
              <p className="text-xs text-white/80">{companyInfo?.name || 'Apex Global Technologies'}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedVisitorForPass(null)}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Pass Body (Printable Area) */}
        <div className="p-6 space-y-5 bg-slate-900/90" id="printable-badge">
          
          {/* Visitor Identification */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/80 border border-slate-700/50">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-500 to-cyan-400 flex items-center justify-center font-display font-extrabold text-2xl text-white shadow-md">
              {visitor.name ? visitor.name.charAt(0) : 'G'}
            </div>
            <div>
              <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800/50 mb-1">
                AUTHORIZED GUEST
              </span>
              <h2 className="text-xl font-bold font-display text-white">{visitor.name}</h2>
              <p className="text-sm text-slate-400">{visitor.company || 'Independent Visitor'}</p>
            </div>
          </div>

          {/* Visit Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800">
              <span className="text-slate-400 block mb-0.5">Visiting Host</span>
              <span className="font-semibold text-slate-200 text-sm flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-brand-400" />
                {visitor.hostName}
              </span>
              <span className="text-[11px] text-slate-500">{visitor.hostDepartment || 'Executive'}</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800">
              <span className="text-slate-400 block mb-0.5">Badge Number</span>
              <span className="font-mono font-bold text-cyan-400 text-sm tracking-wider">
                {visitor.badgeNumber || 'PASS-9401'}
              </span>
              <span className="text-[11px] text-emerald-400 font-medium">Status: {visitor.status}</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800">
              <span className="text-slate-400 block mb-0.5">Check-In Time</span>
              <span className="font-semibold text-slate-200 text-sm flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-brand-400" />
                {visitor.checkInTime || 'Just Now'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800">
              <span className="text-slate-400 block mb-0.5">Location Access</span>
              <span className="font-semibold text-slate-200 text-sm flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-brand-400" />
                Level 1-4 Lobby & Suites
              </span>
            </div>
          </div>

          {/* QR Code Barcode Area */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">Digital Security Key</span>
              <p className="font-mono text-xs text-brand-400">{visitor.qrCodeVal || 'APEX-VIS-SECURITY-KEY'}</p>
              <p className="text-[10px] text-slate-500">Scan at elevator turnstile or security barrier</p>
            </div>
            <div className="w-14 h-14 bg-white rounded-lg p-1 flex items-center justify-center shadow-inner">
              <QrCode className="w-12 h-12 text-slate-950" />
            </div>
          </div>

          <div className="text-[11px] text-center text-slate-500">
            Please wear this badge visibly while inside the premises. Return to kiosk upon departure.
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={() => setSelectedVisitorForPass(null)}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-brand-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <Printer className="w-4 h-4" />
            Print Badge
          </button>
        </div>

      </div>
    </div>
  );
};
