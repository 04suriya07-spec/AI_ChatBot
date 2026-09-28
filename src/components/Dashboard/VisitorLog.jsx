import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  UserPlus, 
  QrCode, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  Building, 
  Filter 
} from 'lucide-react';
import { useReceptionist } from '../../context/ReceptionistContext';

export const VisitorLog = () => {
  const { 
    visitors, 
    checkOutVisitor, 
    addVisitor, 
    setSelectedVisitorForPass,
    staffDirectory 
  } = useReceptionist();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showManualModal, setShowManualModal] = useState(false);

  // Manual Check In Form State
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [hostName, setHostName] = useState(staffDirectory[0]?.name || 'Sarah Connor');
  const [purpose, setPurpose] = useState('Executive Meeting');

  const filteredVisitors = visitors.filter(v => {
    const matchesQuery = 
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.hostName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.badgeNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'CHECKED_IN') return matchesQuery && v.status === 'Checked In';
    if (statusFilter === 'CHECKED_OUT') return matchesQuery && v.status === 'Checked Out';
    return matchesQuery;
  });

  const handleManualCheckIn = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const badgeNum = `PASS-${Math.floor(1000 + Math.random() * 9000)}`;
    const matchedHost = staffDirectory.find(s => s.name === hostName);

    const newVisitor = {
      id: `vis-${Date.now()}`,
      name: name.trim(),
      company: company.trim() || 'Independent Guest',
      hostName: hostName,
      hostDepartment: matchedHost ? matchedHost.department : 'General',
      purpose: purpose,
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Checked In',
      badgeNumber: badgeNum,
      qrCodeVal: `APEX-VIS-${badgeNum}-${name.toUpperCase().replace(/\s+/g, '')}`,
      ndaSigned: true
    };

    addVisitor(newVisitor);
    setName('');
    setCompany('');
    setShowManualModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            Visitor Log & Access Management
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time track of registered visitors, issued security badges, and check-in / check-out timestamps.
          </p>
        </div>

        <button
          onClick={() => setShowManualModal(true)}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          Manual Register Guest
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search visitor by name, company, host, or badge #..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'CHECKED_IN', 'CHECKED_OUT'].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                statusFilter === f
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              {f === 'ALL' ? 'All Visitors' : f === 'CHECKED_IN' ? 'Checked In' : 'Checked Out'}
            </button>
          ))}
        </div>
      </div>

      {/* Visitors Table */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Visitor & Company</th>
                <th className="py-3.5 px-4 font-semibold">Badge #</th>
                <th className="py-3.5 px-4 font-semibold">Meeting Host</th>
                <th className="py-3.5 px-4 font-semibold">Check-In / Out</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredVisitors.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500 text-xs">
                    No visitor records matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredVisitors.map((vis) => (
                  <tr key={vis.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white">
                          {vis.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{vis.name}</p>
                          <p className="text-[11px] text-slate-400">{vis.company}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">
                      {vis.badgeNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-medium text-slate-200">{vis.hostName}</p>
                      <p className="text-[10px] text-slate-500">{vis.hostDepartment}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <p className="text-slate-300 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-emerald-400" />
                          In: {vis.checkInTime}
                        </p>
                        {vis.checkOutTime && (
                          <p className="text-slate-500 text-[11px]">Out: {vis.checkOutTime}</p>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                        vis.status === 'Checked In'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${vis.status === 'Checked In' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
                        {vis.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedVisitorForPass(vis)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1 text-[11px] transition-colors"
                          title="View & Print Digital Badge"
                        >
                          <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                          Badge Pass
                        </button>

                        {vis.status === 'Checked In' && (
                          <button
                            onClick={() => checkOutVisitor(vis.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/60 flex items-center gap-1 text-[11px] transition-colors"
                            title="Check out visitor"
                          >
                            <LogOut className="w-3.5 h-3.5 text-rose-400" />
                            Check Out
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Check In Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold font-display text-white">Manual Front Desk Registration</h3>
            
            <form onSubmit={handleManualCheckIn} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Visitor Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Organization / Company</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Acme Corp"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Meeting Host</label>
                <select
                  value={hostName}
                  onChange={(e) => setHostName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
                >
                  {staffDirectory.map(s => (
                    <option key={s.id} value={s.name}>{s.name} ({s.department})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Purpose of Visit</label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Client Consultation"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold"
                >
                  Issue Pass & Check In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
