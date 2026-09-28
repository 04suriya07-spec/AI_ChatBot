import React, { useState } from 'react';
import { 
  Bot, 
  Layers, 
  Sparkles, 
  PhoneCall, 
  FileText, 
  Flame, 
  RotateCw, 
  MessageSquare, 
  TrendingUp, 
  GitFork, 
  Plug, 
  ShieldCheck, 
  Radio, 
  Phone, 
  CreditCard,
  ChevronDown,
  Plus,
  Check,
  ExternalLink,
  Volume2,
  Calendar,
  Users
} from 'lucide-react';
import { useReceptionist } from '../context/ReceptionistContext';
import { useClient } from '../context/ClientContext';

export const Navbar = ({ activeTab, setActiveTab, onOpenNewClientWizard, onLaunchKiosk }) => {
  const { receptionistState, playGreeting } = useReceptionist();
  const { clients, activeClientId, switchClient, activeClient } = useClient();

  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);

  const hotLeadsCount = (activeClient.leads || []).filter(l => l.status === 'HOT').length;

  const navSections = [
    { id: 'clients', label: 'All Clients', icon: Layers, badge: clients.length },
    { id: 'receptionist', label: 'Kiosk Desk', icon: Sparkles },
    { id: 'phonesim', label: 'Phone Simulator', icon: PhoneCall },
    { id: 'calllogs', label: 'Call Intelligence', icon: FileText },
    { id: 'leads', label: 'Hot Leads', icon: Flame, badge: hotLeadsCount > 0 ? `${hotLeadsCount} HOT` : null, isHot: true },
    { id: 'followup', label: 'Outbound Follow-Up', icon: RotateCw },
    { id: 'messaging', label: 'SMS & WhatsApp', icon: MessageSquare },
    { id: 'roi', label: 'ROI Impact', icon: TrendingUp },
    { id: 'workflows', label: 'Call Workflows', icon: GitFork },
    { id: 'integrations', label: 'Integrations', icon: Plug },
    { id: 'guardrails', label: 'Guardrails', icon: ShieldCheck },
    { id: 'voicestudio', label: 'Voice Studio', icon: Radio },
    { id: 'telephony', label: 'Phone Setup', icon: Phone },
    { id: 'billing', label: 'Billing & Usage', icon: CreditCard }
  ];

  const brandColor = activeClient.branding?.primaryColor || '#3b82f6';

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Tier: Logo, Client Switcher, Kiosk Button, Voice Test */}
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & Platform Tag */}
          <div className="flex items-center gap-3 shrink-0">
            <div 
              onClick={() => setActiveTab('clients')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
                  <Bot className="w-5 h-5" />
                </div>
                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-950 ${
                  receptionistState === 'listening' ? 'bg-cyan-400 animate-ping' :
                  receptionistState === 'speaking' ? 'bg-emerald-400' :
                  receptionistState === 'thinking' ? 'bg-purple-400 animate-spin' :
                  'bg-blue-500'
                }`}></span>
              </div>

              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-black text-base tracking-tight text-white">
                    Aura<span className="text-cyan-400">Desk</span>
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-brand-950 text-brand-400 border border-brand-800/60">
                    ENTERPRISE AI
                  </span>
                </div>
              </div>
            </div>

            <div className="h-6 w-px bg-slate-800 hidden md:block"></div>

            {/* Client Organization Switcher */}
            <div className="relative">
              <button
                onClick={() => setClientDropdownOpen(!clientDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-slate-600 text-xs font-semibold text-white shadow-sm transition-all"
              >
                <div 
                  className="w-2.5 h-2.5 rounded-full shrink-0" 
                  style={{ backgroundColor: brandColor }}
                />
                <span className="max-w-[130px] sm:max-w-[190px] truncate text-slate-100 font-bold">
                  {activeClient.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {clientDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-700/90 shadow-2xl p-2 z-50 animate-fadeIn text-xs">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Switch Client Workspace
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-1 py-1">
                    {clients.map((c) => {
                      const isSelected = c.id === activeClientId;
                      return (
                        <div
                          key={c.id}
                          onClick={() => {
                            switchClient(c.id);
                            setClientDropdownOpen(false);
                          }}
                          className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-brand-950/80 text-white border border-brand-500/50'
                              : 'text-slate-300 hover:bg-slate-800/80'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <div 
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: c.branding?.primaryColor || '#3b82f6' }}
                            />
                            <div className="truncate">
                              <span className="font-semibold block truncate">{c.name}</span>
                              <span className="text-[10px] text-slate-400 capitalize">{c.industry} &bull; {c.plan}</span>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-brand-400 shrink-0 ml-2" />}
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2 mt-1 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setClientDropdownOpen(false);
                        onOpenNewClientWizard();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-brand-600/20 hover:bg-brand-600/30 text-brand-300 font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Onboard New Client
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onLaunchKiosk(activeClient)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all hover:scale-102"
              title="Launch Fullscreen Dedicated Front-Desk Kiosk"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Launch Kiosk</span>
            </button>

            <button
              onClick={() => playGreeting()}
              title="Test Receptionist Voice"
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>

        </div>

        {/* Bottom Tier: Full 20-Point Feature Navigation Tabs (Scrollable Bar) */}
        <nav className="flex overflow-x-auto py-2 gap-1 border-t border-slate-800/80 scrollbar-none">
          {navSections.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-600 to-cyan-600 text-white shadow-md shadow-brand-500/20'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold ${
                    item.isHot ? 'bg-amber-500 text-slate-950' : 'bg-brand-500 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

      </div>
    </header>
  );
};
