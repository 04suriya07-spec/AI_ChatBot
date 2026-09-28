import React, { useState } from 'react';
import { 
  Plug, 
  Calendar, 
  Table, 
  MessageSquare, 
  Globe, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Layers, 
  Database,
  ArrowUpRight
} from 'lucide-react';
import { useClient } from '../../context/ClientContext';

export const IntegrationsHub = () => {
  const { activeClient } = useClient();
  const integrations = activeClient.integrations || {};

  const [connectedItems, setConnectedItems] = useState({
    calendar: true,
    sheets: true,
    whatsapp: true,
    hubspot: false,
    zapier: false
  });

  const toggleConnect = (key) => {
    setConnectedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950/40 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-bold mb-2">
            <Plug className="w-3.5 h-3.5" />
            INTELLIGENT THIRD-PARTY INTEGRATIONS
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            Connect Calendars, CRMs & Messaging APIs
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Aura seamlessly reads live calendar slots, syncs qualified leads directly to Google Sheets & HubSpot, and triggers instant WhatsApp follow-ups.
          </p>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Google Calendar */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                connectedItems.calendar ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
              }`}>
                {connectedItems.calendar ? '🟢 Synced & Active' : 'Disconnected'}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Google & Outlook Calendar</h3>
              <p className="text-xs text-slate-400 mt-1">
                Reads live doctor / sales staff availability and writes confirmed appointment bookings directly to calendar.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 font-mono">
              Connected: {integrations.googleCalendar?.connectedAccount || 'sales@organization.com'}
            </div>
          </div>

          <button
            onClick={() => toggleConnect('calendar')}
            className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors ${
              connectedItems.calendar ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-brand-600 text-white hover:bg-brand-500'
            }`}
          >
            {connectedItems.calendar ? 'Manage Calendar Sync' : 'Connect Google Calendar'}
          </button>
        </div>

        {/* Google Sheets Live Lead Sync */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Table className="w-6 h-6" />
              </div>
              <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                connectedItems.sheets ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
              }`}>
                {connectedItems.sheets ? '🟢 Live Sheet Sync' : 'Disconnected'}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Google Sheets Lead Exporter</h3>
              <p className="text-xs text-slate-400 mt-1">
                Every captured lead (Name, phone, budget, requirement) automatically appends a new row in real-time.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 font-mono">
              Active Sheet: {integrations.googleSheets?.sheetName || 'Live_Leads_2026'}
            </div>
          </div>

          <button
            onClick={() => toggleConnect('sheets')}
            className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors ${
              connectedItems.sheets ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-emerald-600 text-white hover:bg-emerald-500'
            }`}
          >
            {connectedItems.sheets ? 'Open Live Sheet in Drive' : 'Connect Google Sheets'}
          </button>
        </div>

        {/* WhatsApp Business Cloud API */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                🟢 Meta Cloud API
              </span>
            </div>
            <div>
              <h3 className="font-bold text-base text-white">WhatsApp Business Cloud API</h3>
              <p className="text-xs text-slate-400 mt-1">
                Dispatches post-call confirmation messages, brochures, location maps, and reminders over WhatsApp.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 font-mono">
              Sender ID: {integrations.whatsAppBusiness?.senderNumber || activeClient.companyInfo?.phone}
            </div>
          </div>

          <button className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs">
            Configure WhatsApp Templates
          </button>
        </div>

        {/* HubSpot & Salesforce CRM Webhook */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Globe className="w-6 h-6" />
              </div>
              <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                connectedItems.hubspot ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
              }`}>
                {connectedItems.hubspot ? '🟢 Webhook Active' : 'Ready to Connect'}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-base text-white">CRM & Webhooks (HubSpot / Make / Zapier)</h3>
              <p className="text-xs text-slate-400 mt-1">
                Send structured JSON payloads to any CRM whenever a call finishes or a lead is qualified.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 font-mono truncate">
              Webhook: {integrations.crmWebhook?.targetUrl || 'https://api.hubspot.com/v3/leads'}
            </div>
          </div>

          <button
            onClick={() => toggleConnect('hubspot')}
            className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-colors shadow-md"
          >
            {connectedItems.hubspot ? 'Webhook Settings' : 'Enable CRM Webhook'}
          </button>
        </div>

      </div>

    </div>
  );
};
