import React, { useState } from 'react';
import { 
  GitFork, 
  Plus, 
  Trash2, 
  ArrowRight, 
  Zap, 
  CheckCircle2, 
  MessageSquare, 
  PhoneForwarded, 
  Calendar 
} from 'lucide-react';
import { useClient } from '../../context/ClientContext';

export const WorkflowBuilder = () => {
  const { activeClient, updateClient } = useClient();
  const workflows = activeClient.workflows || [];

  const [triggerInput, setTriggerInput] = useState('');
  const [actionsInput, setActionsInput] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddWorkflow = (e) => {
    e.preventDefault();
    if (!triggerInput.trim()) return;

    const actionList = actionsInput.split(',').map(a => a.trim()).filter(Boolean);

    const newWf = {
      id: `wf-${Date.now()}`,
      trigger: triggerInput.trim(),
      actions: actionList.length > 0 ? actionList : ["Process intent", "Notify staff"]
    };

    updateClient(activeClient.id, {
      workflows: [...workflows, newWf]
    });

    setTriggerInput('');
    setActionsInput('');
    setShowAddModal(false);
  };

  const handleDeleteWorkflow = (id) => {
    updateClient(activeClient.id, {
      workflows: workflows.filter(w => w.id !== id)
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950/40 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950 text-purple-400 border border-purple-800 text-xs font-bold mb-2">
            <GitFork className="w-3.5 h-3.5" />
            CUSTOM CONVERSATIONAL WORKFLOW BUILDER
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            Visual Call Flows & Logic Triggers
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Configure custom branching paths for any industry scenario (e.g. <em>"When customer asks for pricing &rarr; explain pricing &rarr; ask for appointment"</em>).
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-500/25 flex items-center gap-2 transition-all hover:scale-105 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create New Workflow Rule
        </button>
      </div>

      {/* Workflows List */}
      <div className="space-y-4">
        {workflows.map((wf) => (
          <div
            key={wf.id}
            className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-purple-500/40 shadow-xl space-y-4 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">WHEN CALLER SAYS:</span>
                  <h3 className="font-bold text-base text-white">"{wf.trigger}"</h3>
                </div>
              </div>

              <button
                onClick={() => handleDeleteWorkflow(wf.id)}
                className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                title="Delete Workflow"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Sequence steps */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">AI Action Pipeline:</span>
              {wf.actions.map((act, idx) => (
                <React.Fragment key={idx}>
                  <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-purple-500/30 text-purple-200 text-xs font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>{act}</span>
                  </div>
                  {idx < wf.actions.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-lg font-bold font-display text-white">Add Visual Call Flow Trigger</h3>
            
            <form onSubmit={handleAddWorkflow} className="space-y-4">
              <div>
                <label className="block text-slate-400 mb-1">When customer says (Intent Trigger):</label>
                <input
                  type="text"
                  required
                  value={triggerInput}
                  onChange={(e) => setTriggerInput(e.target.value)}
                  placeholder="e.g. I want to check my order status"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Sequential Actions (comma-separated):</label>
                <input
                  type="text"
                  required
                  value={actionsInput}
                  onChange={(e) => setActionsInput(e.target.value)}
                  placeholder="e.g. Ask for order number, Query database, Read status, Send SMS"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
                >
                  Create Workflow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
