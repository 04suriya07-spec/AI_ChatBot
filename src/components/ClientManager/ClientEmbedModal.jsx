import React, { useState } from 'react';
import { 
  Code, 
  Copy, 
  Check, 
  ExternalLink, 
  X, 
  Tablet, 
  Globe, 
  QrCode, 
  Download,
  Sparkles
} from 'lucide-react';

export const ClientEmbedModal = ({ client, isOpen, onClose, onLaunchKiosk }) => {
  const [copiedType, setCopiedType] = useState(null);

  if (!isOpen || !client) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const directKioskUrl = `${origin}/#kiosk/${client.slug || client.id}`;

  const iframeSnippet = `<!-- AuraDesk AI Receptionist Embed for ${client.name} -->
<iframe
  src="${directKioskUrl}"
  width="100%"
  height="700px"
  style="border: none; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);"
  allow="microphone"
  title="${client.name} AI Voice Receptionist"
></iframe>`;

  const widgetSnippet = `<!-- AuraDesk Floating Voice Widget -->
<script 
  src="${origin}/widget.js"
  data-client-id="${client.id}"
  data-primary-color="${client.branding?.primaryColor || '#3b82f6'}"
  data-position="bottom-right"
  defer>
</script>`;

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-500/20 text-brand-400 rounded-xl">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display leading-snug">Deploy & Embed AI Receptionist</h2>
              <p className="text-xs text-slate-400">{client.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
            <X className="w-5 h-5 text-slate-400 hover:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300 flex-1">
          
          {/* 1. Direct Kiosk URL & Tablet Launcher */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 flex items-center gap-1.5 text-xs">
                <Tablet className="w-4 h-4 text-emerald-400" />
                Physical Front Desk Tablet Kiosk Link
              </span>
              <button
                onClick={() => {
                  onClose();
                  onLaunchKiosk(client);
                }}
                className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 text-[11px]"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open Live Standalone Kiosk
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Open this link on an iPad, Galaxy Tab, or touchscreen at your physical front desk in full screen.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={directKioskUrl}
                className="flex-1 p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 font-mono text-[11px]"
              />
              <button
                onClick={() => copyToClipboard(directKioskUrl, 'url')}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-1 shrink-0"
              >
                {copiedType === 'url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'url' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* 2. Responsive Iframe Embed Snippet */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 flex items-center gap-1.5 text-xs">
                <Globe className="w-4 h-4 text-brand-400" />
                Website Iframe Embed Code
              </span>
              <button
                onClick={() => copyToClipboard(iframeSnippet, 'iframe')}
                className="text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1 text-[11px]"
              >
                {copiedType === 'iframe' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'iframe' ? 'Snippet Copied' : 'Copy Code'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Embed the complete AI voice kiosk directly on WordPress, Squarespace, Webflow, or custom portals.
            </p>
            <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto">
              {iframeSnippet}
            </pre>
          </div>

          {/* 3. Floating Web Widget Script */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 flex items-center gap-1.5 text-xs">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Floating AI Voice Widget Script
              </span>
              <button
                onClick={() => copyToClipboard(widgetSnippet, 'widget')}
                className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 text-[11px]"
              >
                {copiedType === 'widget' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'widget' ? 'Script Copied' : 'Copy Script'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto">
              {widgetSnippet}
            </pre>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
