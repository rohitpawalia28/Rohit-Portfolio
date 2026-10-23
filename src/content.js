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
  {
    id: 'cognishield',
    name: 'CogniShield',
    short: 'CogniShield',
    type: 'AI image protection',
    year: '2026',
    role: 'Academic project',
    description: 'A local tool that adds a barely visible change to an image to disrupt AI image-to-image models, checks that it survives JPEG compression, and signs the result so anyone can confirm it has not been altered.',
    stack: ['Python', 'Flask', 'PyTorch', 'OpenCV'],
    flow: [
      { stage: 'Input', items: ['PNG, JPG or WEBP image'] },
      { stage: 'Protection', items: ['Edge-aware, high-frequency perturbation'] },
      { stage: 'Checks', items: ['PSNR and SSIM', 'JPEG quality 95 to 50'] },
      { stage: 'Output', items: ['Protected PNG', 'Ed25519-signed provenance'] },
    ],
    links: [{ label: 'Read the code', href: 'https://github.com/rohitpawalia28/Cognishield' }],
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

/* Ship Log: the career timeline, told as a commit history. */
export const shipLog = [
  { date: '2021', type: 'init', title: 'Class 10 at Navy Children School', body: 'Karanja, Navi Mumbai. Where the first lines of code happened.' },
  { date: '2023', type: 'feat', title: 'Class 12 done, B.Tech IT begins', body: 'PCM at Yaduvanshi Shiksha Niketan, Rewari, then Information Technology at VIT Vellore.' },
  { date: '2025', type: 'feat', title: 'Data and security projects', body: 'Route-level fare anomalies across 32 GB of NYC taxi trips in PySpark, and an entropy-based intrusion detector for live packet captures.' },
  { date: '2026', type: 'docs', title: '3 patent applications published', body: 'Co-inventor on Indian patent applications in adaptive AI, behavioral risk scoring and interpretable language models.' },
  { date: 'Mar – Jun 2026', type: 'release', title: 'Freelance full-stack developer', body: 'Shipped 2 paid client systems end to end: ACE Academy and the Platinum Unisex Salon website.' },
  { date: 'Oct 2026', type: 'cert', title: 'MongoDB Vector Search certified', body: 'Building AI-Powered Search with MongoDB Vector Search, issued by MongoDB: indexing, embeddings and retrieval strategies.', href: 'https://www.credly.com/badges/bf22f614-31f1-418c-8050-36155eab5717' },
  { date: '2027', type: 'next', title: 'Graduating. Open to roles.', body: 'Looking for full-stack internships and freelance work where real people depend on what gets built.' },
];

/* Stack ring: the toolkit grouped the way the work actually uses it. */
export const stackGroups = [
  { name: 'Interfaces', items: ['React', 'JavaScript', 'HTML', 'CSS'] },
  { name: 'Servers', items: ['Node.js', 'Express', 'REST APIs', 'Socket.IO'] },
  { name: 'Data', items: ['MongoDB', 'MySQL', 'PySpark', 'Pandas'] },
  { name: 'Shipping', items: ['Vercel', 'Render', 'Git', 'CI/CD'] },
  { name: 'Cloud and AI search', items: ['AWS', 'MongoDB Atlas', 'Vector Search'] },
  { name: 'Security and ML', items: ['Python', 'Flask', 'Scapy', 'Scikit-learn'] },
];

/* Work ring: one card per project, each opening the live thing. */
export const workCards = [
  { project: 'ace', image: '/work/ace-suite.webp', label: 'ACE Academy, home, fees and student portal', go: 'live' },
  { project: 'salon', image: '/work/salon.webp', label: 'Platinum Unisex Salon, home page', go: 'live' },
  { project: 'taxi', image: '/work/taxi.webp', label: 'Taxi route anomalies, PySpark output', go: 'code' },
  { project: 'ids', image: '/work/ids.webp', label: 'Sentinel IDS, entropy over captured traffic', go: 'code' },
  { project: 'cognishield', image: '/work/cognishield.webp', label: 'CogniShield, protect an image before sharing it', go: 'code' },
];

/* Project pages: the longer story behind each card. */
export const projectDetails = {
  ace: {
    gallery: [
      { src: '/work/ace-home.webp', caption: 'Public home page with admissions and courses' },
      { src: '/work/ace-courses.webp', caption: 'Fees and enrolment plans' },
      { src: '/work/ace-login.webp', caption: 'Sign-in for admins, teachers and students' },
    ],
    problem: 'The institute needed one place where admins, teachers and students handle attendance, timetables, marks, study materials and progress, instead of separate tools.',
    built: [
      'Three roles (admin, teacher, student), each with its own dashboard and only the actions that role needs.',
      'Attendance, timetables, marks, study materials and progress tracking behind a REST API in Node.js and Express.',
      'Live updates over Socket.IO, so a change made by a teacher shows up for students without a refresh.',
      'A public site for admissions, courses and fee plans, linked to the same data.',
    ],
    outcome: 'Delivered as a paid client build and running in production on Vercel.',
  },
  salon: {
    gallery: [{ src: '/work/salon.webp', caption: 'Home page with services and booking' }],
    problem: 'The salon needed customers to book and send enquiries online, and the owner to manage all of it from one dashboard.',
    built: [
      'Online appointment booking, customer enquiries, service information, locations and opening hours.',
      'An admin dashboard where the owner manages every enquiry and booking in one place.',
      'Appointment-status updates after each visit, so the record stays accurate.',
    ],
    outcome: 'Delivered as a paid client build. The owner runs the day from the dashboard.',
  },
  taxi: {
    gallery: [{ src: '/work/taxi.webp', caption: 'Flagged trips by distance and fare, from the PySpark output' }],
    problem: 'Find fares that do not fit their route, across a dataset far too large to check by hand: 32 GB of NYC taxi trips.',
    built: [
      'PySpark jobs that clean and group 32 GB of NYC taxi trips by route.',
      'Route-level fare anomaly scoring with Scikit-learn.',
      'A Flask dashboard to explore flagged trips by route, distance and fare.',
    ],
    outcome: 'An academic project in data engineering and machine learning.',
  },
  ids: {
    gallery: [{ src: '/work/ids.webp', caption: 'Packet entropy over time, with the alert threshold' }],
    problem: 'Flag unusual network traffic in packet captures without relying only on known attack signatures.',
    built: [
      'Parsing for CSV, PCAP and PCAPNG captures with Scapy.',
      'Windowed entropy analysis with a statistical alert threshold, plus risk scoring.',
      'A Flask report with protocol breakdowns and watched ports.',
    ],
    outcome: 'An academic project in network security.',
  },
  cognishield: {
    gallery: [{ src: '/work/cognishield.webp', caption: 'Upload step of the local web app' }],
    problem: 'Photos shared online can be fed straight into AI image-to-image models. The aim: protect an image before it is shared without visibly changing it, and prove later that it has not been tampered with.',
    built: [
      'An edge-aware, high-frequency perturbation with reproducible seeds, kept small enough to be hard to see.',
      'Quality metrics (PSNR, SSIM, MSE, mean and max pixel change) to measure the visual trade-off.',
      'JPEG robustness tests at quality 95, 85, 75, 60 and 50.',
      'Ed25519 signing over a SHA-256 hash, with a provenance file and a check for any change after signing.',
      'An optional before-and-after test against a local SD-Turbo model, plus a Flask web app and batch CLI that run entirely on your own computer.',
    ],
    outcome: 'An academic project in AI security: a review-ready prototype that runs locally, with no images uploaded anywhere.',
  },
};

/* Research: a plain-language line for each patent application. */
export const research = [
  { title: patents[0], field: 'Healthcare AI', motif: 'wave', summary: 'Scores behavioural risk for people in cognitive care over time, retrieving each person’s own history so recent change is weighed in context.' },
  { title: patents[1], field: 'Multimodal AI', motif: 'rings', summary: 'A reminiscence companion that retrieves personal memories across modalities and adapts as the person’s engagement rises or falls.' },
  { title: patents[2], field: 'Interpretable ML', motif: 'lattice', summary: 'Compresses a large language model into readable fuzzy rules, with a verified epsilon bound on how far the rules may drift from the model.' },
];
