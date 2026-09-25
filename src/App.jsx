import { useEffect, useState } from 'react';
import { motion, useMotionValue, useScroll, useSpring } from 'framer-motion';
import {
  ArrowDownRight,
  ArrowUpRight,
  AtSign,
  BriefcaseBusiness,
  Cloud,
  Code2,
  Database,
  Download,
  Github,
  Linkedin,
  MapPin,
  Menu,
  Phone,
  Send,
  ShieldCheck,
  X,
} from 'lucide-react';

const projects = [
  {
    number: '01',
    name: 'ACE Academy',
    type: 'Institute Management System',
    description: 'A role-based platform for Admins, Teachers, and Students with attendance, timetables, marks, materials, and progress tracking.',
    stack: ['React', 'Node.js', 'MongoDB', 'Socket.IO'],
    accent: 'aqua',
    focus: 'Multi-role operations',
    links: [{ label: 'Live site', href: 'https://achieverscentreofeducation.vercel.app/' }, { label: 'Code', href: 'https://github.com/rohitpawalia28/ACE-Academy' }],
  },
  {
    number: '02',
    name: 'Platinum Unisex Salon',
    type: 'Client Management Website',
    description: 'A production client platform for appointment booking, customer enquiries, service information, and an admin operations dashboard.',
    stack: ['JavaScript', 'MongoDB', 'CSS', 'JSON'],
    accent: 'coral',
    focus: 'Customer conversion flow',
    links: [{ label: 'Live site', href: 'https://platinumunisexsalon.vercel.app/' }, { label: 'Code', href: 'https://github.com/platinumunisexsalon/Platinum-Unisex-Salon' }],
  },
  {
    number: '03',
    name: 'Taxi Route Anomaly Detection',
    type: 'Data Engineering + ML',
    description: 'Route-level fare anomaly analysis over a 32 GB NYC Taxi dataset, processed with Spark and surfaced through a Flask dashboard.',
    stack: ['PySpark', 'Pandas', 'Flask', 'Scikit-learn'],
    accent: 'lime',
    focus: '32 GB data analysis',
    links: [{ label: 'Code', href: 'https://github.com/rohitpawalia28/taxi-route-anomaly-detection' }],
  },
  {
    number: '04',
    name: 'Sentinel Entropy IDS',
    type: 'Network Security',
    description: 'Anomaly-based traffic analysis for CSV, PCAP, and PCAPNG files, with protocol insights, risk scoring, and watched ports.',
    stack: ['Python', 'Flask', 'Scapy', 'Pandas'],
    accent: 'purple',
    focus: 'Network threat signals',
    links: [{ label: 'Code', href: 'https://github.com/rohitpawalia28/entropy-zero-day-detection' }],
  },
];

const skillGroups = [
  ['Frontend', 'React', 'JavaScript', 'HTML5', 'CSS3'],
  ['Backend', 'Node.js', 'Express.js', 'REST APIs', 'Socket.IO'],
  ['Data', 'MongoDB', 'MySQL', 'PySpark', 'Pandas'],
  ['Cloud', 'AWS', 'Vercel', 'Render', 'CI/CD'],
];

const capabilities = [
  {
    icon: Code2,
    label: 'Product development',
    text: 'Interfaces and backend flows that make complicated work feel direct.',
  },
  {
    icon: Database,
    label: 'Data-backed systems',
    text: 'MongoDB, MySQL, APIs, and operational dashboards built around real workflows.',
  },
  {
    icon: Cloud,
    label: 'Production delivery',
    text: 'Practical deployment with AWS, Vercel, Render, Git, and CI/CD.',
  },
  {
    icon: ShieldCheck,
    label: 'Security-minded builds',
    text: 'Research-led thinking for robust, observable, and safer applications.',
  },
];

