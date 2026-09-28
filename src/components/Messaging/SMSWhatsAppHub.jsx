import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  CheckCheck, 
  FileText, 
  Clock, 
  Sparkles, 
  Smartphone, 
  Check, 
  RefreshCw 
} from 'lucide-react';
import { useClient } from '../../context/ClientContext';

export const SMSWhatsAppHub = () => {
  const { activeClient } = useClient();

  const [activeTab, setActiveTab] = useState('templates'); // 'templates' | 'sent'
  const [testNumber, setTestNumber] = useState('+91 98401 23456');
  const [selectedTemplate, setSelectedTemplate] = useState('appointment');
  const [sentAlert, setSentAlert] = useState(false);

  const templates = [
    {
      id: 'appointment',
      title: 'Appointment & Site Tour Confirmation',
      channel: 'WhatsApp & SMS',
      text: `Thanks for contacting ${activeClient.name}! Your appointment is confirmed for tomorrow at 2:00 PM with your host. Location: ${activeClient.companyInfo?.address}. Reply YES to confirm or CANCEL to reschedule.`
    },
    {
      id: 'brochure',
      title: 'Property / Clinic Pricing Info Pack',
      channel: 'WhatsApp',
      text: `Hi from ${activeClient.name}! Here is the detailed floor plan, brochure, and pricing breakdown we discussed on your call. Download PDF: https://${activeClient.slug}.com/brochure.pdf`
    },
    {
      id: 'reminder',
      title: '24-Hour Prior Reminder',
      channel: 'SMS',
      text: `Reminder: Your appointment with ${activeClient.name} is tomorrow at 2:00 PM. Parking is complimentary on Basement Level B1.`
    }
  ];

  const handleSendTest = (e) => {
    e.preventDefault();
    setSentAlert(true);
    setTimeout(() => setSentAlert(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950/40 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            AUTOMATED POST-CALL SMS & WHATSAPP
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            Instant Messaging & Document Follow-Up
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Immediately after an AI call ends, Aura automatically dispatches WhatsApp confirmations, directions, digital brochures, and calendar invites.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold flex items-center gap-1.5">
            <CheckCheck className="w-4 h-4" />
            WhatsApp Cloud API Connected
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left: Templates & Rules */}
        <div className="md:col-span-7 space-y-4">
          <h3 className="font-bold text-sm text-white">Automated Message Dispatch Triggers</h3>
          
          <div className="space-y-3">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl.id)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                  selectedTemplate === tpl.id
                    ? 'bg-slate-900 border-emerald-500 shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200 text-xs">{tpl.title}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {tpl.channel}
                  </span>
                </div>
                <p className="text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800 font-mono">
                  "{tpl.text}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Message Dispatch Tester */}
        <div className="md:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            Test Live WhatsApp / SMS Dispatch
          </h3>

          <form onSubmit={handleSendTest} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Recipient Mobile Number</label>
              <input
                type="text"
                required
                value={testNumber}
                onChange={(e) => setTestNumber(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono text-xs"
              />
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-200 text-xs space-y-2">
              <span className="font-bold block text-[11px] uppercase tracking-wider text-emerald-400">
                Message Preview:
              </span>
              <p className="italic">
                "{templates.find(t => t.id === selectedTemplate)?.text}"
              </p>
            </div>

            {sentAlert && (
              <div className="p-3 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
                <Check className="w-4 h-4" />
                <span>Test message dispatched successfully to {testNumber}!</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all hover:scale-102"
            >
              <Send className="w-4 h-4" />
              Send Live Test Message
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
