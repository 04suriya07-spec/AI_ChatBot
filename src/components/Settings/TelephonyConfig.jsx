import React, { useState } from 'react';
import { 
  Phone, 
  PhoneCall, 
  Key, 
  Server, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Globe, 
  ArrowRight,
  Code
} from 'lucide-react';
import { useClient } from '../../context/ClientContext';
import { twilioServerCodeSnippet } from '../../services/telephonyBackendSnippet';

export const TelephonyConfig = () => {
  const { activeClient, updateClient } = useClient();

  const [phoneNumber, setPhoneNumber] = useState(activeClient.companyInfo?.phone || '+1 (415) 555-0199');
  const [twilioSid, setTwilioSid] = useState('');
  const [twilioToken, setTwilioToken] = useState('');
  const [transferNumber, setTransferNumber] = useState('+1 (415) 555-9911');
  const [afterHoursAction, setAfterHoursAction] = useState('voicemail'); // 'voicemail' | 'forward' | 'ai_247'
  const [copiedCode, setCopiedCode] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const webhookUrl = `https://your-auradesk-server.com/api/twilio/incoming-call?client=${activeClient.slug || activeClient.id}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(twilioServerCodeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateClient(activeClient.id, {
      companyInfo: {
        ...activeClient.companyInfo,
        phone: phoneNumber
      }
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[11px] font-bold mb-1">
            <PhoneCall className="w-3.5 h-3.5" />
            TELEPHONY & PHONE NUMBER CARRIER SETUP
          </div>
          <h2 className="text-xl font-bold font-display text-white">
            Connect Real Phone Number for {activeClient.name}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Connect Twilio, Telnyx, or standard mobile/landline numbers so incoming phone calls are answered by Aura.
          </p>
        </div>

        {savedSuccess && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-semibold animate-fadeIn">
            <Check className="w-3.5 h-3.5" />
            Carrier Config Saved
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        
        {/* 1. Phone Number & Carrier Assignment */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-400" />
            1. Dedicated Inbound Phone Number
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Assigned Inbound Phone Number</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 019-2831"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono text-xs"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Purchase on Twilio Console &rarr; Phone Numbers &rarr; Manage &rarr; Buy Number.</span>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Emergency Human Transfer Number</label>
              <input
                type="text"
                value={transferNumber}
                onChange={(e) => setTransferNumber(e.target.value)}
                placeholder="+1 (555) 019-9911"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono text-xs"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Where calls are transferred if caller explicitly asks for a human.</span>
            </div>
          </div>
        </div>

        {/* 2. Twilio Webhook Configuration */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            2. Twilio Voice Webhook URL
          </h3>
          <p className="text-slate-400 text-xs">
            Paste this Webhook URL into your Twilio Console under <strong>Voice &amp; Fax &rarr; "A CALL COMES IN" &rarr; Webhook (HTTP POST)</strong>.
          </p>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
            <span className="font-mono text-cyan-400 text-xs select-all truncate">{webhookUrl}</span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(webhookUrl);
                alert("Webhook URL copied to clipboard!");
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold shrink-0"
            >
              Copy Webhook
            </button>
          </div>
        </div>

        {/* 3. 3-Step Setup Guide & Telephony Server Snippet */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-purple-400" />
              3. Telephony Server Integration Code (Node.js)
            </h3>
            <button
              type="button"
              onClick={handleCopyCode}
              className="px-3 py-1.5 rounded-lg bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-800 text-xs font-semibold flex items-center gap-1.5"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied Server Code' : 'Copy Node.js Server Code'}</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-[11px] text-slate-300">
            <span className="font-bold text-white block">Quick 3-Step Setup Instructions:</span>
            <ol className="list-decimal pl-4 space-y-1 text-slate-400">
              <li>Deploy this Node.js server script to <strong>Railway, Render, AWS, or your VPS</strong>.</li>
              <li>Buy a local phone number in <strong>Twilio Console</strong>.</li>
              <li>Set the Twilio webhook to your server's <code className="text-cyan-400">/api/twilio/incoming-call</code> URL.</li>
            </ol>
          </div>

          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[10px] text-slate-300 max-h-52 overflow-y-auto">
            {twilioServerCodeSnippet}
          </pre>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <Check className="w-4 h-4" />
            Save Carrier Settings
          </button>
        </div>

      </form>
    </div>
  );
};
