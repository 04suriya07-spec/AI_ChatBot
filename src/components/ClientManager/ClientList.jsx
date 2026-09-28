import React, { useState } from 'react';
import { 
  Building2, 
  Stethoscope, 
  Scale, 
  Hotel, 
  Scissors, 
  Plus, 
  ExternalLink, 
  Code, 
  Copy, 
  Download, 
  Trash2, 
  Check, 
  Sparkles, 
  Users, 
  Calendar, 
  MessageSquare, 
  Settings, 
  Search, 
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useClient } from '../../context/ClientContext';

export const ClientList = ({ onOpenNewClientWizard, onOpenEmbedModal, onLaunchKiosk, setActiveTab }) => {
  const { 
    clients, 
    activeClientId, 
    switchClient, 
    duplicateClient, 
    deleteClient, 
    exportClient,
    resetClientsToDefault 
  } = useClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('ALL');

  const getIndustryIcon = (industry, customIcon) => {
    switch (industry) {
      case 'medical': return Stethoscope;
      case 'hospitality': return Hotel;
      case 'salon': return Scissors;
      default: return Building2;
    }
  };

  const filteredClients = clients.filter(c => {
    const matchesQuery = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedIndustry !== 'ALL') return matchesQuery && c.industry === selectedIndustry;
    return matchesQuery;
  });

  const totalInteractions = clients.reduce((acc, c) => acc + (c.stats?.totalInteractions || 0), 0);
  const totalVisitors = clients.reduce((acc, c) => acc + (c.visitors?.length || 0), 0);
  const totalAppointments = clients.reduce((acc, c) => acc + (c.appointments?.length || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Master SaaS Portfolio Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950/40 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold mb-2">
            <Layers className="w-3.5 h-3.5" />
            MULTI-TENANT CLIENT MANAGEMENT HUB
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
            Client Organizations & AI Receptionist Deployments
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Create, tune, white-label, and manage tailored AI Voice Receptionists for dental clinics, law practices, luxury hotels, corporate headquarters, and salons.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenNewClientWizard}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-brand-500/25 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Onboard New Client
          </button>
        </div>
      </div>

      {/* Global Agency Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Active Client Orgs
          </span>
          <span className="text-2xl font-bold font-display text-white">{clients.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Total Voice Interactions
          </span>
          <span className="text-2xl font-bold font-display text-cyan-400">{totalInteractions}</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Total Visitors Logged
          </span>
          <span className="text-2xl font-bold font-display text-emerald-400">{totalVisitors}</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Scheduled Appointments
          </span>
          <span className="text-2xl font-bold font-display text-purple-400">{totalAppointments}</span>
        </div>
      </div>

      {/* Search & Industry Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search client organization by name, industry, or tagline..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'corporate', 'medical', 'hospitality', 'salon'].map((ind) => (
            <button
              key={ind}
              onClick={() => setSelectedIndustry(ind)}
              className={`px-3 py-2 rounded-xl text-xs font-medium capitalize shrink-0 transition-all ${
                selectedIndustry === ind
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              {ind === 'ALL' ? 'All Industries' : ind}
            </button>
          ))}
        </div>
      </div>

      {/* Client Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => {
          const Icon = getIndustryIcon(client.industry, client.branding?.logoIcon);
          const isActive = client.id === activeClientId;
          const brandColor = client.branding?.primaryColor || '#3b82f6';

          return (
            <div
              key={client.id}
              className={`rounded-3xl p-6 transition-all flex flex-col justify-between border relative overflow-hidden group ${
                isActive
                  ? 'bg-slate-900/90 border-brand-500 shadow-2xl shadow-brand-500/10 ring-1 ring-brand-500/30'
                  : 'bg-slate-900/60 border-slate-800/90 hover:border-slate-700 shadow-xl'
              }`}
            >
              {/* Top Accent Strip */}
              <div 
                className="absolute top-0 left-0 right-0 h-1.5" 
                style={{ backgroundColor: brandColor }}
              />

              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0"
                      style={{ backgroundColor: brandColor }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold font-display text-base text-white leading-snug">
                          {client.name}
                        </h3>
                      </div>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 mt-0.5">
                        {client.industry} &bull; {client.plan} Plan
                      </span>
                    </div>
                  </div>

                  {isActive && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold shrink-0">
                      Active Workspace
                    </span>
                  )}
                </div>

                {/* Tagline & Welcome */}
                <p className="text-xs text-slate-400 line-clamp-2 italic">
                  "{client.voiceConfig?.customGreeting || client.tagline}"
                </p>

                {/* Micro Stats Grid */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Staff</span>
                    <span className="font-bold text-slate-200">{client.staffDirectory?.length || 0}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Appts</span>
                    <span className="font-bold text-brand-400">{client.appointments?.length || 0}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Interactions</span>
                    <span className="font-bold text-cyan-400">{client.stats?.totalInteractions || 0}</span>
                  </div>
                </div>

                {/* Client AI Voice Details */}
                <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>AI Assistant Name:</span>
                    <span className="text-slate-200 font-semibold">{client.voiceConfig?.aiName || 'Aura'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Speed / Pitch:</span>
                    <span className="text-slate-300 font-mono">{client.voiceConfig?.voiceRate || 1.0}x / {client.voiceConfig?.voicePitch || 1.0}x</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-2.5">
                
                {/* Primary Action Button */}
                {isActive ? (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onLaunchKiosk(client)}
                      className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all hover:scale-102"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Live Kiosk
                    </button>
                    <button
                      onClick={() => setActiveTab('receptionist')}
                      className="py-2.5 px-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all hover:scale-102"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Manage Kiosk
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => switchClient(client.id)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-brand-600 text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                  >
                    <span>Switch to this Client</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Secondary Utility Controls */}
                <div className="flex items-center justify-between gap-1 pt-1 text-slate-400 text-xs">
                  <button
                    onClick={() => onOpenEmbedModal(client)}
                    className="px-2 py-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-cyan-400 flex items-center gap-1 text-[11px] transition-colors"
                    title="Get Iframe & Embed Widget Code"
                  >
                    <Code className="w-3.5 h-3.5" />
                    Embed
                  </button>

                  <button
                    onClick={() => exportClient(client.id)}
                    className="px-2 py-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-emerald-400 flex items-center gap-1 text-[11px] transition-colors"
                    title="Export Client JSON Configuration"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export
                  </button>

                  <button
                    onClick={() => duplicateClient(client.id)}
                    className="px-2 py-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-brand-400 flex items-center gap-1 text-[11px] transition-colors"
                    title="Clone as New Template"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Clone
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Delete client organization "${client.name}"?`)) {
                        deleteClient(client.id);
                      }
                    }}
                    className="px-2 py-1 rounded-lg hover:bg-rose-950/60 text-slate-500 hover:text-rose-400 flex items-center gap-1 text-[11px] transition-colors"
                    title="Delete Client"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* Footer Utility */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-800/80 text-xs text-slate-500">
        <p>AuraDesk Multi-Tenant Architecture &bull; Ready for physical kiosk or web embedding</p>
        <button
          onClick={resetClientsToDefault}
          className="text-slate-400 hover:text-rose-400 text-[11px] underline"
        >
          Reset Demo Organizations
        </button>
      </div>

    </div>
  );
};
