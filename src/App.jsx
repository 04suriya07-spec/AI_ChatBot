import React, { useState } from 'react';
import { ClientProvider, useClient } from './context/ClientContext';
import { ReceptionistProvider, useReceptionist } from './context/ReceptionistContext';
import { Navbar } from './components/Navbar';
import { ClientList } from './components/ClientManager/ClientList';
import { NewClientWizard } from './components/ClientManager/NewClientWizard';
import { ClientEmbedModal } from './components/ClientManager/ClientEmbedModal';
import { DedicatedKiosk } from './components/PublicKiosk/DedicatedKiosk';
import { ReceptionistView } from './components/LiveReceptionist/ReceptionistView';
import { PhoneSimulator } from './components/PhoneIntegration/PhoneSimulator';
import { CallLogsView } from './components/CallIntelligence/CallLogsView';
import { LeadManagement } from './components/Leads/LeadManagement';
import { FollowUpManager } from './components/FollowUp/FollowUpManager';
import { SMSWhatsAppHub } from './components/Messaging/SMSWhatsAppHub';
import { ROIDashboard } from './components/Analytics/ROIDashboard';
import { WorkflowBuilder } from './components/Workflows/WorkflowBuilder';
import { IntegrationsHub } from './components/Integrations/IntegrationsHub';
import { GuardrailsConfig } from './components/Settings/GuardrailsConfig';
import { VoiceStudio } from './components/Settings/VoiceStudio';
import { TelephonyConfig } from './components/Settings/TelephonyConfig';
import { BillingManager } from './components/Billing/BillingManager';
import { VisitorPassModal } from './components/VisitorPassModal';

function AppContent() {
  const [activeTab, setActiveTab] = useState('calllogs');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [embedModalClient, setEmbedModalClient] = useState(null);
  const [kioskClient, setKioskClient] = useState(null);

  const { activeClient } = useClient();

  const handleLaunchKiosk = (client) => {
    setKioskClient(client || activeClient);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-brand-500 selection:text-white relative">
      
      {/* Ambient background lighting */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Navbar with full 20-Point Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenNewClientWizard={() => setIsWizardOpen(true)}
        onLaunchKiosk={handleLaunchKiosk}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'clients' && (
          <ClientList 
            onOpenNewClientWizard={() => setIsWizardOpen(true)}
            onOpenEmbedModal={(client) => setEmbedModalClient(client)}
            onLaunchKiosk={handleLaunchKiosk}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === 'receptionist' && <ReceptionistView />}
        {activeTab === 'phonesim' && <PhoneSimulator />}
        {activeTab === 'calllogs' && <CallLogsView />}
        {activeTab === 'leads' && <LeadManagement />}
        {activeTab === 'followup' && <FollowUpManager />}
        {activeTab === 'messaging' && <SMSWhatsAppHub />}
        {activeTab === 'roi' && <ROIDashboard />}
        {activeTab === 'workflows' && <WorkflowBuilder />}
        {activeTab === 'integrations' && <IntegrationsHub />}
        {activeTab === 'guardrails' && <GuardrailsConfig />}
        {activeTab === 'voicestudio' && <VoiceStudio />}
        {activeTab === 'telephony' && <TelephonyConfig />}
        {activeTab === 'billing' && <BillingManager />}
      </main>

      {/* Standalone Fullscreen Public Kiosk Mode */}
      {kioskClient && (
        <DedicatedKiosk 
          client={kioskClient} 
          onClose={() => setKioskClient(null)} 
        />
      )}

      {/* 5-Step Onboarding Wizard Modal */}
      <NewClientWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onClientCreated={(newClient) => {
          setActiveTab('receptionist');
        }}
      />

      {/* Client Embed Snippet Modal */}
      <ClientEmbedModal
        client={embedModalClient}
        isOpen={!!embedModalClient}
        onClose={() => setEmbedModalClient(null)}
        onLaunchKiosk={handleLaunchKiosk}
      />

      {/* Global Digital Visitor Badge Pass Modal */}
      <VisitorPassModal />

      {/* Footer */}
      <footer className="py-4 border-t border-slate-900 text-center text-xs text-slate-500 bg-slate-950/80">
        <p>AuraDesk AI &bull; Enterprise 24/7 Autonomous Voice Agent Platform &bull; Active Tenant: <strong className="text-slate-300">{activeClient?.name}</strong></p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ClientProvider>
      <ReceptionistProvider>
        <AppContent />
      </ReceptionistProvider>
    </ClientProvider>
  );
}
