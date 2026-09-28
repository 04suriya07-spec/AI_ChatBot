import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialClients } from '../services/defaultClients';

const ClientContext = createContext(null);

export const ClientProvider = ({ children }) => {
  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem('aura_saas_clients');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Error parsing stored clients:', e);
      }
    }
    return initialClients;
  });

  const [activeClientId, setActiveClientId] = useState(() => {
    const savedId = localStorage.getItem('aura_active_client_id');
    if (savedId && clients.some(c => c.id === savedId)) return savedId;
    return clients[0]?.id || 'client-apex-tech';
  });

  // Save clients list to localStorage
  useEffect(() => {
    localStorage.setItem('aura_saas_clients', JSON.stringify(clients));
  }, [clients]);

  // Save active client ID to localStorage
  useEffect(() => {
    localStorage.setItem('aura_active_client_id', activeClientId);
  }, [activeClientId]);

  // Current active client object
  const activeClient = clients.find(c => c.id === activeClientId) || clients[0] || initialClients[0];

  // Switch active client
  const switchClient = (id) => {
    if (clients.some(c => c.id === id)) {
      setActiveClientId(id);
    }
  };

  // Create new client organization
  const createClient = (newClientData) => {
    const id = `client-${Date.now()}`;
    const slug = (newClientData.slug || newClientData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/^-|-$/g, '');
    
    const client = {
      id,
      slug,
      name: newClientData.name,
      tagline: newClientData.tagline || 'Front Desk & Visitor Concierge',
      industry: newClientData.industry || 'corporate',
      plan: newClientData.plan || 'Professional',
      status: 'Active',
      branding: {
        primaryColor: newClientData.branding?.primaryColor || '#3b82f6',
        accentColor: newClientData.branding?.accentColor || '#06b6d4',
        logoIcon: newClientData.branding?.logoIcon || 'Building2',
        logoUrl: newClientData.branding?.logoUrl || '',
        kioskTitle: newClientData.branding?.kioskTitle || `${newClientData.name} Front Desk`,
        welcomeMessage: newClientData.branding?.welcomeMessage || `Welcome to ${newClientData.name}. How may Aura assist you today?`
      },
      voiceConfig: {
        aiName: newClientData.voiceConfig?.aiName || 'Aura',
        voiceURI: newClientData.voiceConfig?.voiceURI || '',
        voicePitch: newClientData.voiceConfig?.voicePitch || 1.0,
        voiceRate: newClientData.voiceConfig?.voiceRate || 1.0,
        voiceVolume: 1.0,
        autoListenAfterSpeak: true,
        soundFxEnabled: true,
        customGreeting: newClientData.voiceConfig?.customGreeting || `Welcome to ${newClientData.name}! I'm Aura, your AI receptionist. How may I assist you today?`,
        systemPrompt: newClientData.voiceConfig?.systemPrompt || `You are Aura, an AI receptionist for ${newClientData.name}.`
      },
      companyInfo: {
        name: newClientData.name,
        address: newClientData.companyInfo?.address || '100 Business Parkway, Suite 100',
        phone: newClientData.companyInfo?.phone || '+1 (800) 555-0100',
        email: newClientData.companyInfo?.email || `frontdesk@${slug}.com`,
        operatingHours: newClientData.companyInfo?.operatingHours || 'Mon–Fri: 8:00 AM – 6:00 PM',
        wifiName: newClientData.companyInfo?.wifiName || `${newClientData.name.replace(/\s+/g, '')}-Guest`,
        wifiPass: newClientData.companyInfo?.wifiPass || 'GuestWiFi2026',
        parkingInfo: newClientData.companyInfo?.parkingInfo || 'Complimentary visitor parking available.',
        emergencyContact: newClientData.companyInfo?.emergencyContact || 'Security Desk: Dial 0'
      },
      stats: {
        totalInteractions: 0,
        visitorsToday: 0,
        appointmentsBooked: 0,
        messagesLogged: 0
      },
      staffDirectory: newClientData.staffDirectory || [],
      visitors: newClientData.visitors || [],
      appointments: newClientData.appointments || [],
      messages: newClientData.messages || [],
      knowledgeBase: newClientData.knowledgeBase || []
    };

    setClients(prev => [client, ...prev]);
    setActiveClientId(id);
    return client;
  };

  // Update existing client configuration or sub-records
  const updateClient = (id, updates) => {
    setClients(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          ...updates,
          branding: { ...c.branding, ...(updates.branding || {}) },
          voiceConfig: { ...c.voiceConfig, ...(updates.voiceConfig || {}) },
          companyInfo: { ...c.companyInfo, ...(updates.companyInfo || {}) },
          stats: { ...c.stats, ...(updates.stats || {}) }
        };
      }
      return c;
    }));
  };

  // Duplicate an existing client as a new template
  const duplicateClient = (id) => {
    const target = clients.find(c => c.id === id);
    if (!target) return;

    const newId = `client-${Date.now()}`;
    const clone = {
      ...JSON.parse(JSON.stringify(target)),
      id: newId,
      name: `${target.name} (Copy)`,
      slug: `${target.slug}-copy`,
      stats: { totalInteractions: 0, visitorsToday: 0, appointmentsBooked: 0, messagesLogged: 0 },
      visitors: [],
      appointments: [],
      messages: []
    };

    setClients(prev => [clone, ...prev]);
    setActiveClientId(newId);
    return clone;
  };

  // Delete a client
  const deleteClient = (id) => {
    if (clients.length <= 1) {
      alert("You must keep at least one active client organization.");
      return;
    }
    const remaining = clients.filter(c => c.id !== id);
    setClients(remaining);
    if (activeClientId === id) {
      setActiveClientId(remaining[0].id);
    }
  };

  // Export client config to JSON
  const exportClient = (id) => {
    const target = clients.find(c => c.id === id) || activeClient;
    const jsonStr = JSON.stringify(target, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `auradesk-${target.slug}-config.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import client config from JSON
  const importClient = (jsonStr) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!parsed.name) throw new Error("Invalid client configuration format.");
      
      const newId = `client-${Date.now()}`;
      const imported = {
        ...parsed,
        id: newId,
        slug: parsed.slug || parsed.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      };

      setClients(prev => [imported, ...prev]);
      setActiveClientId(newId);
      return imported;
    } catch (err) {
      console.error("Failed to import client JSON:", err);
      throw err;
    }
  };

  // Reset all clients to initial defaults
  const resetClientsToDefault = () => {
    if (window.confirm("Are you sure you want to reset all client organizations to initial presets?")) {
      setClients(initialClients);
      setActiveClientId(initialClients[0].id);
      localStorage.removeItem('aura_saas_clients');
      localStorage.removeItem('aura_active_client_id');
    }
  };

  return (
    <ClientContext.Provider
      value={{
        clients,
        activeClientId,
        activeClient,
        switchClient,
        createClient,
        updateClient,
        duplicateClient,
        deleteClient,
        exportClient,
        importClient,
        resetClientsToDefault
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => useContext(ClientContext);
