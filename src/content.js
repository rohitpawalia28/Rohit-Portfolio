/* All of the portfolio's words and links live here, shared by every section. */

export const resumeUrl = 'https://drive.google.com/file/d/1oLf2Ux5VZTBY8UTp43bLaod9pkY9X6Sh/view?usp=drive_link';
export const linkedinUrl = 'https://www.linkedin.com/in/rohit-kumar-6a7b4134b/';
export const githubUrl = 'https://github.com/rohitpawalia28';
export const email = 'merohitk281205@gmail.com';
export const phone = '+91 8433787405';

export const projects = [
  {
    id: 'ace',
    name: 'ACE Academy',
    short: 'ACE Academy',
    type: 'Institute management system',
    year: '2026',
    role: 'Paid client build',
    description: 'A role-based platform for admins, teachers, and students. It handles attendance, timetables, marks, study materials, and progress tracking, with live updates over Socket.IO.',
    stack: ['React', 'Node.js', 'MongoDB', 'Socket.IO'],
    flow: [
      { stage: 'People', items: ['Admins', 'Teachers', 'Students'] },
      { stage: 'Interface', items: ['React app, one view per role'] },
      { stage: 'Server', items: ['Node API', 'Socket.IO live updates'] },
      { stage: 'Data', items: ['MongoDB'] },
    ],
    links: [{ label: 'Visit live site', href: 'https://achieverscentreofeducation.vercel.app/' }, { label: 'Read the code', href: 'https://github.com/rohitpawalia28/ACE-Academy' }],
  },
  {
    id: 'salon',
    name: 'Platinum Unisex Salon',
    short: 'Platinum Salon',
    type: 'Client management website',
    year: '2026',
    role: 'Paid client build',
    description: 'A production site for a working salon: appointment booking, customer enquiries, service information, and an admin dashboard the owner uses to run the day.',
    stack: ['JavaScript', 'MongoDB', 'CSS', 'JSON'],
    flow: [
      { stage: 'People', items: ['Customers', 'Salon owner'] },
      { stage: 'Interface', items: ['Booking site', 'Admin dashboard'] },
      { stage: 'Server', items: ['Bookings and enquiries API'] },
      { stage: 'Data', items: ['MongoDB'] },
    ],
    links: [{ label: 'Visit live site', href: 'https://platinumunisexsalon.vercel.app/' }, { label: 'Read the code', href: 'https://github.com/platinumunisexsalon/Platinum-Unisex-Salon' }],
  },
  {
    id: 'taxi',
    name: 'Taxi Route Anomaly Detection',
    short: 'Taxi anomalies',
    type: 'Data engineering and ML',
    year: '2025',
    role: 'Academic project',
    description: 'Route-level fare anomaly analysis across 32 GB of NYC taxi trips, processed with Spark and surfaced through a Flask dashboard.',
    stack: ['PySpark', 'Pandas', 'Flask', 'Scikit-learn'],
    flow: [
      { stage: 'Input', items: ['32 GB of NYC taxi trips'] },
      { stage: 'Processing', items: ['PySpark jobs per route'] },
      { stage: 'Model', items: ['Fare anomaly scoring'] },
      { stage: 'Output', items: ['Flask dashboard'] },
    ],
    links: [{ label: 'Read the code', href: 'https://github.com/rohitpawalia28/taxi-route-anomaly-detection' }],
  },
  {
    id: 'ids',
    name: 'Sentinel Entropy IDS',
    short: 'Sentinel IDS',
    type: 'Network security',
    year: '2025',
    role: 'Academic project',
    description: 'Anomaly-based traffic analysis for CSV, PCAP, and PCAPNG captures, with protocol breakdowns, risk scoring, and watched ports.',
    stack: ['Python', 'Flask', 'Scapy', 'Pandas'],
    flow: [
      { stage: 'Input', items: ['CSV, PCAP, PCAPNG captures'] },
      { stage: 'Parsing', items: ['Scapy packet parser'] },
      { stage: 'Analysis', items: ['Entropy and risk scoring'] },
      { stage: 'Output', items: ['Flask report with watched ports'] },
    ],
    links: [{ label: 'Read the code', href: 'https://github.com/rohitpawalia28/entropy-zero-day-detection' }],
  },
];

export const patents = [
  'Time-aware retrieval-augmented predictive behavioral risk scoring in cognitive care settings',
  'Engagement-adaptive multimodal retrieval-augmented personalized reminiscence interaction',
  'Epsilon-bound-verified fuzzy-rule surrogate modeling for interpretable LLM compression',
];

export const toolkit = [
  ['Interfaces', ['React', 'JavaScript', 'HTML', 'CSS']],
  ['Servers', ['Node.js', 'Express', 'REST APIs', 'Socket.IO']],
  ['Data', ['MongoDB', 'MySQL', 'PySpark', 'Pandas']],
  ['Shipping', ['AWS', 'Vercel', 'Render', 'Git and CI/CD']],
];

export const education = [
  { years: '2023–2027', title: 'B.Tech in Information Technology', place: 'Vellore Institute of Technology' },
  { years: '2023', title: 'Class 12, PCM', place: 'Yaduvanshi Shiksha Niketan, Rewari' },
  { years: '2021', title: 'Class 10', place: 'Navy Children School, Karanja, Navi Mumbai' },
];

export const processSteps = [
  {
    title: 'Listen first',
    text: 'Every build starts with who will use it and what they do all day. For ACE Academy that meant three roles: admins, teachers, and students.',
  },
  {
    title: 'Model the data',
    text: 'I shape the MongoDB collections around the real workflow, like attendance per class and marks per test, so the screens never fight the data later.',
  },
  {
    title: 'Build the API',
    text: 'A Node and Express API with role checks on every route, plus Socket.IO wherever people need to see a change the moment it happens.',
  },
  {
    title: 'Design the screens',
    text: 'Each role gets its own React interface that shows only what that person needs, and works on the phone they already carry.',
  },
  {
    title: 'Ship it and stay',
    text: 'Deployed to production with an admin dashboard, so the client can run things without me. Then I fix whatever real use uncovers.',
  },
];

export const experience = [
  {
    role: 'Freelance full-stack developer',
    org: 'Self-employed',
    place: 'Vellore, Tamil Nadu',
    dates: 'Mar 2026 – Jun 2026',
    points: [
      'Built and delivered ACE Academy, a role-based institute management system for admins, teachers, and students, with live updates over Socket.IO.',
      'Built and delivered the Platinum Unisex Salon website, with appointment booking, customer enquiries, and an admin dashboard the owner runs daily.',
      'Owned both projects end to end: requirements, MongoDB data modelling, admin workflows, and production deployment.',
    ],
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.IO', 'Vercel'],
  },
];
