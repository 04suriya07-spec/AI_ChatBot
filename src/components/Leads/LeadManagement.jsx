import React, { useState } from 'react';
import { 
  Users, 
  Flame, 
  TrendingUp, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  DollarSign, 
  MessageSquare, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Filter,
  Download,
  Share2
} from 'lucide-react';
import { useClient } from '../../context/ClientContext';

export const LeadManagement = () => {
  const { activeClient, updateClient } = useClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedLead, setSelectedLead] = useState(null);

  const leads = activeClient.leads || [];

  const filteredLeads = leads.filter(lead => {
    const matchesQuery = 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.requirement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.location && lead.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      lead.phone.includes(searchQuery);
    
    if (statusFilter === 'HOT') return matchesQuery && lead.status === 'HOT';
    if (statusFilter === 'WARM') return matchesQuery && lead.status === 'WARM';
    if (statusFilter === 'COLD') return matchesQuery && lead.status === 'COLD';
    return matchesQuery;
  });

  const hotCount = leads.filter(l => l.status === 'HOT').length;
  const warmCount = leads.filter(l => l.status === 'WARM').length;

  const handleSendWhatsApp = (lead) => {
    const msg = encodeURIComponent(`Hi ${lead.name}, this is ${activeClient.name}. Thank you for speaking with our AI receptionist regarding ${lead.requirement}. Here are the details you requested!`);
    window.open(`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950/40 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold mb-2">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            AI LEAD GENERATION & QUALIFICATION ENGINE
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            Captured Leads & Automated Qualification
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Aura automatically extracts caller intent, budget, location preferences, and timeline to score and qualify HOT leads for your sales team.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 rounded-xl bg-amber-950/80 text-amber-300 border border-amber-800 text-xs font-bold flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            {hotCount} HOT Leads
          </span>
          <span className="px-3.5 py-1.5 rounded-xl bg-blue-950/80 text-blue-300 border border-blue-800 text-xs font-bold">
            {leads.length} Total Captured
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads by name, budget, requirement, or location..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'HOT', 'WARM', 'COLD'].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                statusFilter === f
                  ? f === 'HOT' ? 'bg-amber-600 text-white shadow-md' : 'bg-brand-600 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              {f === 'ALL' ? 'All Leads' : f === 'HOT' ? '🔥 Hot Leads' : f === 'WARM' ? '⚡ Warm' : 'Cold'}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLeads.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 text-xs bg-slate-900/40 rounded-2xl border border-slate-800">
            No qualified leads matching your criteria.
          </div>
        ) : (
          filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className={`p-5 rounded-3xl bg-slate-900/70 border shadow-xl flex flex-col justify-between space-y-4 transition-all hover:scale-[1.01] ${
                lead.status === 'HOT' 
                  ? 'border-amber-500/50 bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-900 ring-1 ring-amber-500/30' 
                  : 'border-slate-800'
              }`}
            >
              <div className="space-y-3">
                
                {/* Top Badge & Qualification Score */}
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase flex items-center gap-1 ${
                    lead.status === 'HOT' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' :
                    lead.status === 'WARM' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {lead.status === 'HOT' && <Flame className="w-3 h-3 fill-slate-950" />}
                    {lead.status} LEAD ({lead.score}% Score)
                  </span>

                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {lead.createdAt}
                  </span>
                </div>

                {/* Lead Identity */}
                <div>
                  <h3 className="text-lg font-bold font-display text-white">{lead.name}</h3>
                  <p className="text-xs text-brand-300 font-semibold mt-0.5">{lead.requirement}</p>
                </div>

                {/* Qualification Parameters Grid */}
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Budget / Capacity</span>
                    <span className="font-bold text-emerald-400 font-mono">{lead.budget}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Location</span>
                    <span className="font-semibold text-slate-200 truncate block">{lead.location || 'OMR / City'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Move-in / Timeline</span>
                    <span className="font-semibold text-slate-200">{lead.moveInTimeline || 'Immediate'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Source</span>
                    <span className="font-semibold text-cyan-400">{lead.source}</span>
                  </div>
                </div>

                {/* AI Call Summary */}
                <p className="text-[11px] text-slate-300 italic bg-slate-900/90 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
                  "{lead.aiSummary}"
                </p>

                {/* Contact Info */}
                <div className="space-y-1 text-xs text-slate-400 pt-1">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-brand-400" />
                    <span className="font-mono text-slate-200 font-medium">{lead.phone}</span>
                  </div>
                  {lead.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-brand-400" />
                      <span className="text-slate-300 truncate">{lead.email}</span>
                    </div>
                  )}
                </div>

              </div>

              {/* Actions Footer */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/80">
                <button
                  onClick={() => handleSendWhatsApp(lead)}
                  className="py-2 px-3 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/80 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  WhatsApp
                </button>

                <a
                  href={`tel:${lead.phone}`}
                  className="py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-brand-600/20"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call Back
                </a>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
