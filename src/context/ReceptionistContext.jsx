import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useClient } from './ClientContext';
import { speechService } from '../services/speechService';
import { processReceptionistInput } from '../services/aiAgent';

const ReceptionistContext = createContext(null);

export const ReceptionistProvider = ({ children }) => {
  const { activeClient, updateClient } = useClient();

  // Client-bound state
  const [companyInfo, setCompanyInfo] = useState(activeClient.companyInfo);
  const [staffDirectory, setStaffDirectory] = useState(activeClient.staffDirectory || []);
  const [visitors, setVisitors] = useState(activeClient.visitors || []);
  const [appointments, setAppointments] = useState(activeClient.appointments || []);
  const [messages, setMessages] = useState(activeClient.messages || []);
  const [knowledgeBase, setKnowledgeBase] = useState(activeClient.knowledgeBase || []);
  const [settings, setSettings] = useState({
    industry: activeClient.industry || 'corporate',
    voiceURI: activeClient.voiceConfig?.voiceURI || '',
    voicePitch: activeClient.voiceConfig?.voicePitch || 1.0,
    voiceRate: activeClient.voiceConfig?.voiceRate || 1.0,
    voiceVolume: 1.0,
    autoListenAfterSpeak: activeClient.voiceConfig?.autoListenAfterSpeak ?? true,
    soundFxEnabled: activeClient.voiceConfig?.soundFxEnabled ?? true,
    geminiApiKey: localStorage.getItem('aura_gemini_key') || '',
    customGreeting: activeClient.voiceConfig?.customGreeting || ''
  });

  // Whenever active client changes, sync local state to new client
  useEffect(() => {
    if (!activeClient) return;
    setCompanyInfo(activeClient.companyInfo);
    setStaffDirectory(activeClient.staffDirectory || []);
    setVisitors(activeClient.visitors || []);
    setAppointments(activeClient.appointments || []);
    setMessages(activeClient.messages || []);
    setKnowledgeBase(activeClient.knowledgeBase || []);
    setSettings(prev => ({
      ...prev,
      industry: activeClient.industry || 'corporate',
      voiceURI: activeClient.voiceConfig?.voiceURI || '',
      voicePitch: activeClient.voiceConfig?.voicePitch || 1.0,
      voiceRate: activeClient.voiceConfig?.voiceRate || 1.0,
      customGreeting: activeClient.voiceConfig?.customGreeting || ''
    }));

    // Reset conversation transcript for new client with their custom greeting
    const greeting = activeClient.voiceConfig?.customGreeting || activeClient.branding?.welcomeMessage || "Welcome! How may I assist you today?";
    setConversation([
      {
        id: `init-${Date.now()}`,
        sender: 'receptionist',
        text: greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: { type: 'GREETING' }
      }
    ]);
  }, [activeClient.id]);

  // Voice and Conversation State
  const [receptionistState, setReceptionistState] = useState('idle'); // 'idle' | 'listening' | 'thinking' | 'speaking'
  const [interimText, setInterimText] = useState('');
  const [conversation, setConversation] = useState([
    {
      id: 'init-1',
      sender: 'receptionist',
      text: activeClient.voiceConfig?.customGreeting || "Welcome! How may I assist you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      action: { type: 'GREETING' }
    }
  ]);
  const [activeAction, setActiveAction] = useState(null);
  const [selectedVisitorForPass, setSelectedVisitorForPass] = useState(null);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  // Sync client state updates back to ClientContext
  const syncToClient = (field, value) => {
    updateClient(activeClient.id, { [field]: value });
  };

  // Sound FX Player
  const playSound = (type) => {
    if (!settings.soundFxEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'startListening') {
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
      } else if (type === 'actionSuccess') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1);
        osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      }
    } catch (e) {
      // AudioContext fallback
    }
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.75 },
        colors: [activeClient.branding?.primaryColor || '#3b82f6', '#06b6d4', '#8b5cf6', '#10b981']
      });
    } catch (e) {
      // Confetti fallback
    }
  };

  // Initialize Speech Listeners
  useEffect(() => {
    speechService.onVoicesChanged = (voices, preferred) => {
      setAvailableVoices(voices);
      if (preferred) setSelectedVoice(preferred);
    };

    speechService.onStateChangeCallback = (state) => {
      setReceptionistState(state);
    };

    speechService.onErrorCallback = (error) => {
      console.warn('Speech Engine error:', error);
      setReceptionistState('idle');
    };
  }, []);

  useEffect(() => {
    if (settings.voiceURI) {
      speechService.setVoice(settings.voiceURI);
    }
  }, [settings.voiceURI]);

  // Main Speech Handler: Process User Utterance
  const handleUserUtterance = async (text) => {
    if (!text || !text.trim()) return;

    setInterimText('');
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversation(prev => [...prev, userMsg]);
    setReceptionistState('thinking');

    try {
      const response = await processReceptionistInput({
        userInput: text,
        conversationHistory: conversation,
        contextData: {
          companyInfo,
          staffDirectory,
          visitors,
          appointments,
          knowledgeBase
        },
        apiKey: settings.geminiApiKey,
        industry: settings.industry
      });

      if (response.action) {
        handleActionExecution(response.action);
      }

      const receptionistMsg = {
        id: `rec-${Date.now()}`,
        sender: 'receptionist',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: response.action
      };

      setConversation(prev => [...prev, receptionistMsg]);
      setActiveAction(response.action);

      // Increment stats for active client
      updateClient(activeClient.id, {
        stats: {
          ...activeClient.stats,
          totalInteractions: (activeClient.stats?.totalInteractions || 0) + 1
        }
      });

      // Speak response aloud
      speechService.speak(response.reply, {
        pitch: settings.voicePitch,
        rate: settings.voiceRate,
        volume: settings.voiceVolume,
        onStart: () => setReceptionistState('speaking'),
        onEnd: () => {
          setReceptionistState('idle');
        }
      });
    } catch (err) {
      console.error('Error processing user utterance:', err);
      setReceptionistState('idle');
    }
  };

  // Tool / Action Execution Handler
  const handleActionExecution = (action) => {
    if (!action) return;

    if (action.type === 'CHECK_IN_VISITOR' && action.data) {
      const updated = [action.data, ...visitors];
      setVisitors(updated);
      syncToClient('visitors', updated);
      playSound('actionSuccess');
      triggerCelebration();
    } else if (action.type === 'CHECK_OUT_VISITOR' && action.data) {
      let updated;
      if (action.data.visitorId) {
        updated = visitors.map(v => 
          v.id === action.data.visitorId 
            ? { ...v, status: 'Checked Out', checkOutTime: action.data.checkOutTime } 
            : v
        );
      } else {
        const firstActive = visitors.findIndex(v => v.status === 'Checked In');
        if (firstActive !== -1) {
          updated = [...visitors];
          updated[firstActive] = {
            ...updated[firstActive],
            status: 'Checked Out',
            checkOutTime: action.data.checkOutTime
          };
        } else {
          updated = visitors;
        }
      }
      setVisitors(updated);
      syncToClient('visitors', updated);
      playSound('actionSuccess');
    } else if (action.type === 'BOOK_APPOINTMENT' && action.data) {
      const updated = [action.data, ...appointments];
      setAppointments(updated);
      syncToClient('appointments', updated);
      playSound('actionSuccess');
      triggerCelebration();
    } else if (action.type === 'TAKE_MESSAGE' && action.data) {
      const updated = [action.data, ...messages];
      setMessages(updated);
      syncToClient('messages', updated);
      playSound('actionSuccess');
    }
  };

  const toggleListening = () => {
    if (receptionistState === 'listening') {
      speechService.stopListening();
    } else {
      if (receptionistState === 'speaking') {
        speechService.stopSpeaking();
      }
      playSound('startListening');
      speechService.startListening(
        (finalResult) => handleUserUtterance(finalResult),
        (interim) => setInterimText(interim)
      );
    }
  };

  const playGreeting = (customText) => {
    const textToSpeak = customText || settings.customGreeting || activeClient.branding?.welcomeMessage || "How may I assist you today?";
    speechService.speak(textToSpeak, {
      pitch: settings.voicePitch,
      rate: settings.voiceRate,
      volume: settings.voiceVolume,
      onStart: () => setReceptionistState('speaking'),
      onEnd: () => setReceptionistState('idle')
    });
  };

  const addVisitor = (visitor) => {
    const updated = [visitor, ...visitors];
    setVisitors(updated);
    syncToClient('visitors', updated);
    playSound('actionSuccess');
  };

  const checkOutVisitor = (id) => {
    const updated = visitors.map(v => 
      v.id === id 
        ? { ...v, status: 'Checked Out', checkOutTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } 
        : v
    );
    setVisitors(updated);
    syncToClient('visitors', updated);
    playSound('actionSuccess');
  };

  const addAppointment = (appt) => {
    const updated = [appt, ...appointments];
    setAppointments(updated);
    syncToClient('appointments', updated);
    playSound('actionSuccess');
  };

  const cancelAppointment = (id) => {
    const updated = appointments.map(a => a.id === id ? { ...a, status: 'Cancelled' } : a);
    setAppointments(updated);
    syncToClient('appointments', updated);
  };

  const updateMessageStatus = (id, status) => {
    const updated = messages.map(m => m.id === id ? { ...m, status } : m);
    setMessages(updated);
    syncToClient('messages', updated);
  };

  const updateStaffStatus = (id, status) => {
    const updated = staffDirectory.map(s => s.id === id ? { ...s, status } : s);
    setStaffDirectory(updated);
    syncToClient('staffDirectory', updated);
  };

  const addKnowledgeItem = (item) => {
    const updated = [...knowledgeBase, item];
    setKnowledgeBase(updated);
    syncToClient('knowledgeBase', updated);
  };

  const deleteKnowledgeItem = (id) => {
    const updated = knowledgeBase.filter(k => k.id !== id);
    setKnowledgeBase(updated);
    syncToClient('knowledgeBase', updated);
  };

  const clearConversation = () => {
    speechService.stopSpeaking();
    speechService.stopListening();
    setConversation([
      {
        id: `clear-${Date.now()}`,
        sender: 'receptionist',
        text: activeClient.voiceConfig?.customGreeting || "How may I assist you today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: { type: 'GREETING' }
      }
    ]);
    setActiveAction(null);
  };

  return (
    <ReceptionistContext.Provider
      value={{
        activeClient,
        companyInfo,
        setCompanyInfo: (val) => {
          setCompanyInfo(val);
          syncToClient('companyInfo', val);
        },
        staffDirectory,
        setStaffDirectory: (val) => {
          setStaffDirectory(val);
          syncToClient('staffDirectory', val);
        },
        visitors,
        appointments,
        messages,
        knowledgeBase,
        settings,
        setSettings: (val) => {
          setSettings(val);
          if (typeof val === 'function') {
            const nextVal = val(settings);
            updateClient(activeClient.id, {
              industry: nextVal.industry,
              voiceConfig: {
                ...activeClient.voiceConfig,
                voiceURI: nextVal.voiceURI,
                voicePitch: nextVal.voicePitch,
                voiceRate: nextVal.voiceRate,
                customGreeting: nextVal.customGreeting,
                soundFxEnabled: nextVal.soundFxEnabled
              }
            });
          }
        },
        receptionistState,
        interimText,
        conversation,
        activeAction,
        selectedVisitorForPass,
        setSelectedVisitorForPass,
        availableVoices,
        selectedVoice,
        toggleListening,
        handleUserUtterance,
        playGreeting,
        addVisitor,
        checkOutVisitor,
        addAppointment,
        cancelAppointment,
        updateMessageStatus,
        updateStaffStatus,
        addKnowledgeItem,
        deleteKnowledgeItem,
        clearConversation
      }}
    >
      {children}
    </ReceptionistContext.Provider>
  );
};

export const useReceptionist = () => useContext(ReceptionistContext);
