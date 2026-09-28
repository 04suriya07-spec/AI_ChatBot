// Complete 20-Point Multi-Industry Mock Data and Configurations

export const initialClients = [
  {
    id: "client-apex-properties",
    name: "Apex Prime Real Estate & Infra",
    slug: "apex-properties",
    tagline: "Luxury Residential & Commercial Properties",
    industry: "corporate",
    plan: "Business",
    status: "Active",
    branding: {
      primaryColor: "#3b82f6",
      accentColor: "#06b6d4",
      logoIcon: "Building2",
      kioskTitle: "Apex Properties Voice Desk",
      welcomeMessage: "Welcome to Apex Prime Real Estate. How can I help you find your dream home or investment?"
    },
    voiceConfig: {
      aiName: "Maya",
      language: "en-IN", // English (India)
      voicePitch: 1.0,
      voiceRate: 1.02,
      voiceVolume: 1.0,
      customGreeting: "Hello! Welcome to Apex Prime Properties. I'm Maya, your AI real estate assistant. Are you looking to buy, rent, or schedule a site visit today?",
      systemPrompt: "You are Maya, an articulate, highly persuasive, and hospitable real estate AI agent for Apex Prime Properties. You qualify buyers by location, budget, and timeline, book site visits, and capture leads."
    },
    companyInfo: {
      name: "Apex Prime Real Estate & Infra",
      address: "Tower 4, OMR Express Highway, Chennai, Tamil Nadu 600096",
      phone: "+91 (44) 4900-8800",
      email: "sales@apexproperties.in",
      operatingHours: "Monday – Sunday: 9:00 AM – 8:00 PM",
      wifiName: "Apex-Guest-5G",
      wifiPass: "LuxuryLiving2026",
      parkingInfo: "Visitor parking available on Lower Ground 1.",
      emergencyContact: "Direct Sales Escalation: +91 98400 11223"
    },
    stats: {
      totalCalls: 1247,
      answeredCalls: 1232,
      missedCalls: 15,
      leadsCaptured: 312,
      hotLeadsCount: 89,
      appointmentsBooked: 87,
      transfersCount: 42,
      avgCallDuration: "2m 34s",
      estimatedPipelineValue: "₹4.8 Cr",
      resolutionRate: "94.2%",
      minutesUsed: 1240,
      minutesLimit: 1500
    },
    servicesAndPricing: [
      { name: "2BHK Luxury Apartments (OMR)", price: "₹65 Lakhs – ₹85 Lakhs", duration: "Site Visit 45 mins" },
      { name: "3BHK Sky Villas (ECR Waterfront)", price: "₹1.4 Cr – ₹2.2 Cr", duration: "VIP Tour 60 mins" },
      { name: "Commercial Office Spaces (Guindy)", price: "₹85/sq.ft lease", duration: "Consultation 30 mins" },
      { name: "Gated Community Villa Plots", price: "₹35 Lakhs – ₹60 Lakhs", duration: "Site Visit 45 mins" }
    ],
    staffDirectory: [
      {
        id: "staff-1",
        name: "Rahul Sharma",
        role: "Senior Sales Director",
        department: "Residential Sales",
        email: "rahul.s@apexproperties.in",
        phoneExt: "101",
        status: "Available",
        location: "Sales Suite 201",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
      },
      {
        id: "staff-2",
        name: "Priya Sundaram",
        role: "Lead Property Consultant",
        department: "Luxury Villas",
        email: "priya.s@apexproperties.in",
        phoneExt: "105",
        status: "In Meeting",
        location: "Experience Center",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
      }
    ],
    leads: [
      {
        id: "lead-101",
        name: "Rahul Kumar",
        phone: "+91 98401 23456",
        email: "rahul.kumar@gmail.com",
        requirement: "2BHK Luxury Apartment",
        budget: "₹70L – ₹80L",
        location: "OMR / Perungudi",
        moveInTimeline: "December 2026",
        status: "HOT", // HOT | WARM | COLD
        score: 95,
        source: "Inbound AI Call",
        createdAt: "Today, 10:15 AM",
        aiSummary: "Caller wants ready-to-move 2BHK near tech parks. Budget pre-approved for ₹75L. High intent, requested callback.",
        followUpDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        followUpTime: "10:00 AM",
        followUpStatus: "Scheduled",
        smsStatus: "Sent"
      },
      {
        id: "lead-102",
        name: "Ananya Deshmukh",
        phone: "+91 97890 88776",
        email: "ananya.d@outlook.com",
        requirement: "3BHK Sea-Facing Villa",
        budget: "₹1.8 Cr",
        location: "ECR Beach Road",
        moveInTimeline: "Q1 2027",
        status: "HOT",
        score: 92,
        source: "Inbound AI Call",
        createdAt: "Yesterday, 04:30 PM",
        aiSummary: "Looking for independent beachfront villa. Needs private pool and 2-car garage. Booked site visit.",
        followUpDate: new Date().toISOString().split('T')[0],
        followUpTime: "03:00 PM",
        followUpStatus: "Completed",
        smsStatus: "Sent"
      },
      {
        id: "lead-103",
        name: "Vikram Malhotra",
        phone: "+91 99620 44332",
        email: "vikram.m@techcorp.com",
        requirement: "Commercial Office Floor",
        budget: "₹3.5 Lakhs / month",
        location: "Guindy Tech Zone",
        moveInTimeline: "Immediate",
        status: "WARM",
        score: 78,
        source: "Website Voice Widget",
        createdAt: "Yesterday, 11:20 AM",
        aiSummary: "Expanding startup team of 40 developers. Comparing our Guindy park against Tidel.",
        followUpDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
        followUpTime: "11:30 AM",
        followUpStatus: "Pending",
        smsStatus: "Sent"
      }
    ],
    callLogs: [
      {
        id: "call-19382",
        callerName: "Rahul Kumar",
        callerNumber: "+91 98401 23456",
        timestamp: "Today, 10:15 AM",
        duration: "03:42",
        intent: "2BHK Purchase & Pricing",
        outcome: "HOT Lead Captured & Follow-Up Scheduled",
        sentiment: "Positive / High Interest",
        aiActions: [
          "Identified intent: 2BHK Apartment in OMR",
          "Qualified budget: ₹70L–₹80L",
          "Captured caller phone & email",
          "Scheduled Outbound Follow-Up for Tomorrow 10:00 AM",
          "Sent WhatsApp confirmation & brochure PDF"
        ],
        aiSummary: "Customer inquired about ready 2BHK units in OMR. Explained pricing starting at ₹65L. Customer confirmed budget is ₹75L with self-financing. Tagged as HOT Lead and scheduled callback with Rahul Sharma.",
        transcript: [
          { speaker: "Aura", text: "Welcome to Apex Prime Properties! I'm Maya. Are you looking to buy, rent, or schedule a property site visit today?" },
          { speaker: "Rahul", text: "Hi, I'm looking for a 2BHK apartment in the OMR area. What are the starting prices?" },
          { speaker: "Aura", text: "Our luxury 2BHK residences in OMR start at ₹65 Lakhs for 1,180 sq.ft, up to ₹85 Lakhs with clubhouse amenities. What is your approximate budget and move-in timeline?" },
          { speaker: "Rahul", text: "My budget is around 70 to 80 Lakhs, and I want to move in by this December." },
          { speaker: "Aura", text: "That fits our Tower 2 ready-to-move inventory perfectly! Can I get your full name and mobile number to arrange an exclusive site visit and send the floor plan brochure?" },
          { speaker: "Rahul", text: "Sure, I'm Rahul Kumar, phone number is 98401 23456." },
          { speaker: "Aura", text: "Thank you Rahul! I have created your VIP pass and our sales director will give you a call tomorrow at 10 AM. I've also sent the brochure directly to your WhatsApp." }
        ],
        recordingUrl: "simulated_audio_call_19382.mp3",
        recordingDurationSecs: 222
      },
      {
        id: "call-19381",
        callerName: "Dr. Arvind Swamy",
        callerNumber: "+91 94440 99881",
        timestamp: "Today, 09:30 AM",
        duration: "02:15",
        intent: "Site Visit Booking",
        outcome: "Site Visit Confirmed",
        sentiment: "Positive",
        aiActions: [
          "Checked calendar availability for ECR Villas",
          "Booked VIP Site Tour for Tomorrow at 2 PM",
          "Dispatched instant SMS confirmation"
        ],
        aiSummary: "Dr. Swamy booked an on-site visit for ECR Beach Villas. Assigned to Priya Sundaram.",
        transcript: [
          { speaker: "Aura", text: "Apex Prime Properties, Maya speaking! How may I assist your visit today?" },
          { speaker: "Caller", text: "I'd like to book a site visit for the ECR Beach Villas tomorrow afternoon." },
          { speaker: "Aura", text: "Certainly! We have 2:00 PM and 4:30 PM open for private villa tours. Which works better for you?" },
          { speaker: "Caller", text: "2 PM is great. My name is Dr. Arvind Swamy." },
          { speaker: "Aura", text: "Perfect Dr. Swamy! Your site tour is confirmed for tomorrow at 2 PM with Priya Sundaram. A gate access pass has been SMS'd to you." }
        ],
        recordingUrl: "simulated_audio_call_19381.mp3",
        recordingDurationSecs: 135
      },
      {
        id: "call-19380",
        callerName: "Karthik Raja",
        callerNumber: "+91 98840 55441",
        timestamp: "Yesterday, 05:40 PM",
        duration: "01:20",
        intent: "Angry Customer / Escalation",
        outcome: "Escalated & Transferred to Human",
        sentiment: "Frustrated / Escalated",
        aiActions: [
          "Detected customer frustration / legal query",
          "Executed safety guardrail: Human Handoff",
          "Live transferred call to Managing Director"
        ],
        aiSummary: "Caller had questions regarding title deed registration delays. AI detected frustration and escalated immediately to senior management.",
        transcript: [
          { speaker: "Aura", text: "Welcome to Apex Prime Properties! How may I help you?" },
          { speaker: "Caller", text: "I want to speak to a real person right now regarding registration paperwork, not an AI!" },
          { speaker: "Aura", text: "I completely understand. Connecting you directly with our senior operations lead right away. Please hold." }
        ],
        recordingUrl: "simulated_audio_call_19380.mp3",
        recordingDurationSecs: 80
      }
    ],
    appointments: [
      {
        id: "apt-101",
        guestName: "Dr. Arvind Swamy",
        guestEmail: "arvind.swamy@apollo.org",
        guestPhone: "+91 94440 99881",
        hostName: "Priya Sundaram",
        department: "Luxury Villas",
        purpose: "ECR Beach Villa Private Site Tour",
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        time: "02:00 PM",
        duration: "60 mins",
        status: "Confirmed",
        room: "ECR Site Experience Pavilion"
      },
      {
        id: "apt-102",
        guestName: "Kavitha Nambiar",
        guestEmail: "kavitha.n@wipro.com",
        guestPhone: "+91 98410 77221",
        hostName: "Rahul Sharma",
        department: "Residential Sales",
        purpose: "Agreement Signing & Unit Selection",
        date: new Date().toISOString().split('T')[0],
        time: "04:30 PM",
        duration: "45 mins",
        status: "Confirmed",
        room: "Executive Conference 2"
      }
    ],
    messages: [
      {
        id: "msg-101",
        callerName: "HDFC Home Loans Manager",
        callerCompany: "HDFC Bank",
        callerContact: "+91 98400 33221",
        recipientName: "Rahul Sharma",
        urgency: "High",
        content: "Approved loan sanction letters ready for 4 tower buyers. Call back to release documentation.",
        timestamp: "10:30 AM",
        status: "Pending"
      }
    ],
    knowledgeBase: [
      {
        id: "kb-1",
        question: "What projects and apartments do you have available?",
        answer: "We have 2BHK luxury apartments in OMR starting at ₹65L, 3BHK sea-facing villas on ECR from ₹1.4 Cr, and commercial tech spaces in Guindy.",
        category: "Projects"
      },
      {
        id: "kb-2",
        question: "Do you offer bank loan assistance?",
        answer: "Yes, our projects are pre-approved by SBI, HDFC, ICICI, and Axis Bank with zero processing fee deals.",
        category: "Finance"
      },
      {
        id: "kb-3",
        question: "Where is your sales office and what are the hours?",
        answer: "We are at Tower 4, OMR Express Highway, Chennai, open 7 days a week from 9:00 AM to 8:00 PM.",
        category: "General"
      }
    ],
    workflows: [
      {
        id: "wf-1",
        trigger: "Customer asks about pricing / budget",
        actions: ["Explain pricing range", "Ask preferred BHK and budget", "Qualify buyer timeline", "Offer site visit booking"]
      },
      {
        id: "wf-2",
        trigger: "Customer says 'I want to book an appointment' or 'site visit'",
        actions: ["Check slot availability", "Offer 2 available time slots", "Capture name & mobile", "Send WhatsApp confirmation"]
      },
      {
        id: "wf-3",
        trigger: "Customer angry / asks for human / legal issue",
        actions: ["Express empathy", "Initiate Human Handoff", "Transfer to Senior Director (+91 98400 11223)"]
      }
    ],
    integrations: {
      googleCalendar: { enabled: true, connectedAccount: "sales@apexproperties.in", status: "Synced" },
      googleSheets: { enabled: true, sheetName: "Apex_Live_Leads_2026", status: "Live Sync Active" },
      whatsAppBusiness: { enabled: true, senderNumber: "+91 44 4900 8800", status: "Active (Meta Cloud API)" },
      crmWebhook: { enabled: true, targetUrl: "https://api.hubspot.com/v3/leads/webhook", status: "Active" }
    },
    guardrails: {
      strictKnowledgeOnly: true,
      prohibitMedicalDiagnosis: true,
      prohibitFinancialAdvice: true,
      mandatoryAiDisclosure: true,
      profanityFilter: true,
      maxTurnLimit: 15,
      emergencyKeywords: ["fire", "flood", "emergency", "police", "legal action", "ambulance", "pipe burst"]
    }
  },
  {
    id: "client-sterling-dental",
    name: "Dr. Sterling Dental & Implant Clinic",
    slug: "sterling-dental",
    tagline: "Pain-Free Laser Dentistry & Orthodontics",
    industry: "medical",
    plan: "Pro",
    status: "Active",
    branding: {
      primaryColor: "#059669",
      accentColor: "#14b8a6",
      logoIcon: "Stethoscope",
      kioskTitle: "Sterling Dental Clinic Voice AI",
      welcomeMessage: "Welcome to Sterling Dental. How may I assist your dental appointment or query today?"
    },
    voiceConfig: {
      aiName: "Maya",
      language: "en-US",
      voicePitch: 1.05,
      voiceRate: 0.98,
      voiceVolume: 1.0,
      customGreeting: "Welcome to Dr. Sterling Dental & Implant Clinic. I'm Maya. Are you experiencing pain, checking in for today's appointment, or scheduling a consultation?",
      systemPrompt: "You are Maya, an empathetic, caring, and strict medical boundary AI receptionist at Dr. Sterling Dental. You book dentist slots, triage emergencies, explain service prices, and NEVER diagnose medical conditions."
    },
    companyInfo: {
      name: "Dr. Sterling Dental & Implant Clinic",
      address: "450 Sutter Health Center, Suite 320, San Francisco, CA 94108",
      phone: "+1 (415) 555-8822",
      email: "care@sterlingdental.com",
      operatingHours: "Mon–Thu: 7:30 AM – 5:30 PM | Fri: 8:00 AM – 3:00 PM",
      wifiName: "Sterling-Patient-5G",
      wifiPass: "HealthySmiles2026",
      parkingInfo: "Sutter Garage adjacent. 90-minute validation.",
      emergencyContact: "Emergency Dental Line: (415) 555-9111"
    },
    stats: {
      totalCalls: 980,
      answeredCalls: 974,
      missedCalls: 6,
      leadsCaptured: 198,
      hotLeadsCount: 64,
      appointmentsBooked: 142,
      transfersCount: 28,
      avgCallDuration: "2m 12s",
      estimatedPipelineValue: "$186,000",
      resolutionRate: "96.8%",
      minutesUsed: 890,
      minutesLimit: 1500
    },
    servicesAndPricing: [
      { name: "Teeth Cleaning & Polish", price: "$120 (₹1,000 in India)", duration: "45 mins" },
      { name: "Comprehensive Dental Consultation", price: "$85 (₹500 in India)", duration: "30 mins" },
      { name: "Single Root Canal Treatment", price: "$750 – $1,100 (₹5,000 – ₹8,000)", duration: "60 mins" },
      { name: "Invisalign & Clear Aligners", price: "$3,200 – $4,800", duration: "Consult 45 mins" },
      { name: "Laser Teeth Whitening", price: "$350", duration: "45 mins" }
    ],
    staffDirectory: [
      {
        id: "staff-d1",
        name: "Dr. Richard Sterling, DDS",
        role: "Lead Cosmetic & Implant Surgeon",
        department: "Implantology",
        email: "dr.sterling@sterlingdental.com",
        phoneExt: "101",
        status: "Available",
        location: "Operatory 1",
        avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80"
      },
      {
        id: "staff-d2",
        name: "Dr. Jessica Chen, DDS",
        role: "Orthodontist & Clear Aligner Specialist",
        department: "Orthodontics",
        email: "dr.chen@sterlingdental.com",
        phoneExt: "102",
        status: "Available",
        location: "Operatory 3",
        avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80"
      }
    ],
    leads: [
      {
        id: "lead-d1",
        name: "Samantha Reed",
        phone: "+1 (415) 889-1234",
        email: "samantha.r@gmail.com",
        requirement: "Invisalign Clear Aligners",
        budget: "$3,500",
        location: "Downtown SF",
        moveInTimeline: "This Month",
        status: "HOT",
        score: 94,
        source: "Inbound AI Call",
        createdAt: "Today, 11:00 AM",
        aiSummary: "Inquired about Invisalign consultation. Insurance pre-checked. Booked free 3D digital scan for Friday.",
        followUpDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        followUpTime: "11:00 AM",
        followUpStatus: "Scheduled",
        smsStatus: "Sent"
      }
    ],
    callLogs: [
      {
        id: "call-18920",
        callerName: "David Miller",
        callerNumber: "+1 (415) 304-8899",
        timestamp: "Today, 11:40 AM",
        duration: "02:45",
        intent: "Emergency Tooth Pain / Root Canal",
        outcome: "🚨 Emergency Triage & Same-Day Slot Booked",
        sentiment: "Urgent",
        aiActions: [
          "Detected severe toothache / emergency keyword",
          "Provided emergency clinic instructions (No medical diagnosis)",
          "Booked immediate 2:00 PM Emergency Slot with Dr. Sterling",
          "Sent instant SMS with clinic address & parking guidance"
        ],
        aiSummary: "Patient experiencing acute molar throbbing pain. AI triaged as emergency and scheduled immediate same-day slot at 2:00 PM.",
        transcript: [
          { speaker: "Aura", text: "Dr. Sterling Dental Clinic, Maya speaking. Are you calling for an appointment or an emergency?" },
          { speaker: "David", text: "I have severe pain in my lower molar that started last night and I can barely chew." },
          { speaker: "Aura", text: "I'm so sorry you're in pain David. We have an emergency relief slot with Dr. Sterling today at 2:00 PM. Would you like me to book that immediately?" },
          { speaker: "David", text: "Yes please, 2 PM works. My name is David Miller." },
          { speaker: "Aura", text: "You are all set for 2:00 PM at 450 Sutter St, Suite 320. A confirmation and directions have been sent to your phone." }
        ],
        recordingUrl: "simulated_audio_call_18920.mp3",
        recordingDurationSecs: 165
      }
    ],
    appointments: [
      {
        id: "apt-d101",
        guestName: "David Miller",
        guestEmail: "david.m@gmail.com",
        guestPhone: "+1 (415) 304-8899",
        hostName: "Dr. Richard Sterling, DDS",
        department: "Implantology",
        purpose: "Emergency Tooth Relief & X-Ray",
        date: new Date().toISOString().split('T')[0],
        time: "02:00 PM",
        duration: "45 mins",
        status: "Confirmed",
        room: "Operatory 1"
      }
    ],
    messages: [],
    knowledgeBase: [
      {
        id: "kb-d1",
        question: "How much does a root canal cost?",
        answer: "A single root canal treatment ranges from $750 to $1,100 (₹5,000 to ₹8,000 in India) depending on the molar location and whether a crown is required.",
        category: "Pricing"
      },
      {
        id: "kb-d2",
        question: "Do you accept insurance and dental plans?",
        answer: "Yes, we accept Delta Dental, MetLife, Cigna, Aetna, and offer 0% interest CareCredit payment plans.",
        category: "Insurance"
      }
    ],
    workflows: [
      {
        id: "wf-d1",
        trigger: "Caller mentions 'severe pain', 'bleeding', 'accident'",
        actions: ["Detect Emergency", "Offer immediate same-day slot", "Give safe clinic guidance", "Alert duty dentist"]
      }
    ],
    integrations: {
      googleCalendar: { enabled: true, connectedAccount: "clinic@sterlingdental.com", status: "Synced" },
      googleSheets: { enabled: true, sheetName: "Dental_Appointments_Live", status: "Active" },
      whatsAppBusiness: { enabled: true, senderNumber: "+1 415 555 8822", status: "Active" }
    },
    guardrails: {
      strictKnowledgeOnly: true,
      prohibitMedicalDiagnosis: true,
      prohibitFinancialAdvice: false,
      mandatoryAiDisclosure: true,
      profanityFilter: true,
      maxTurnLimit: 15,
      emergencyKeywords: ["severe pain", "bleeding", "swelling", "broken tooth", "fever", "trauma"]
    }
  }
];
