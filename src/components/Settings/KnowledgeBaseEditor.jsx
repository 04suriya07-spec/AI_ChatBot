import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Building, 
  Wifi, 
  Car, 
  Clock, 
  HelpCircle, 
  Save, 
  Check 
} from 'lucide-react';
import { useReceptionist } from '../../context/ReceptionistContext';

export const KnowledgeBaseEditor = () => {
  const { 
    companyInfo, 
    setCompanyInfo, 
    knowledgeBase, 
    addKnowledgeItem, 
    deleteKnowledgeItem 
  } = useReceptionist();

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showAddFaq, setShowAddFaq] = useState(false);

  // New FAQ form
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('General');

  const handleSaveCompany = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleAddFaq = (e) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    addKnowledgeItem({
      id: `kb-${Date.now()}`,
      question: question.trim(),
      answer: answer.trim(),
      category: category
    });

    setQuestion('');
    setAnswer('');
    setShowAddFaq(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            Front Desk Knowledge Base & Business Info
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure business details, facilities, Wi-Fi credentials, and custom FAQs for Aura to answer.
          </p>
        </div>

        {savedSuccess && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-semibold animate-fadeIn">
            <Check className="w-3.5 h-3.5" />
            Saved
          </span>
        )}
      </div>

      {/* Facility & Contact Details Form */}
      <form onSubmit={handleSaveCompany} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Building className="w-4 h-4 text-brand-400" />
          Company & Front Desk Profile
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Company / Facility Name</label>
            <input
              type="text"
              value={companyInfo.name}
              onChange={(e) => setCompanyInfo(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Receptionist Desk Subtitle / Tagline</label>
            <input
              type="text"
              value={companyInfo.tagline}
              onChange={(e) => setCompanyInfo(prev => ({ ...prev, tagline: e.target.value }))}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
            />
          </div>

          <div className="col-span-full">
            <label className="block text-slate-400 mb-1">Office Address & Suite</label>
            <input
              type="text"
              value={companyInfo.address}
              onChange={(e) => setCompanyInfo(prev => ({ ...prev, address: e.target.value }))}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Operating Hours</label>
            <input
              type="text"
              value={companyInfo.operatingHours}
              onChange={(e) => setCompanyInfo(prev => ({ ...prev, operatingHours: e.target.value }))}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Front Desk Phone</label>
            <input
              type="text"
              value={companyInfo.phone}
              onChange={(e) => setCompanyInfo(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Guest Wi-Fi Network Name</label>
            <input
              type="text"
              value={companyInfo.wifiName}
              onChange={(e) => setCompanyInfo(prev => ({ ...prev, wifiName: e.target.value }))}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Guest Wi-Fi Password</label>
            <input
              type="text"
              value={companyInfo.wifiPass}
              onChange={(e) => setCompanyInfo(prev => ({ ...prev, wifiPass: e.target.value }))}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
            />
          </div>

          <div className="col-span-full">
            <label className="block text-slate-400 mb-1">Parking & Garage Guidance</label>
            <textarea
              rows={2}
              value={companyInfo.parkingInfo}
              onChange={(e) => setCompanyInfo(prev => ({ ...prev, parkingInfo: e.target.value }))}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-500/20 flex items-center gap-1.5 transition-all"
          >
            <Save className="w-4 h-4" />
            Update Business Details
          </button>
        </div>
      </form>

      {/* FAQs & Knowledge QA Base */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              Verified FAQs & Response Directory
            </h3>
            <p className="text-xs text-slate-400">Questions Aura can answer instantaneously without hesitation.</p>
          </div>

          <button
            onClick={() => setShowAddFaq(true)}
            className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-xs font-semibold flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add FAQ
          </button>
        </div>

        <div className="space-y-3">
          {knowledgeBase.map((kb) => (
            <div
              key={kb.id}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all space-y-1.5 text-xs group"
            >
              <div className="flex items-start justify-between">
                <span className="font-bold text-slate-100 text-sm">{kb.question}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                    {kb.category}
                  </span>
                  <button
                    onClick={() => deleteKnowledgeItem(kb.id)}
                    className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                    title="Delete FAQ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed">{kb.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Add FAQ Modal */}
      {showAddFaq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold font-display text-white">Add Knowledge Base FAQ</h3>
            
            <form onSubmit={handleAddFaq} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Visitor Question / Topic</label>
                <input
                  type="text"
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. Where is the nearest ATM or bank?"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Concierge / General / Directions"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Receptionist Spoken Answer</label>
                <textarea
                  rows={3}
                  required
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="e.g. There is a Chase ATM located on the ground floor next to the East exit."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddFaq(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Save FAQ Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