const patents = [
  'Time-aware retrieval-augmented predictive behavioral risk scoring in cognitive care settings',
  'Engagement-adaptive multimodal retrieval-augmented personalized reminiscence interaction',
  'Epsilon-bound-verified fuzzy-rule surrogate modeling for interpretable LLM compression',
];

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25, restDelta: 0.001 });
  const [menuOpen, setMenuOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);
  const [cursorLabel, setCursorLabel] = useState('');
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const smoothCursorX = useSpring(cursorX, { damping: 24, stiffness: 420, mass: 0.35 });
  const smoothCursorY = useSpring(cursorY, { damping: 24, stiffness: 420, mass: 0.35 });

  useEffect(() => {
    const moveCursor = (event) => {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
    };
    window.addEventListener('pointermove', moveCursor);
    return () => window.removeEventListener('pointermove', moveCursor);
  }, [cursorX, cursorY]);

  const sendMessage = async (event) => {
    event.preventDefault();
    setSending(true);
    setStatus('');
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(form.entries())),
      });
      if (!response.ok) throw new Error('Message could not be sent.');
      formElement.reset();
      setStatus('Message sent successfully. Rohit will get back to you soon.');
    } catch (error) {
      setStatus('Your message could not be sent right now. Please try again in a moment.');
    } finally {
      setSending(false);
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <main>
      <motion.div className={`site-cursor ${cursorLabel ? 'is-active' : ''}`} style={{ x: smoothCursorX, y: smoothCursorY }} aria-hidden="true"><span>{cursorLabel}</span></motion.div>
      <motion.div className="progress" style={{ scaleX }} />
      <header className="nav-shell">
        <a className="brand" href="#top" aria-label="Rohit Kumar home"><img className="brand-avatar" src="/rohit.png" alt="" />RK<span>.</span></a>
        <nav className={menuOpen ? 'nav-links is-open' : 'nav-links'} aria-label="Main navigation">
          <a href="#work" onClick={closeMenu}>Work</a>
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
          <a className="nav-linkedin" href="https://www.linkedin.com/in/rohit-kumar-6a7b4134b/" target="_blank" rel="noreferrer"><Linkedin size={15} /> LinkedIn</a>
        </nav>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <section className="hero" id="top">
        <div className="hero-image" aria-hidden="true" />
        <div className="hero-shade" aria-hidden="true" />
        <motion.div className="hero-content" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.12 } } }}>
          <motion.p className="eyebrow" variants={reveal}><span className="status-dot" /> Available for ambitious builds</motion.p>
          <motion.h1 variants={reveal}>Rohit<br /><em>Kumar.</em></motion.h1>
          <motion.p className="hero-intro" variants={reveal}>Full-stack developer who turns complex workflows into useful, reliable software.</motion.p>
          <motion.div className="hero-actions" variants={reveal}>
            <a className="button primary" href="#work">Explore work <ArrowDownRight size={18} /></a>
            <a className="button quiet" href="/Rohit_Resume.pdf" download>Resume <Download size={17} /></a>
          </motion.div>
        </motion.div>
        <div className="hero-footer"><span>VIT Vellore / Information Technology</span><span>Scroll to explore <ArrowDownRight size={15} /></span></div>
      </section>

      <section className="intro-section" id="about">
        <motion.div className="section-label" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={reveal}>01 / Profile</motion.div>
        <motion.div className="intro-copy" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={reveal}>
          <h2>I build the practical layer between a good idea and a usable product.</h2>
          <p>Currently studying Information Technology at Vellore Institute of Technology, I work across product interfaces, APIs, real-time features, and data-backed systems. My freelance projects have taken ideas from requirements to production.</p>
          <div className="facts">
            <div><strong>2023-2027</strong><span>B.Tech, IT at VIT Vellore</span></div>
            <div><strong>2</strong><span>Paid freelance client builds</span></div>
            <div><strong>3</strong><span>Published patent applications</span></div>
          </div>
        </motion.div>
      </section>

      <section className="capability-section">
        <div className="section-label">01.5 / What I build</div>
        <div className="capability-heading"><h2>Full-stack craft, grounded in how people actually work.</h2><p>From the first requirements conversation through production deployment, I focus on the parts that turn a concept into a dependable product.</p></div>
        <div className="capability-grid">
          {capabilities.map((capability, index) => {
            const Icon = capability.icon;
            return <motion.article className="capability" key={capability.label} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, delay: index * 0.06 } } }}><div className="capability-top"><Icon size={22} /><span>0{index + 1}</span></div><h3>{capability.label}</h3><p>{capability.text}</p></motion.article>;
          })}
        </div>
      </section>

      <section className="work-section" id="work">
        <div className="section-heading">
          <div><div className="section-label">02 / Selected work</div><p className="work-kicker">Built for real users, constraints, and outcomes.</p></div>
          <h2>Systems with a clear purpose.</h2>
        </div>
        <div className="project-grid">
          {projects.map((project, index) => (
            <motion.article className={`project-card ${project.accent}`} key={project.name} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={{ hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: (index % 2) * 0.08 } } }} whileHover={{ y: -10, scale: 1.015, transition: { type: 'spring', stiffness: 290, damping: 19 } }} whileTap={{ scale: 0.99 }} onMouseEnter={() => setCursorLabel('VIEW')} onMouseLeave={() => setCursorLabel('')}>
              <div className="project-gridmark" aria-hidden="true"><i /><i /><i /><i /></div>
              <div className="project-top"><span>{project.number}</span><div className="project-focus"><Code2 size={17} /><span>{project.focus}</span></div></div>
              <div>
                <p className="project-type">{project.type}</p>
                <h3>{project.name}</h3>
                <p className="project-description">{project.description}</p>
              </div>
              <div className="project-bottom"><div className="stack">{project.stack.map((item) => <span key={item}>{item}</span>)}</div><div className="project-links">{project.links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label} <ArrowUpRight size={14} /></a>)}</div></div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="skills-section">
        <div className="section-label">03 / Toolkit</div>
        <div className="skills-layout">
          <h2>Comfortable across the stack, focused on the outcome.</h2>
          <div className="skill-groups">
            {skillGroups.map(([label, ...skills]) => <div className="skill-group" key={label}><p>{label}</p><div>{skills.map((skill) => <span key={skill}>{skill}</span>)}</div></div>)}
          </div>
        </div>
      </section>

      <section className="patent-section">
        <div className="patent-figure">03</div>
        <div>
          <div className="section-label">04 / Research</div>
          <h2>Curious enough to go beyond the implementation.</h2>
          <p className="patent-intro">Co-inventor on three published Indian patent applications exploring adaptive AI, behavioral risk analysis, and interpretable language-model systems.</p>
          <ol>{patents.map((patent, index) => <li key={patent}><span>0{index + 1}</span>{patent}</li>)}</ol>
        </div>
      </section>

      <section className="experience-section">
        <div className="section-label">05 / Experience</div>
        <div className="experience-row">
          <div><BriefcaseBusiness size={24} /><h2>Freelance Full-Stack Developer</h2></div>
          <div><p>Self-employed</p><p>Vellore, Tamil Nadu</p></div>
          <p className="experience-date">Mar 2026 - Jun 2026</p>
          <p className="experience-detail">Independently delivered two paid client projects, from requirements and MongoDB integration to admin workflows and production deployment.</p>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div>
          <div className="section-label">06 / Contact</div>
          <h2>Have an idea worth building?</h2>
          <p>Let’s make it feel simple on the other side.</p>
          <div className="contact-links">
            <a href="mailto:merohitk281205@gmail.com"><AtSign size={18} /> merohitk281205@gmail.com</a>
            <a href="tel:+918433787405"><Phone size={18} /> +91 8433787405</a>
            <p className="contact-location"><MapPin size={18} /> Gurugram, Haryana, India</p>
            <a href="https://www.linkedin.com/in/rohit-kumar-6a7b4134b/" target="_blank" rel="noreferrer"><Linkedin size={18} /> LinkedIn profile <ArrowUpRight size={15} /></a>
            <a href="https://github.com/rohitpawalia28" target="_blank" rel="noreferrer"><Github size={18} /> github.com/rohitpawalia28 <ArrowUpRight size={15} /></a>
            <a href="/Rohit_Resume.pdf" download><Download size={18} /> Download resume</a>
          </div>
        </div>
        <form onSubmit={sendMessage} className="contact-form">
          <label>Your name<input name="name" required minLength="2" placeholder="Name" /></label>
          <label>Email address<input name="email" type="email" required placeholder="you@example.com" /></label>
          <label>Tell me a little about it<textarea name="message" required minLength="10" rows="4" placeholder="Project, role, or collaboration" /></label>
          <button className="button primary send-button" type="submit" disabled={sending}>{sending ? 'Sending...' : 'Send message'} <Send size={17} /></button>
          {status && <p className={`form-status ${status.startsWith('Message sent') ? 'is-success' : 'is-error'}`} role="status">{status}</p>}
        </form>
      </section>

      <footer><a className="brand" href="#top">RK<span>.</span></a><p>Designed and built by Rohit Kumar.</p><a href="https://github.com/rohitpawalia28" target="_blank" rel="noreferrer" aria-label="Rohit's GitHub"><Github size={18} /></a></footer>
    </main>
  );
}

export default App;
