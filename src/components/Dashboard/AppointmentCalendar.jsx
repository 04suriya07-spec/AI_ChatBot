import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Building, 
  Plus, 
  CheckCircle, 
  XCircle, 
  Search,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';
import { useReceptionist } from '../../context/ReceptionistContext';

export const AppointmentCalendar = () => {
  const { appointments, addAppointment, cancelAppointment, staffDirectory } = useReceptionist();
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookModal, setShowBookModal] = useState(false);

  // Booking Form State
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [hostName, setHostName] = useState(staffDirectory[0]?.name || 'Sarah Connor');
  const [purpose, setPurpose] = useState('Product Demo & Integration Roadmap');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('03:00 PM');
  const [duration, setDuration] = useState('45 mins');

  const filteredAppointments = appointments.filter(a => 
    a.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.hostName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.purpose.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateAppointment = (e) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    const matchedHost = staffDirectory.find(s => s.name === hostName);

    const newApt = {
      id: `apt-${Date.now()}`,
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim() || `${guestName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      guestPhone: guestPhone.trim() || "+1 (555) 019-2000",
      hostName: hostName,
      department: matchedHost ? matchedHost.department : 'General',
      purpose: purpose,
      date: date,
      time: time,
      duration: duration,
      status: 'Confirmed',
      room: matchedHost?.location || 'Conference Room B'
    };

    addAppointment(newApt);
    setGuestName('');
    setGuestEmail('');
    setGuestPhone('');
    setShowBookModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-brand-400" />
            Appointment & Calendar Schedule
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage booked meetings, doctor consultations, client sessions, and AI calendar sync.
          </p>
        </div>

        <button
          onClick={() => setShowBookModal(true)}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Schedule New Appointment
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search appointments by guest, host, or purpose..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
        />
      </div>

      {/* Appointments Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAppointments.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 text-xs bg-slate-900/40 rounded-2xl border border-slate-800">
            No scheduled appointments matching your query.
          </div>
        ) : (
          filteredAppointments.map((apt) => (
            <div 
              key={apt.id}
              className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-brand-500/40 shadow-xl space-y-4 transition-all"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold mb-1 ${
                    apt.status === 'Confirmed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80' :
                    apt.status === 'Completed' ? 'bg-blue-950 text-blue-400 border border-blue-800/80' :
                    'bg-rose-950 text-rose-400 border border-rose-800/80'
                  }`}>
                    {apt.status}
                  </span>
                  <h3 className="font-bold text-base text-white">{apt.guestName}</h3>
                </div>

                <div className="text-right">
                  <span className="font-bold text-sm text-cyan-400 flex items-center gap-1 justify-end">
                    <Clock className="w-3.5 h-3.5" />
                    {apt.time}
                  </span>
                  <span className="text-[11px] text-slate-400">{apt.date}</span>
                </div>
              </div>

              {/* Purpose & Details */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                <p className="font-medium text-slate-100 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-brand-400" />
                  Host: {apt.hostName} ({apt.department})
                </p>
                <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-brand-400" />
                  {apt.room || 'Conference Suite 402'} &bull; {apt.duration}
                </p>
                <p className="text-[11px] text-brand-300 italic pt-1 border-t border-slate-800/60">
                  "{apt.purpose}"
                </p>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-2 text-xs">
                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <span className="truncate max-w-[120px]">{apt.guestEmail}</span>
                </div>

                {apt.status === 'Confirmed' && (
                  <button
                    onClick={() => cancelAppointment(apt.id)}
                    className="text-[11px] text-rose-400 hover:text-rose-300 hover:underline"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Book Appointment Modal */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold font-display text-white">Book Calendar Appointment</h3>
            
            <form onSubmit={handleCreateAppointment} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Guest / Client Full Name</label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Samantha Brooks"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="samantha@example.com"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Phone</label>
                  <input
                    type="text"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="+1 (555) 019-9988"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Host Staff Member</label>
                <select
                  value={hostName}
                  onChange={(e) => setHostName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
                >
                  {staffDirectory.map(s => (
                    <option key={s.id} value={s.name}>{s.name} — {s.role} ({s.department})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="block text-slate-400 mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Time</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 02:00 PM"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Duration</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
                  >
                    <option>30 mins</option>
                    <option>45 mins</option>
                    <option>60 mins</option>
                    <option>90 mins</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Purpose / Consultation Topic</label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Product Demo & Technical Scoping"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold"
                >
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
