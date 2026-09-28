import React from 'react';
import { 
  CreditCard, 
  Clock, 
  Zap, 
  Check, 
  ShieldCheck, 
  ArrowUpRight, 
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { useClient } from '../../context/ClientContext';

export const BillingManager = () => {
  const { activeClient, updateClient } = useClient();
  const stats = activeClient.stats || {};

  const minutesUsed = stats.minutesUsed || 1240;
  const minutesLimit = stats.minutesLimit || 1500;
  const percentage = Math.min(100, Math.round((minutesUsed / minutesLimit) * 100));

  const plans = [
    {
      name: "Starter",
      price: "₹5,999",
      period: "/ month",
      minutes: "500 Minutes Included",
      overage: "₹8 / extra min",
      features: [
        "24/7 AI Phone Answering",
        "1 Dedicated Phone Number",
        "Lead Capture & Scoring",
        "Google Calendar Sync",
        "SMS Confirmations",
        "Email Support"
      ],
      popular: false
    },
    {
      name: "Business",
      price: "₹12,999",
      period: "/ month",
      minutes: "1,500 Minutes Included",
      overage: "₹6 / extra min",
      features: [
        "Everything in Starter",
        "WhatsApp Cloud API Integration",
        "Automated Outbound Follow-Up Calling",
        "Lead Qualification & CRM Sync",
        "Call Recordings & AI Summaries",
        "Custom Visual Workflows",
        "Priority 24/7 Support"
      ],
      popular: true
    },
    {
      name: "Enterprise Pro",
      price: "₹24,999",
      period: "/ month",
      minutes: "4,000 Minutes Included",
      overage: "₹4.5 / extra min",
      features: [
        "Everything in Business",
        "Multiple Phone Numbers & SIP Trunks",
        "Custom Ultra-Realistic Voices (ElevenLabs)",
        "Dedicated Account Engineer",
        "Custom CRM & ERP Integrations",
        "99.9% Telephony SLA"
      ],
      popular: false
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950/40 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold mb-2">
            <CreditCard className="w-3.5 h-3.5" />
            TELEPHONY USAGE & SUBSCRIPTION BILLING
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            Usage Tracking & SaaS Subscription Plans
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Track real-time call minutes consumed, automated message dispatches, and manage subscription billing for {activeClient.name}.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-right">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Current Active Plan</span>
          <span className="text-xl font-bold font-display text-brand-400">{activeClient.plan || 'Business'} Plan</span>
        </div>
      </div>

      {/* Minutes Usage Meter Card */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-base text-white">Monthly AI Voice Minutes Usage</h3>
          </div>
          <span className="font-mono text-sm text-cyan-400 font-bold">
            {minutesUsed} / {minutesLimit} mins ({percentage}%)
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden p-0.5 border border-slate-800">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-brand-500 to-purple-500 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span>Billing Cycle: Renews in 18 days</span>
          <span>{minutesLimit - minutesUsed} mins remaining</span>
        </div>
      </div>

      {/* Pricing Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {plans.map((p, idx) => {
          const isCurrent = (activeClient.plan || 'Business').toLowerCase().includes(p.name.toLowerCase());
          return (
            <div
              key={idx}
              className={`p-6 rounded-3xl border flex flex-col justify-between space-y-6 relative transition-all ${
                p.popular
                  ? 'bg-slate-900 border-brand-500 shadow-2xl shadow-brand-500/20 ring-1 ring-brand-500/40'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-brand-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider shadow-md">
                  Most Popular
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-lg text-white">{p.name}</h4>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-black font-display text-white">{p.price}</span>
                    <span className="text-xs text-slate-400">{p.period}</span>
                  </div>
                  <span className="inline-block mt-2 px-2.5 py-1 rounded-lg bg-slate-950 text-cyan-400 font-mono text-[11px] font-bold border border-slate-800">
                    {p.minutes}
                  </span>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-slate-800/80 text-xs">
                  {p.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  updateClient(activeClient.id, { plan: p.name });
                  alert(`Switched to ${p.name} Plan!`);
                }}
                className={`w-full py-3 rounded-xl font-bold text-xs transition-all shadow-md ${
                  isCurrent
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : p.popular
                    ? 'bg-brand-600 hover:bg-brand-500 text-white hover:scale-102'
                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
              >
                {isCurrent ? '✓ Current Active Plan' : `Upgrade to ${p.name}`}
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
};
