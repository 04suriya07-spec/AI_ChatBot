import React from 'react';
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  UserCheck, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles,
  ArrowUpRight,
  Building
} from 'lucide-react';
import { useReceptionist } from '../../context/ReceptionistContext';

export const DashboardHome = ({ setActiveTab }) => {
  const { visitors, appointments, messages, staffDirectory, companyInfo } = useReceptionist();

  const activeVisitors = visitors.filter(v => v.status === 'Checked In');
  const upcomingAppointments = appointments.filter(a => a.status === 'Confirmed');
  const pendingMessages = messages.filter(m => m.status === 'Pending');
  const availableStaff = staffDirectory.filter(s => s.status === 'Available');

  const stats = [
    {
      title: "Active Visitors On-Site",
      value: activeVisitors.length,
      subtext: `${visitors.length} total logged today`,
      icon: Users,
      color: "from-emerald-600 to-teal-500",
      textColor: "text-emerald-400",
      tabTarget: "visitors"
    },
    {
      title: "Confirmed Appointments",
      value: upcomingAppointments.length,
      subtext: "Across all departments",
      icon: Calendar,
      color: "from-brand-600 to-blue-500",
      textColor: "text-brand-400",
      tabTarget: "appointments"
    },
    {
      title: "Pending Callbacks & Notes",
      value: pendingMessages.length,
      subtext: `${messages.filter(m => m.urgency === 'High').length} marked as High Priority`,
      icon: MessageSquare,
      color: "from-amber-600 to-orange-500",
      textColor: "text-amber-400",
      tabTarget: "messages"
    },
    {
      title: "Available Staff in Office",
      value: `${availableStaff.length}/${staffDirectory.length}`,
      subtext: "Ready for walk-ins & meetings",
      icon: UserCheck,
      color: "from-purple-600 to-indigo-500",
      textColor: "text-purple-400",
      tabTarget: "directory"
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950/40 to-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
            Autonomous Receptionist Operations
          </span>
          <h2 className="text-2xl font-bold font-display text-white mt-1">
            Front Desk Command & Live Intelligence
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Aura is currently managing visitor triage, scheduling calendar appointments, recording callback leads, and routing front-desk inquiries for <strong className="text-slate-200">{companyInfo?.name}</strong>.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('receptionist')}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-brand-500/25 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          Switch to Live Kiosk View
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx}
              onClick={() => setActiveTab(item.tabTarget)}
              className="glass-card p-5 rounded-2xl cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">{item.title}</span>
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-display text-white">{item.value}</span>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{item.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* Two Column Section: Active Visitors & Upcoming Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active Visitors Widget */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="font-display font-bold text-base text-white">Currently Checked-In Guests</h3>
            </div>
            <button 
              onClick={() => setActiveTab('visitors')}
              className="text-xs text-brand-400 hover:text-brand-300 font-medium"
            >
              View All ({visitors.length})
            </button>
          </div>

          <div className="space-y-3">
            {activeVisitors.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No visitors currently on-site.</p>
            ) : (
              activeVisitors.slice(0, 4).map((vis) => (
                <div key={vis.id} className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-bold text-sm">
                      {vis.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{vis.name}</h4>
                      <p className="text-xs text-slate-400">{vis.company} &bull; Meeting with <span className="text-slate-200">{vis.hostName}</span></p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-mono font-bold text-cyan-400 block">{vis.badgeNumber}</span>
                    <span className="text-[10px] text-slate-500">{vis.checkInTime}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Appointments Widget */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-400" />
              <h3 className="font-display font-bold text-base text-white">Upcoming Calendar Schedule</h3>
            </div>
            <button 
              onClick={() => setActiveTab('appointments')}
              className="text-xs text-brand-400 hover:text-brand-300 font-medium"
            >
              View All ({appointments.length})
            </button>
          </div>

          <div className="space-y-3">
            {upcomingAppointments.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No upcoming appointments scheduled.</p>
            ) : (
              upcomingAppointments.slice(0, 4).map((apt) => (
                <div key={apt.id} className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-white">{apt.guestName}</h4>
                    <p className="text-xs text-slate-400">With {apt.hostName} &bull; <span className="text-brand-300">{apt.purpose}</span></p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-200 block">{apt.time}</span>
                    <span className="text-[10px] text-slate-500">{apt.date}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
