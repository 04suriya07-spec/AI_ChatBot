import React, { useState } from 'react';
import { 
  Building2, 
  Stethoscope, 
  Scale, 
  Hotel, 
  Scissors, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Sparkles, 
  Volume2, 
  Users, 
  BookOpen, 
  Palette,
  Bot
} from 'lucide-react';
import { useClient } from '../../context/ClientContext';
import { speechService } from '../../services/speechService';

export const NewClientWizard = ({ isOpen, onClose, onClientCreated }) => {
  const { createClient } = useClient();

  const [currentStep, setCurrentStep] = useState(1);

  // Wizard Form State
  const [industry, setIndustry] = useState('corporate');
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [operatingHours, setOperatingHours] = useState('Monday – Friday: 8:00 AM – 6:00 PM');
  
  // AI Persona & Voice
  const [aiName, setAiName] = useState('Aura');
  const [customGreeting, setCustomGreeting] = useState('');
  const [voicePitch, setVoicePitch] = useState(1.0);
  const [voiceRate, setVoiceRate] = useState(1.0);

  // Branding
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [accentColor, setAccentColor] = useState('#06b6d4');
  const [kioskTitle, setKioskTitle] = useState('');

  // Initial staff member
  const [leadStaffName, setLeadStaffName] = useState('');
  const [leadStaffRole, setLeadStaffRole] = useState('');
  const [leadStaffDept, setLeadStaffDept] = useState('');

  // Initial FAQ
  const [wifiName, setWifiName] = useState('');
  const [wifiPass, setWifiPass] = useState('');
  const [parkingInfo, setParkingInfo] = useState('');

  if (!isOpen) return null;

  const industryPresets = [
    {
      id: 'corporate',
      title: 'Corporate & Tech HQ',
      icon: Building2,
      color: '#3b82f6',
      defaultTagline: 'Corporate Front Desk & Innovation Office',
      defaultGreeting: "Welcome to our corporate headquarters. I'm Aura, your AI front desk receptionist. Are you here to check in for a meeting or speak with someone?",
      defaultRole: 'VP of Operations',
      defaultDept: 'Executive'
    },
    {
      id: 'medical',
      title: 'Medical / Dental Clinic',
      icon: Stethoscope,
      color: '#059669',
      defaultTagline: 'Patient Care & Dental Health Center',
      defaultGreeting: "Welcome to our clinic. I'm Aura, your reception assistant. Are you here for today's appointment or would you like to schedule a consultation?",
      defaultRole: 'Lead Physician / Dentist',
      defaultDept: 'Clinical'
    },
    {
      id: 'hospitality',
      title: 'Hotel & Luxury Resort',
      icon: Hotel,
      color: '#0284c7',
      defaultTagline: '5-Star Hospitality & Concierge Desk',
      defaultGreeting: "Welcome! I'm Aura, your virtual concierge. How may I assist you with check-in, amenities, or recommendations today?",
      defaultRole: 'Front Office Manager',
      defaultDept: 'Guest Services'
    },
    {
      id: 'salon',
      title: 'Salon, Spa & Beauty',
      icon: Scissors,
      color: '#db2777',
      defaultTagline: 'Beauty, Hair & Wellness Lounge',
      defaultGreeting: "Hello and welcome to our spa! I'm Aura. Are you here for your beauty session today, or would you like to book a stylist?",
      defaultRole: 'Master Stylist / Esthetician',
      defaultDept: 'Styling'
    }
  ];

  const handleSelectIndustry = (preset) => {
    setIndustry(preset.id);
    setPrimaryColor(preset.color);
    setTagline(preset.defaultTagline);
    setCustomGreeting(preset.defaultGreeting);
    setLeadStaffRole(preset.defaultRole);
    setLeadStaffDept(preset.defaultDept);
  };

  const handleTestVoice = () => {
    speechService.speak(customGreeting || `Hello, welcome to ${name || 'our organization'}.`, {
      pitch: voicePitch,
      rate: voiceRate
    });
  };

  const handleComplete = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newClient = createClient({
      name: name.trim(),
      tagline: tagline.trim() || `${name} Front Desk`,
      industry: industry,
      plan: 'Professional',
      branding: {
        primaryColor: primaryColor,
        accentColor: accentColor,
        logoIcon: industry === 'medical' ? 'Stethoscope' : industry === 'hospitality' ? 'Hotel' : industry === 'salon' ? 'Scissors' : 'Building2',
        kioskTitle: kioskTitle.trim() || `${name} Front Desk Kiosk`,
        welcomeMessage: customGreeting.trim()
      },
      voiceConfig: {
        aiName: aiName.trim() || 'Aura',
        voicePitch: voicePitch,
        voiceRate: voiceRate,
        customGreeting: customGreeting.trim() || `Welcome to ${name}! I'm Aura, your AI receptionist.`,
        systemPrompt: `You are Aura, an AI receptionist for ${name}. You handle guest check-ins, bookings, and questions.`
      },
      companyInfo: {
        name: name.trim(),
        address: address.trim() || '100 Business Parkway, Suite 100',
        phone: phone.trim() || '+1 (800) 555-0100',
        email: email.trim() || `frontdesk@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        operatingHours: operatingHours.trim(),
        wifiName: wifiName.trim() || `${name.replace(/\s+/g, '')}-Guest`,
        wifiPass: wifiPass.trim() || 'Welcome2026!',
        parkingInfo: parkingInfo.trim() || 'Complimentary visitor parking available on-site.',
        emergencyContact: 'Security Desk: Dial 0'
      },
      staffDirectory: leadStaffName.trim() ? [
        {
          id: `staff-${Date.now()}`,
          name: leadStaffName.trim(),
          role: leadStaffRole.trim() || 'Director',
          department: leadStaffDept.trim() || 'General',
          email: `${leadStaffName.toLowerCase().replace(/\s+/g, '.')}@business.com`,
          phoneExt: '101',
          status: 'Available',
          location: 'Office Suite 101',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
        }
      ] : [],
      visitors: [],
      appointments: [],
      messages: [],
      knowledgeBase: [
        {
          id: `kb-init-1`,
          question: "What are your business operating hours?",
          answer: `Our operating hours are: ${operatingHours}.`,
          category: "General"
        },
        {
          id: `kb-init-2`,
          question: "What is the guest Wi-Fi password?",
          answer: `Connect to '${wifiName || name + '-Guest'}' using password '${wifiPass || 'Welcome2026!'}'.`,
          category: "Amenities"
        }
      ]
    });

    if (onClientCreated) onClientCreated(newClient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Wizard Header */}
        <div className="p-6 bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm shadow-md">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display leading-tight">Onboard New Client Organization</h2>
              <p className="text-xs text-white/80">Step {currentStep} of 4 &bull; Tailored AI Receptionist Setup</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Step Progress Pills */}
        <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-950/80 shrink-0 text-xs">
          {[
            { step: 1, label: '1. Industry & Profile' },
            { step: 2, label: '2. Voice & Greeting' },
            { step: 3, label: '3. Team & FAQs' },
            { step: 4, label: '4. Branding & Launch' }
          ].map((s) => (
            <div
              key={s.step}
              className={`py-3 text-center font-semibold transition-colors ${
                currentStep === s.step
                  ? 'text-brand-400 border-b-2 border-brand-500 bg-slate-900/40'
                  : currentStep > s.step
                  ? 'text-emerald-400'
                  : 'text-slate-500'
              }`}
            >
              {s.label}
            </div>
          ))}
        </div>

        {/* Wizard Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          
          {/* STEP 1: INDUSTRY & BUSINESS DETAILS */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-slate-300 font-bold mb-2">Select Industry Preset Template</label>
                <div className="grid grid-cols-2 gap-3">
                  {industryPresets.map((preset) => {
                    const Icon = preset.icon;
                    const isSelected = industry === preset.id;
                    return (
                      <div
                        key={preset.id}
                        onClick={() => handleSelectIndustry(preset)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-brand-950/70 border-brand-500 shadow-lg shadow-brand-500/10'
                            : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div 
                            className="p-2 rounded-xl text-white"
                            style={{ backgroundColor: preset.color }}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-100">{preset.title}</h4>
                            <span className="text-[10px] text-slate-400">Pre-configured persona</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="col-span-full">
                  <label className="block text-slate-400 mb-1 font-medium">Client Organization / Business Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sterling Dental Care / Vanguard Tech"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Tagline / Subtitle</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. Laser Dentistry & Patient Care"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Operating Hours</label>
                  <input
                    type="text"
                    value={operatingHours}
                    onChange={(e) => setOperatingHours(e.target.value)}
                    placeholder="Mon–Fri: 8:00 AM – 6:00 PM"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs"
                  />
                </div>

                <div className="col-span-full">
                  <label className="block text-slate-400 mb-1">Office Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 450 Sutter St, Suite 300, San Francisco, CA"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: AI VOICE & SPOKEN GREETING */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-200">AI Voice Assistant Tuning</h3>
                  <p className="text-slate-400 text-[11px]">Configure how the AI receptionist introduces itself to incoming visitors.</p>
                </div>
                <button
                  type="button"
                  onClick={handleTestVoice}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  Test Voice
                </button>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">AI Receptionist Name</label>
                <input
                  type="text"
                  value={aiName}
                  onChange={(e) => setAiName(e.target.value)}
                  placeholder="e.g. Aura / Maya / Jarvis"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Custom Spoken Greeting</label>
                <textarea
                  rows={3}
                  value={customGreeting}
                  onChange={(e) => setCustomGreeting(e.target.value)}
                  placeholder="The spoken greeting when visitors approach the kiosk..."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Voice Pitch</span>
                    <span className="font-mono text-cyan-400">{voicePitch}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.6"
                    max="1.4"
                    step="0.05"
                    value={voicePitch}
                    onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Speaking Speed</span>
                    <span className="font-mono text-brand-400">{voiceRate}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.7"
                    max="1.3"
                    step="0.05"
                    value={voiceRate}
                    onChange={(e) => setVoiceRate(parseFloat(e.target.value))}
                    className="w-full accent-brand-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: INITIAL STAFF & FAQS */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h4 className="font-bold text-slate-200 flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-400" />
                  Primary Host / Staff Member
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={leadStaffName}
                    onChange={(e) => setLeadStaffName(e.target.value)}
                    placeholder="Staff Full Name (e.g. Dr. Sterling)"
                    className="col-span-1 p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100"
                  />
                  <input
                    type="text"
                    value={leadStaffRole}
                    onChange={(e) => setLeadStaffRole(e.target.value)}
                    placeholder="Role / Title"
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100"
                  />
                  <input
                    type="text"
                    value={leadStaffDept}
                    onChange={(e) => setLeadStaffDept(e.target.value)}
                    placeholder="Department"
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h4 className="font-bold text-slate-200 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  Guest Amenities & Wi-Fi Credentials
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={wifiName}
                    onChange={(e) => setWifiName(e.target.value)}
                    placeholder="Wi-Fi SSID Name"
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100"
                  />
                  <input
                    type="text"
                    value={wifiPass}
                    onChange={(e) => setWifiPass(e.target.value)}
                    placeholder="Wi-Fi Password"
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100"
                  />
                  <input
                    type="text"
                    value={parkingInfo}
                    onChange={(e) => setParkingInfo(e.target.value)}
                    placeholder="Parking Instructions (e.g. Garage Level B1)"
                    className="col-span-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: BRANDING & REVIEW */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="font-bold text-slate-200 flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-400" />
                White-Label Branding & Theme
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Primary Theme Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-10 h-10 rounded-xl cursor-pointer bg-slate-950 border border-slate-700 p-1"
                    />
                    <span className="font-mono text-slate-300">{primaryColor}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Accent Glow Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-10 h-10 rounded-xl cursor-pointer bg-slate-950 border border-slate-700 p-1"
                    />
                    <span className="font-mono text-slate-300">{accentColor}</span>
                  </div>
                </div>
              </div>

              {/* Ready Preview Summary Card */}
              <div 
                className="p-5 rounded-2xl border text-white space-y-2 mt-4"
                style={{ backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}50` }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">Ready to Deploy</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 capitalize">{industry}</span>
                </div>
                <h4 className="text-lg font-bold font-display">{name || 'Client Organization'}</h4>
                <p className="text-xs opacity-80 italic">"{customGreeting}"</p>
              </div>
            </div>
          )}

        </div>

        {/* Wizard Footer Controls */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white flex items-center gap-1 font-semibold"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          ) : <div></div>}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={() => {
                if (currentStep === 1 && !name.trim()) {
                  alert("Please enter the client organization name.");
                  return;
                }
                setCurrentStep(prev => prev + 1);
              }}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-brand-500/20"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleComplete}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <Check className="w-4 h-4" />
              Create & Launch Client Receptionist
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
