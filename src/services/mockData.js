export const initialCompanyInfo = {
  name: "Apex Global Technologies",
  industry: "corporate", // 'corporate' | 'medical' | 'hospitality' | 'salon'
  tagline: "Front Desk & Visitor Concierge",
  address: "Tower 4, Suite 800, Silicon Avenue, San Francisco, CA 94107",
  phone: "+1 (800) 555-0199",
  email: "frontdesk@apextech.com",
  operatingHours: "Monday – Friday: 8:00 AM – 6:00 PM | Saturday: 9:00 AM – 2:00 PM",
  wifiName: "Apex-Guest-HighSpeed",
  wifiPass: "WelcomeApex2026!",
  parkingInfo: "Visitor parking is complimentary on Basement Level B2 (Spots 1-25). Validate your pass at the digital kiosk.",
  emergencyContact: "Building Security: Ext. 9911 or Security Desk Lobby",
};

export const initialStaffDirectory = [
  {
    id: "staff-1",
    name: "Sarah Connor",
    role: "VP of Engineering",
    department: "Engineering",
    email: "sarah.connor@apextech.com",
    phoneExt: "1042",
    status: "Available", // Available | In Meeting | Out of Office
    location: "4th Floor - Room 402",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "staff-2",
    name: "David Miller",
    role: "Head of Product & Innovation",
    department: "Product",
    email: "david.miller@apextech.com",
    phoneExt: "1088",
    status: "In Meeting",
    location: "4th Floor - Innovation Lab",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "staff-3",
    name: "Elena Rostova",
    role: "Director of People & Talent (HR)",
    department: "Human Resources",
    email: "elena.rostova@apextech.com",
    phoneExt: "1015",
    status: "Available",
    location: "3rd Floor - HR Suite",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "staff-4",
    name: "Marcus Vance",
    role: "Chief Executive Officer",
    department: "Executive",
    email: "marcus.vance@apextech.com",
    phoneExt: "1001",
    status: "Available",
    location: "8th Floor - Executive Wing",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "staff-5",
    name: "Dr. Jessica Chen",
    role: "Chief Medical Officer / Lead Specialist",
    department: "Clinical",
    email: "dr.chen@apexclinic.com",
    phoneExt: "2010",
    status: "Available",
    location: "2nd Floor - Suite 201",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "staff-6",
    name: "Alex Thorne",
    role: "Senior Account Executive",
    department: "Sales & Partnerships",
    email: "alex.thorne@apextech.com",
    phoneExt: "1055",
    status: "Out of Office",
    location: "Remote / Field",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  }
];

