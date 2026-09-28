import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Users, 
  Calendar, 
  CheckCircle2, 
  Zap, 
  ArrowUpRight, 
  Flame, 
  ShieldCheck 
} from 'lucide-react';
import { useClient } from '../../context/ClientContext';

export const ROIDashboard = () => {
  const { activeClient } = useClient();
  const stats = activeClient.stats || {};

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-500/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            EXECUTIVE ROI & BUSINESS IMPACT ANALYTICS
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            AI Business Impact & Revenue Generation
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Demonstrates the measurable commercial value, pipeline generated, and labor hours saved by Aura at {activeClient.name}.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-right">
          <span className="text-[10px] text-emerald-300 uppercase font-bold tracking-wider block">Estimated Pipeline Value</span>
          <span className="text-3xl font-black font-display text-emerald-400">{stats.estimatedPipelineValue || '₹4.8 Cr'}</span>
        </div>
      </div>

      {/* Primary Impact Metrics 4-Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Total Calls Handled</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              📞
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-display text-white">{stats.totalCalls || 1247}</span>
            <span className="text-xs text-emerald-400 font-bold flex items-center">+18%</span>
          </div>
          <p className="text-[11px] text-slate-500">24/7 Zero Missed Calls</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Qualified Leads</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              🔥
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-display text-amber-400">{stats.leadsCaptured || 312}</span>
            <span className="text-xs text-amber-300 font-bold">{stats.hotLeadsCount || 89} HOT</span>
          </div>
          <p className="text-[11px] text-slate-500">Auto-scored by budget & timeline</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Appointments Booked</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              📅
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-display text-purple-400">{stats.appointmentsBooked || 87}</span>
            <span className="text-xs text-emerald-400 font-bold">Synced</span>
          </div>
          <p className="text-[11px] text-slate-500">Direct calendar slot bookings</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Resolution Rate</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              ⚡
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-display text-emerald-400">{stats.resolutionRate || '94.2%'}</span>
          </div>
          <p className="text-[11px] text-slate-500">Resolved without human intervention</p>
        </div>

      </div>

      {/* ROI Breakdown Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Cost Comparison Card */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl space-y-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            Financial Cost vs Traditional Receptionist
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-800/40 flex items-center justify-between text-slate-300">
              <div>
                <span className="font-bold text-white block">Traditional 2-Shift Reception Staff</span>
                <span className="text-[11px] text-slate-400">Salaries, benefits, sick leave, training (8 AM–8 PM)</span>
              </div>
              <span className="font-bold text-rose-400 text-sm">~₹70,000 / mo</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 flex items-center justify-between text-slate-200">
              <div>
                <span className="font-bold text-white block">AuraDesk AI Voice Agent (24/7/365)</span>
                <span className="text-[11px] text-slate-300">Zero downtime, infinite concurrency, auto-followups</span>
              </div>
              <span className="font-bold text-emerald-400 text-base">₹12,999 / mo</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center font-semibold text-emerald-400 text-xs">
              🎉 Monthly Net Savings: ₹57,001 (81% Cost Reduction)
            </div>
          </div>
        </div>

        {/* Operational Hours Saved */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl space-y-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            Labor Time & Lead Response Velocity
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Average Lead Response Time:</span>
              <span className="font-bold text-emerald-400 text-sm">Instant (0 seconds)</span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Staff Labor Hours Saved This Month:</span>
              <span className="font-bold text-cyan-400 text-sm">184 Hours</span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400">After-Hours Inquiries Converted:</span>
              <span className="font-bold text-purple-400 text-sm">78 Leads (Captured 8 PM–8 AM)</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
