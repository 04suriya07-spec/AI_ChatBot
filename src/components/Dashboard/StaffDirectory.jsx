import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  UserPlus, 
  Phone, 
  Mail, 
  MapPin, 
  Building, 
  CheckCircle2, 
  Clock, 
  Slash 
} from 'lucide-react';
import { useReceptionist } from '../../context/ReceptionistContext';

export const StaffDirectory = () => {
  const { staffDirectory, setStaffDirectory, updateStaffStatus } = useReceptionist();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Staff Member Form
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [phoneExt, setPhoneExt] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('Floor 3 - Suite 301');

  const departments = ['ALL', ...new Set(staffDirectory.map(s => s.department))];

  const filteredStaff = staffDirectory.filter(s => {
    const matchesQuery = 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phoneExt.includes(searchQuery);

    if (selectedDept !== 'ALL') return matchesQuery && s.department === selectedDept;
    return matchesQuery;
  });

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newStaff = {
      id: `staff-${Date.now()}`,
      name: name.trim(),
      role: role.trim() || 'Specialist',
      department: department,
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@apextech.com`,
      phoneExt: phoneExt.trim() || `${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Available',
      location: location.trim(),
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`
    };

    setStaffDirectory(prev => [...prev, newStaff]);
    setName('');
    setRole('');
    setEmail('');
    setPhoneExt('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            Staff & Department Directory
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Internal company directory used by Aura to route calls, look up offices, and confirm staff availability.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          Add Staff Member
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, title, department, or phone extension..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-2 rounded-xl text-xs font-medium shrink-0 transition-all ${
                selectedDept === dept
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((staff) => (
          <div
            key={staff.id}
            className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-purple-500/40 shadow-xl space-y-4 transition-all"
          >
            <div className="flex items-start gap-3.5">
              <img
                src={staff.avatar}
                alt={staff.name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow-md shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base text-white truncate">{staff.name}</h3>
                <p className="text-xs text-purple-300 font-medium truncate">{staff.role}</p>
                <p className="text-[11px] text-slate-400">{staff.department}</p>
              </div>
            </div>

            {/* Details */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1 text-xs text-slate-300">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-brand-400" />
                  Extension:
                </span>
                <span className="font-mono font-bold text-cyan-400">{staff.phoneExt}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-brand-400" />
                  Office:
                </span>
                <span className="text-slate-300">{staff.location}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] truncate pt-1 border-t border-slate-800/60">
                <span className="text-slate-500 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-brand-400" />
                  Email:
                </span>
                <span className="text-slate-400 truncate max-w-[140px]">{staff.email}</span>
              </div>
            </div>

            {/* Status Selector */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-[11px] text-slate-500">Live Status:</span>
              <select
                value={staff.status}
                onChange={(e) => updateStaffStatus(staff.id, e.target.value)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg border bg-slate-950 cursor-pointer outline-none ${
                  staff.status === 'Available' ? 'text-emerald-400 border-emerald-800' :
                  staff.status === 'In Meeting' ? 'text-amber-400 border-amber-800' :
                  'text-rose-400 border-rose-800'
                }`}
              >
                <option value="Available">🟢 Available</option>
                <option value="In Meeting">🟡 In Meeting</option>
                <option value="Out of Office">🔴 Out of Office</option>
              </select>
            </div>

          </div>
        ))}
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold font-display text-white">Add Staff Member</h3>
            
            <form onSubmit={handleAddStaff} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Job Title</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. VP of Sales"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Sales"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Phone Extension</label>
                  <input
                    type="text"
                    value={phoneExt}
                    onChange={(e) => setPhoneExt(e.target.value)}
                    placeholder="e.g. 1045"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Office Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Floor 4 - Room 402"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold"
                >
                  Save Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