export const initialVisitors = [
  {
    id: "vis-101",
    name: "Arthur Pendelton",
    company: "Vanguard Capital",
    hostName: "Marcus Vance",
    hostDepartment: "Executive",
    purpose: "Quarterly Board & Investment Review",
    checkInTime: new Date(Date.now() - 45 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: "Checked In", // Checked In | Checked Out
    badgeNumber: "PASS-9401",
    qrCodeVal: "APEX-VIS-9401-ARTHUR",
    ndaSigned: true
  },
  {
    id: "vis-102",
    name: "Claire Dupont",
    company: "CloudScale Systems",
    hostName: "Sarah Connor",
    hostDepartment: "Engineering",
    purpose: "Infrastructure API Partnership Discussion",
    checkInTime: new Date(Date.now() - 90 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: "Checked In",
    badgeNumber: "PASS-9402",
    qrCodeVal: "APEX-VIS-9402-CLAIRE",
    ndaSigned: true
  },
  {
    id: "vis-103",
    name: "Michael Chang",
    company: "Apex Candidate",
    hostName: "Elena Rostova",
    hostDepartment: "Human Resources",
    purpose: "Senior Lead Architect Onsite Interview",
    checkInTime: new Date(Date.now() - 180 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    checkOutTime: new Date(Date.now() - 30 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: "Checked Out",
    badgeNumber: "PASS-9398",
    qrCodeVal: "APEX-VIS-9398-MICHAEL",
    ndaSigned: true
  }
];

export const initialAppointments = [
  {
    id: "apt-201",
    guestName: "Samantha Brooks",
    guestEmail: "samantha.brooks@horizon.io",
    guestPhone: "+1 (555) 234-5678",
    hostName: "David Miller",
    department: "Product",
    purpose: "Product Demo & Integration Roadmap",
    date: new Date().toISOString().split('T')[0], // Today
    time: "02:00 PM",
    duration: "45 mins",
    status: "Confirmed", // Confirmed | Completed | Cancelled
    room: "Conference Room Alpha (4th Floor)"
  },
  {
    id: "apt-202",
    guestName: "Robert Hayes",
    guestEmail: "robert.hayes@quantum.tech",
    guestPhone: "+1 (555) 876-5432",
    hostName: "Sarah Connor",
    department: "Engineering",
    purpose: "Security Architecture Review",
    date: new Date().toISOString().split('T')[0], // Today
    time: "04:30 PM",
    duration: "60 mins",
    status: "Confirmed",
    room: "Engineering Lab 2"
  },
  {
    id: "apt-203",
    guestName: "Olivia Martinez",
    guestEmail: "olivia.m@healthcore.org",
    guestPhone: "+1 (555) 998-1122",
    hostName: "Dr. Jessica Chen",
    department: "Clinical",
    purpose: "Annual Wellness Consultation",
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    time: "10:00 AM",
    duration: "30 mins",
    status: "Confirmed",
    room: "Clinic Room 204"
  }
];

export const initialMessages = [
  {
    id: "msg-301",
    callerName: "Thomas Wright",
    callerCompany: "Oracle Systems",
    callerContact: "thomas.w@oracle.com | 555-432-1098",
    recipientName: "Marcus Vance",
    urgency: "High", // High | Normal | Low
    content: "Urgent contract revision regarding Q4 enterprise licensing terms. Needs callback before 5 PM today.",
    timestamp: "10:15 AM",
    status: "Pending", // Pending | Resolved
    isVoiceNote: true
  },
  {
    id: "msg-302",
    callerName: "FedEx Express Dispatch",
    callerCompany: "FedEx",
    callerContact: "Tracking #FX-8892110",
    recipientName: "Elena Rostova",
    urgency: "Normal",
    content: "Confidential HR audit documents delivered to the front mail intake drop box.",
    timestamp: "09:30 AM",
    status: "Resolved",
    isVoiceNote: false
  }
];

export const initialKnowledgeBase = [
  {
    id: "kb-1",
    question: "What are your business operating hours?",
    answer: "We are open Monday through Friday from 8:00 AM to 6:00 PM, and Saturdays from 9:00 AM to 2:00 PM. We are closed on Sundays and major public holidays.",
    category: "General"
  },
  {
    id: "kb-2",
    question: "What is the guest Wi-Fi network and password?",
    answer: "You can connect to 'Apex-Guest-HighSpeed'. The password is 'WelcomeApex2026!'. No registration is required.",
    category: "Amenities"
  },
  {
    id: "kb-3",
    question: "Where can visitors park?",
    answer: "Visitor parking is complimentary on Basement Level B2 (Spots 1 through 25). Please enter via Gate 2 on 4th Street. You can validate your parking ticket right here at the kiosk.",
    category: "Facilities"
  },
  {
    id: "kb-4",
    question: "Where are the restrooms and cafeterias located?",
    answer: "Restrooms are located next to the elevator banks on every floor. The main coffee lounge and cafeteria are located on the 3rd floor terrace.",
    category: "Facilities"
  },
  {
    id: "kb-5",
    question: "How do I check in for a meeting or interview?",
    answer: "Simply tell me your name, your company, and who you are meeting with. I will register your visitor pass, notify your host immediately, and print your digital badge.",
    category: "Check-in"
  },
  {
    id: "kb-6",
    question: "Can you book or reschedule an appointment for me?",
    answer: "Yes, I can schedule, check available time slots, or reschedule appointments with any staff member or department. Just let me know who you want to see and your preferred date and time.",
    category: "Appointments"
  },
  {
    id: "kb-7",
    question: "What should I do if my host is not available?",
    answer: "I can take a detailed message, mark the urgency level, and send an instant notification to their mobile device and email so they can reach back out to you promptly.",
    category: "Routing"
  },
  {
    id: "kb-8",
    question: "What are the nearest coffee shops or lunch spots?",
    answer: "Blue Bottle Coffee is located just outside the main lobby on the right. For lunch, The Grove and Sweetgreen are across the street on 4th and Mission.",
    category: "Concierge"
  }
];

export const industryTemplates = {
  corporate: {
    name: "Corporate Front Desk",
    greeting: "Welcome to Apex Global Technologies! I'm Aura, your autonomous front-desk receptionist. Are you here to check in for a meeting, book an appointment, or speak with someone?",
    personaPrompt: "You are Aura, an ultra-professional, welcoming, and sharp corporate receptionist for Apex Global Technologies. You handle visitor check-ins, employee meetings, message taking, and general office questions with courteous efficiency.",
    voicePitch: 1.0,
    voiceRate: 1.05
  },
  medical: {
    name: "Medical Clinic & Health Center",
    greeting: "Welcome to Apex Health & Wellness Center. I'm Aura, your clinic receptionist. Are you checking in for a doctor's appointment, scheduling a consultation, or inquiring about our services?",
    personaPrompt: "You are Aura, an empathetic, caring, and efficient medical receptionist at Apex Health Center. You assist patients with check-in, triage inquiries, doctor scheduling, and general clinic guidance while maintaining privacy and compassion.",
    voicePitch: 1.05,
    voiceRate: 0.98
  },
  hospitality: {
    name: "Hotel & Luxury Concierge",
    greeting: "Welcome to The Grand Apex Resort & Suites! I'm Aura, your virtual concierge. How may I assist you with check-in, room reservations, amenities, or local recommendations today?",
    personaPrompt: "You are Aura, a refined, hospitable, and knowledgeable luxury hotel concierge. You assist guests with check-in, room services, spa reservations, and city recommendations with supreme warmth.",
    voicePitch: 1.0,
    voiceRate: 1.0
  },
  salon: {
    name: "Salon & Wellness Spa",
    greeting: "Hello and welcome to Glow & Serenity Spa! I'm Aura. Are you here for your appointment today, or would you like to book a styling or massage session?",
    personaPrompt: "You are Aura, an upbeat, friendly, and polished receptionist at Glow & Serenity Spa. You help clients check in for stylists, book beauty and massage appointments, and answer service pricing questions.",
    voicePitch: 1.1,
    voiceRate: 1.05
  }
};
