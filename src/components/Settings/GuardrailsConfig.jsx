import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  UserCheck, 
  Ban, 
  Lock, 
  Check, 
  HelpCircle,
  PhoneForwarded,
  Sparkles
} from 'lucide-react';
import { useClient } from '../../context/ClientContext';

export const GuardrailsConfig = () => {
  const { activeClient, updateClient } = useClient();
  const guardrails = activeClient.guardrails || {
    strictKnowledgeOnly: true,
    prohibitMedicalDiagnosis: true,
    prohibitFinancialAdvice: true,
    mandatoryAiDisclosure: true,
    profanityFilter: true,
    emergencyKeywords: ["fire", "flood", "emergency", "police", "legal action", "ambulance", "pipe burst"]
  };

  const [strictKnowledge, setStrictKnowledge] = useState(guardrails.strictKnowledgeOnly);
  const [prohibitMedical, setProhibitMedical] = useState(guardrails.prohibitMedicalDiagnosis);
  const [prohibitFinance, setProhibitFinance] = useState(guardrails.prohibitFinancialAdvice);
  const [aiDisclosure, setAiDisclosure] = useState(guardrails.mandatoryAiDisclosure);
  const [keywords, setKeywords] = useState(guardrails.emergencyKeywords.join(', '));
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateClient(activeClient.id, {
      guardrails: {
        strictKnowledgeOnly: strictKnowledge,
        prohibitMedicalDiagnosis: prohibitMedical,
        prohibitFinancialAdvice: prohibitFinance,
        mandatoryAiDisclosure: aiDisclosure,
        profanityFilter: true,
        emergencyKeywords: keywords.split(',').map(k => k.trim()).filter(Boolean)
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
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800 text-[11px] font-bold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            AI SAFETY & ENTERPRISE GUARDRAILS
          </div>
          <h2 className="text-xl font-bold font-display text-white">
            Safety Boundaries, Hallucination Prevention & Handoff
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Strict boundaries ensuring the AI never hallucinates, respects ethical/medical boundaries, and transfers complex calls.
          </p>
        </div>

        {savedSuccess && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-semibold animate-fadeIn">
            <Check className="w-3.5 h-3.5" />
            Guardrails Saved
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        
        {/* Hallucination Prevention Rule */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            1. Knowledge Base Strictness (No Hallucinations)
          </h3>

          <label className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={strictKnowledge}
              onChange={(e) => setStrictKnowledge(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded text-brand-600 accent-brand-500"
            />
            <div>
              <span className="font-bold text-slate-200 block text-xs">
                "Don't Know &rarr; Don't Invent" Policy
              </span>
              <span className="text-slate-400 text-[11px] leading-relaxed block mt-0.5">
                If a caller asks a question not found in the verified Knowledge Base, the AI will strictly reply: <em>"I'm not certain about that detail. Let me take your contact info or connect you directly with our team."</em> instead of making up answers.
              </span>
            </div>
          </label>
        </div>

        {/* Industry Safety Boundaries */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Ban className="w-4 h-4 text-rose-400" />
            2. High-Risk Professional Boundaries
          </h3>

          <div className="space-y-3">
            <label className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={prohibitMedical}
                onChange={(e) => setProhibitMedical(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-brand-600 accent-brand-500"
              />
              <div>
                <span className="font-bold text-slate-200 block">Prohibit Medical / Diagnostic Advice</span>
                <span className="text-slate-400 text-[11px]">
                  AI is strictly barred from diagnosing illnesses or giving medical guidance. It will triage appointments and route emergencies immediately.
                </span>
              </div>
            </label>

            <label className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={prohibitFinance}
                onChange={(e) => setProhibitFinance(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-brand-600 accent-brand-500"
              />
              <div>
                <span className="font-bold text-slate-200 block">Prohibit Financial / Legal Speculation</span>
                <span className="text-slate-400 text-[11px]">
                  AI restricts quotes to published rates and refers legal or investment guarantees to licensed partners.
                </span>
              </div>
            </label>

            <label className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={aiDisclosure}
                onChange={(e) => setAiDisclosure(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-brand-600 accent-brand-500"
              />
              <div>
                <span className="font-bold text-slate-200 block">Transparent AI Identity Disclosure</span>
                <span className="text-slate-400 text-[11px]">
                  Clearly identifies itself as an AI assistant when asked ("Are you an AI or human?"), adhering to telecommunications compliance laws.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Emergency & Escalation Triggers */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            3. Emergency & Immediate Escalation Keywords
          </h3>
          <p className="text-slate-400 text-xs">
            When any of these keywords are spoken, the AI immediately flags the call as 🚨 EMERGENCY and initiates priority transfer to human staff.
          </p>

          <div>
            <textarea
              rows={2}
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono text-xs"
              placeholder="e.g. fire, flood, emergency, bleeding, police, burst pipe"
            />
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <Check className="w-4 h-4" />
            Enforce Guardrails
          </button>
        </div>

      </form>
    </div>
  );
};
