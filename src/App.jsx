import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  AtSign,
  Cloud,
  Code2,
  Database,
  Github,
  Linkedin,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const resumeUrl = 'https://drive.google.com/file/d/1oLf2Ux5VZTBY8UTp43bLaod9pkY9X6Sh/view?usp=drive_link';
const linkedinUrl = 'https://www.linkedin.com/in/rohit-kumar-6a7b4134b/';
const githubUrl = 'https://github.com/rohitpawalia28';
const email = 'merohitk281205@gmail.com';

const projects = [
  {
    number: '01',
    name: 'ACE Academy',
    type: 'Institute Management System',
    year: '2026',
    description: 'A role-based platform for Admins, Teachers, and Students with attendance, timetables, marks, materials, and progress tracking.',
    stack: ['React', 'Node.js', 'MongoDB', 'Socket.IO'],
    focus: 'Multi-role operations',
    tone: 'tone-a',
    links: [{ label: 'Live site', href: 'https://achieverscentreofeducation.vercel.app/' }, { label: 'Code', href: 'https://github.com/rohitpawalia28/ACE-Academy' }],
  },
  {
    number: '02',
    name: 'Platinum Unisex Salon',
    type: 'Client Management Website',
    year: '2026',
    description: 'A production client platform for appointment booking, customer enquiries, service information, and an admin operations dashboard.',
    stack: ['JavaScript', 'MongoDB', 'CSS', 'JSON'],
    focus: 'Customer conversion flow',
    tone: 'tone-b',
    links: [{ label: 'Live site', href: 'https://platinumunisexsalon.vercel.app/' }, { label: 'Code', href: 'https://github.com/platinumunisexsalon/Platinum-Unisex-Salon' }],
  },
  {
    number: '03',
    name: 'Taxi Route Anomaly Detection',
    type: 'Data Engineering + ML',
    year: '2025',
    description: 'Route-level fare anomaly analysis over a 32 GB NYC Taxi dataset, processed with Spark and surfaced through a Flask dashboard.',
    stack: ['PySpark', 'Pandas', 'Flask', 'Scikit-learn'],
    focus: '32 GB data analysis',
    tone: 'tone-c',
    links: [{ label: 'Code', href: 'https://github.com/rohitpawalia28/taxi-route-anomaly-detection' }],
  },
  {
    number: '04',
    name: 'Sentinel Entropy IDS',
    type: 'Network Security',
    year: '2025',
    description: 'Anomaly-based traffic analysis for CSV, PCAP, and PCAPNG files, with protocol insights, risk scoring, and watched ports.',
    stack: ['Python', 'Flask', 'Scapy', 'Pandas'],
    focus: 'Network threat signals',
    tone: 'tone-d',
    links: [{ label: 'Code', href: 'https://github.com/rohitpawalia28/entropy-zero-day-detection' }],
  },
];

const skillGroups = [
  ['Frontend', 'React', 'JavaScript', 'HTML5', 'CSS3'],
  ['Backend', 'Node.js', 'Express.js', 'REST APIs', 'Socket.IO'],
  ['Data', 'MongoDB', 'MySQL', 'PySpark', 'Pandas'],
  ['Cloud', 'AWS', 'Vercel', 'Render', 'CI/CD'],
];

const marqueeItems = ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.IO', 'MySQL', 'PySpark', 'AWS', 'Vercel', 'REST APIs'];

const capabilities = [
  { icon: Code2, label: 'Product development', text: 'Interfaces and backend flows that make complicated work feel direct.' },
  { icon: Database, label: 'Data-backed systems', text: 'MongoDB, MySQL, APIs, and operational dashboards built around real workflows.' },
  { icon: Cloud, label: 'Production delivery', text: 'Practical deployment with AWS, Vercel, Render, Git, and CI/CD.' },
  { icon: ShieldCheck, label: 'Security-minded builds', text: 'Research-led thinking for robust, observable, and safer applications.' },
];

const patents = [
  'Time-aware retrieval-augmented predictive behavioral risk scoring in cognitive care settings',
  'Engagement-adaptive multimodal retrieval-augmented personalized reminiscence interaction',
  'Epsilon-bound-verified fuzzy-rule surrogate modeling for interpretable LLM compression',
];

const education = [
  { year: '2023 — 2027', title: 'B.Tech, Information Technology', place: 'Vellore Institute of Technology, Vellore' },
  { year: '2023', title: 'Class 12, PCM', place: 'Yaduvanshi Shiksha Niketan, Rewari, Haryana' },
  { year: '2021', title: 'Class 10', place: 'Navy Children School, Karanja, Navi Mumbai' },
];

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Research', href: '#research' },
  { label: 'Contact', href: '#contact' },
];

const ease = [0.22, 1, 0.36, 1];

/* ------------------------------------------------------------------ */
/* Small animation building blocks                                     */
/* ------------------------------------------------------------------ */

function useIsWide(query = '(min-width: 861px)') {
  const [wide, setWide] = useState(() => (typeof window === 'undefined' ? true : window.matchMedia(query).matches));
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setWide(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [query]);
  return wide;
}

/** Text that rises out of a mask, line by line. */
function MaskLines({ lines, className = '', delay = 0, play = true, as: Tag = 'h2' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const show = play && inView;
  return (
    <Tag ref={ref} className={`mask-lines ${className}`}>
      {lines.map((line, index) => (
        <span className="mask-line" key={index}>
          <motion.span
            initial={{ y: '110%' }}
            animate={show ? { y: '0%' } : { y: '110%' }}
            transition={{ duration: 1.05, ease, delay: delay + index * 0.09 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Generic fade-and-rise on scroll. */
function Reveal({ children, delay = 0, y = 28, className = '', as = 'div' }) {
  const Component = motion[as];
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </Component>
  );
}

/** Pulls its child toward the pointer. */
function Magnetic({ children, strength = 0.3 }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 14, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 180, damping: 14, mass: 0.4 });

  const onMove = (event) => {
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  };
  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.span ref={ref} className="magnetic" style={{ x: springX, y: springY }} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </motion.span>
  );
}

/** Link whose label rolls up to a second copy on hover. */
function RollText({ children }) {
  return (
    <span className="roll" data-text={children}>
      <span>{children}</span>
    </span>
  );
}

/** Number that counts up when it scrolls into view. */
function CountUp({ to, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return undefined;
    const controls = animate(0, to, { duration: 1.6, ease, onUpdate: (latest) => setValue(Math.round(latest)) });
    return () => controls.stop();
  }, [inView, to]);
  return <span ref={ref}>{value}{suffix}</span>;
}

/** Words light up one by one as the paragraph passes through the viewport. */
function ScrollWords({ text }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] });
  const words = text.split(' ');
  return (
    <p ref={ref} className="statement">
      {words.map((word, index) => (
        <Word key={index} progress={scrollYProgress} range={[index / words.length, (index + 1) / words.length]}>
          {word}
        </Word>
      ))}
    </p>
  );
}

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <>
      <motion.span style={{ opacity }}>{children}</motion.span>{' '}
    </>
  );
}

/** Tracks the pointer inside an element via CSS variables for spotlight effects. */
const trackSpotlight = (event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`);
  event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`);
};

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */

function Preloader({ onDone }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const controls = animate(0, 100, {
      duration: 1.5,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (latest) => setCount(Math.round(latest)),
      onComplete: () => setTimeout(onDone, 250),
    });
    return () => controls.stop();
  }, [onDone]);

  return (
    <motion.div className="preloader" exit={{ y: '-100%' }} transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}>
      <div className="preloader-name">
        {'Rohit Kumar'.split('').map((char, index) => (
          <span className="mask-line" key={index}>
            <motion.span initial={{ y: '110%' }} animate={{ y: '0%' }} transition={{ duration: 0.8, ease, delay: 0.1 + index * 0.04 }}>
              {char === ' ' ? ' ' : char}
            </motion.span>
          </span>
        ))}
      </div>
      <div className="preloader-bar"><motion.i style={{ scaleX: count / 100 }} /></div>
      <span className="preloader-count">{String(count).padStart(3, '0')}</span>
    </motion.div>
  );
}

function Cursor({ label }) {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const smoothX = useSpring(x, { damping: 26, stiffness: 380, mass: 0.4 });
  const smoothY = useSpring(y, { damping: 26, stiffness: 380, mass: 0.4 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const move = (event) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setHovering(Boolean(event.target.closest?.('a, button, input, textarea, [data-cursor]')));
    };
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, [x, y]);

  return (
    <motion.div
      className={`cursor ${hovering ? 'is-hover' : ''} ${label ? 'has-label' : ''}`}
      style={{ x: smoothX, y: smoothY }}
      aria-hidden="true"
    >
      <span>{label}</span>
    </motion.div>
  );
}

function Navigation() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(latest > previous && latest > 240 && !open);
    setScrolled(latest > 40);
  });

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <motion.header
        className={`nav ${scrolled ? 'is-scrolled' : ''}`}
        animate={{ y: hidden ? '-110%' : '0%' }}
        transition={{ duration: 0.5, ease }}
      >
        <a className="nav-brand" href="#top" aria-label="Rohit Kumar, back to top" onClick={() => setOpen(false)}>
          <span className="nav-monogram">RK</span>
          <span className="nav-brand-text">Rohit Kumar</span>
        </a>
        <nav className="nav-links" aria-label="Main navigation">
          {navItems.map((item) => <a key={item.href} href={item.href}><RollText>{item.label}</RollText></a>)}
        </nav>
        <a className="nav-cta" href={`mailto:${email}`}><span className="status-dot" /> <RollText>Let&rsquo;s talk</RollText></a>
        <button className={`nav-toggle ${open ? 'is-open' : ''}`} onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
          <i /><i />
        </button>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav aria-label="Mobile navigation">
              {navItems.map((item, index) => (
                <span className="mask-line" key={item.href}>
                  <motion.a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    initial={{ y: '110%' }}
                    animate={{ y: '0%' }}
                    exit={{ y: '110%' }}
                    transition={{ duration: 0.7, ease, delay: 0.25 + index * 0.07 }}
                  >
                    <small>0{index + 1}</small>{item.label}
                  </motion.a>
                </span>
              ))}
            </nav>
            <motion.div className="mobile-menu-foot" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.6 } }} exit={{ opacity: 0 }}>
              <a href={linkedinUrl} target="_blank" rel="noreferrer">LinkedIn</a>
              <a href={githubUrl} target="_blank" rel="noreferrer">GitHub</a>
              <a href={resumeUrl} target="_blank" rel="noreferrer">Resume</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Hero({ ready }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const portraitY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const glowX = useMotionValue(0.5);
  const glowY = useMotionValue(0.4);
  const smoothGlowX = useSpring(glowX, { stiffness: 40, damping: 20 });
  const smoothGlowY = useSpring(glowY, { stiffness: 40, damping: 20 });
  const glowLeft = useTransform(smoothGlowX, (v) => `${v * 100}%`);
  const glowTop = useTransform(smoothGlowY, (v) => `${v * 100}%`);

  const onMove = (event) => {
    const rect = ref.current.getBoundingClientRect();
    glowX.set((event.clientX - rect.left) / rect.width);
    glowY.set((event.clientY - rect.top) / rect.height);
  };

  const enter = (delay) => ({
    initial: { opacity: 0, y: 24 },
    animate: ready ? { opacity: 1, y: 0 } : {},
    transition: { duration: 1, ease, delay },
  });

  return (
    <section className="hero" id="top" ref={ref} onPointerMove={onMove}>
      <motion.div className="hero-glow" style={{ left: glowLeft, top: glowTop }} aria-hidden="true" />
      <div className="hero-grid-lines" aria-hidden="true"><i /><i /><i /></div>

      <motion.div className="hero-inner" style={{ opacity: fade }}>
        <div className="hero-meta">
          <motion.p {...enter(0.1)}><span className="status-dot" /> Available for freelance &amp; internships</motion.p>
          <motion.p {...enter(0.2)}>Based in Gurugram, India</motion.p>
        </div>

        <motion.div className="hero-title-wrap" style={{ y: titleY }}>
          <MaskLines
            as="h1"
            className="hero-title"
            play={ready}
            delay={0.15}
            lines={[<>Rohit</>, <><em>Kumar</em><span className="hero-period">.</span></>]}
          />
        </motion.div>

        <motion.figure
          className="hero-portrait"
          initial={{ clipPath: 'inset(100% 0 0 0 round 240px 240px 18px 18px)' }}
          animate={ready ? { clipPath: 'inset(0% 0 0 0 round 240px 240px 18px 18px)' } : {}}
          transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1], delay: 0.35 }}
        >
          <motion.img
            src="/rohit.webp"
            alt="Portrait of Rohit Kumar"
            style={{ y: portraitY }}
            initial={{ scale: 1.35 }}
            animate={ready ? { scale: 1.12 } : {}}
            transition={{ duration: 2, ease, delay: 0.35 }}
          />
        </motion.figure>

        <div className="hero-bottom">
          <motion.p className="hero-intro" {...enter(0.55)}>
            Full-stack developer who turns complex workflows into <em>useful, reliable</em> software.
          </motion.p>
          <motion.div className="hero-actions" {...enter(0.7)}>
            <Magnetic><a className="btn btn-solid" href="#work"><RollText>Explore work</RollText><ArrowDown size={16} /></a></Magnetic>
            <Magnetic><a className="btn btn-ghost" href={resumeUrl} target="_blank" rel="noreferrer"><RollText>Resume</RollText><ArrowUpRight size={16} /></a></Magnetic>
          </motion.div>
        </div>

        <motion.a className="hero-badge" href="#about" aria-label="Scroll to about" {...enter(0.9)}>
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <defs><path id="badge-circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" /></defs>
            <text><textPath href="#badge-circle">Scroll to explore · Full-stack developer · </textPath></text>
          </svg>
          <ArrowDown size={18} />
        </motion.a>
      </motion.div>
    </section>
  );
}

function Marquee() {
  const items = [...marqueeItems, ...marqueeItems];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {items.map((item, index) => <span key={index}>{item}<i>✦</i></span>)}
      </div>
    </div>
  );
}

function About() {
  return (
    <section className="section about" id="about">
      <div className="section-head">
        <span className="kicker">(01) Profile</span>
      </div>
      <ScrollWords text="I build the practical layer between a good idea and a usable product — interfaces, APIs, real-time features, and data-backed systems that hold up in production." />

      <div className="about-grid">
        <Reveal className="about-copy">
          <p>Currently studying Information Technology at Vellore Institute of Technology, I work across the whole stack. My freelance projects have taken ideas from first requirements to live, paying clients.</p>
          <div className="stats">
            <div><strong><CountUp to={2} /></strong><span>Paid freelance<br />client builds</span></div>
            <div><strong><CountUp to={3} /></strong><span>Published patent<br />applications</span></div>
            <div><strong><CountUp to={32} suffix="GB" /></strong><span>Largest dataset<br />analysed</span></div>
          </div>
        </Reveal>
        <div className="timeline">
          {education.map((item, index) => (
            <Reveal className="timeline-row" key={item.title} delay={index * 0.08}>
              <span className="timeline-year">{item.year}</span>
              <div><h3>{item.title}</h3><p>{item.place}</p></div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Capabilities() {
  return (
    <section className="section capabilities">
      <div className="section-head split">
        <span className="kicker">(02) What I build</span>
        <MaskLines lines={['Full-stack craft, grounded', <>in how people <em>actually</em> work.</>]} />
      </div>
      <div className="cap-grid">
        {capabilities.map((capability, index) => {
          const Icon = capability.icon;
          return (
            <Reveal className="cap-card" key={capability.label} delay={index * 0.08} as="article">
              <div className="cap-inner" onPointerMove={trackSpotlight}>
                <div className="cap-top"><Icon size={22} strokeWidth={1.4} /><span>0{index + 1}</span></div>
                <h3>{capability.label}</h3>
                <p>{capability.text}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

function ProjectCard({ project, index, total, progress, wide, setCursorLabel }) {
  const start = index / total;
  const targetScale = 1 - (total - 1 - index) * 0.045;
  const scale = useTransform(progress, [start, 1], [1, wide ? targetScale : 1]);
  const dim = useTransform(progress, [start, 1], [0, wide ? (total - 1 - index) * 0.12 : 0]);

  return (
    <div className="project-sticky" style={{ top: wide ? `calc(110px + ${index * 26}px)` : undefined }}>
      <motion.article
        className={`project ${project.tone}`}
        style={{ scale }}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1, ease }}
        onPointerMove={trackSpotlight}
        onPointerEnter={() => setCursorLabel('View')}
        onPointerLeave={() => setCursorLabel('')}
      >
        <motion.div className="project-dim" style={{ opacity: dim }} aria-hidden="true" />
        <div className="project-head">
          <span className="project-number">{project.number}</span>
          <span className="project-type">{project.type}</span>
          <span className="project-year">{project.year}</span>
        </div>
        <div className="project-body">
          <h3>{project.name}</h3>
          <div className="project-side">
            <p className="project-focus"><span className="status-dot" /> {project.focus}</p>
            <p className="project-description">{project.description}</p>
            <div className="project-stack">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
            <div className="project-links">
              {project.links.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noreferrer"><RollText>{link.label}</RollText><ArrowUpRight size={15} /></a>
              ))}
            </div>
          </div>
        </div>
        <span className="project-ghost" aria-hidden="true">{project.number}</span>
      </motion.article>
    </div>
  );
}

function Work({ setCursorLabel }) {
  const ref = useRef(null);
  const wide = useIsWide();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  return (
    <section className="section work" id="work">
      <div className="section-head split">
        <span className="kicker">(03) Selected work</span>
        <MaskLines lines={['Systems with a', <><em>clear</em> purpose.</>]} />
      </div>
      <div className="project-stack-wrap" ref={ref}>
        {projects.map((project, index) => (
          <ProjectCard
            key={project.name}
            project={project}
            index={index}
            total={projects.length}
            progress={scrollYProgress}
            wide={wide}
            setCursorLabel={setCursorLabel}
          />
        ))}
      </div>
    </section>
  );
}

function Toolkit() {
  return (
    <section className="section toolkit">
      <div className="section-head split">
        <span className="kicker">(04) Toolkit</span>
        <MaskLines lines={['Comfortable across the stack,', <>focused on the <em>outcome</em>.</>]} />
      </div>
      <div className="tool-grid">
        {skillGroups.map(([label, ...skills], groupIndex) => (
          <Reveal className="tool-group" key={label} delay={groupIndex * 0.08}>
            <p className="tool-label"><span>0{groupIndex + 1}</span>{label}</p>
            <ul>
              {skills.map((skill, index) => (
                <motion.li
                  key={skill}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease, delay: 0.2 + groupIndex * 0.08 + index * 0.05 }}
                >
                  {skill}
                </motion.li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Research() {
  return (
    <section className="section research" id="research">
      <div className="section-head split">
        <span className="kicker">(05) Research</span>
        <MaskLines lines={['Curious enough to go', <>beyond the <em>implementation</em>.</>]} />
      </div>
      <div className="research-layout">
        <Reveal className="research-figure">
          <span><CountUp to={3} /></span>
          <p>Co-inventor on three published Indian patent applications exploring adaptive AI, behavioral risk analysis, and interpretable language-model systems.</p>
        </Reveal>
        <ol className="patent-list">
          {patents.map((patent, index) => (
            <Reveal as="li" key={patent} delay={index * 0.08}>
              <span className="patent-index">0{index + 1}</span>
              <p>{patent}</p>
              <span className="patent-tag">Patent application</span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section className="section experience">
      <div className="section-head">
        <span className="kicker">(06) Experience</span>
      </div>
      <Reveal className="exp-row">
        <span className="exp-date">Mar 2026 — Jun 2026</span>
        <div className="exp-main">
          <h3>Freelance Full-Stack Developer</h3>
          <p className="exp-where">Self-employed · Vellore, Tamil Nadu</p>
        </div>
        <p className="exp-detail">Independently delivered two paid client projects, from requirements and MongoDB integration to admin workflows and production deployment.</p>
      </Reveal>
    </section>
  );
}

function Contact() {
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);

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
      setStatus('success');
    } catch {
      setStatus('error');
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="section contact" id="contact">
      <div className="section-head">
        <span className="kicker">(07) Contact</span>
      </div>
      <MaskLines className="contact-title" lines={['Have an idea', <>worth <em>building?</em></>]} />

      <div className="contact-grid">
        <Reveal className="contact-info">
          <p className="contact-lead">Let&rsquo;s make it feel simple on the other side. Tell me about the product, the role, or the problem.</p>
          <ul className="contact-links">
            <li><a href={`mailto:${email}`}><AtSign size={17} /><RollText>{email}</RollText></a></li>
            <li><a href="tel:+918433787405"><Phone size={17} /><RollText>+91 8433787405</RollText></a></li>
            <li><span><MapPin size={17} /> Gurugram, Haryana, India</span></li>
            <li><a href={linkedinUrl} target="_blank" rel="noreferrer"><Linkedin size={17} /><RollText>LinkedIn profile</RollText><ArrowUpRight size={14} /></a></li>
            <li><a href={githubUrl} target="_blank" rel="noreferrer"><Github size={17} /><RollText>github.com/rohitpawalia28</RollText><ArrowUpRight size={14} /></a></li>
          </ul>
        </Reveal>

        <Reveal className="contact-form-wrap" delay={0.1}>
          <form onSubmit={sendMessage} className="contact-form">
            <label className="field">
              <input name="name" required minLength="2" placeholder=" " autoComplete="name" />
              <span>Your name</span>
            </label>
            <label className="field">
              <input name="email" type="email" required placeholder=" " autoComplete="email" />
              <span>Email address</span>
            </label>
            <label className="field">
              <textarea name="message" required minLength="10" rows="4" placeholder=" " />
              <span>Tell me a little about it</span>
            </label>
            <div className="form-foot">
              <Magnetic strength={0.2}>
                <button className="btn btn-solid btn-send" type="submit" disabled={sending}>
                  <RollText>{sending ? 'Sending…' : 'Send message'}</RollText>
                  <Send size={16} />
                </button>
              </Magnetic>
              <AnimatePresence mode="wait">
                {status && (
                  <motion.p
                    key={status}
                    className={`form-status ${status === 'success' ? 'is-success' : 'is-error'}`}
                    role="status"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {status === 'success'
                      ? 'Message sent successfully. Rohit will get back to you soon.'
                      : 'Your message could not be sent right now. Please try again in a moment.'}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function LocalTime() {
  const format = () => new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' }).format(new Date());
  const [time, setTime] = useState(format);
  useEffect(() => {
    const id = setInterval(() => setTime(format()), 15000);
    return () => clearInterval(id);
  }, []);
  return <span>{time} IST</span>;
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-big" aria-hidden="true">
        <motion.span
          initial={{ y: '40%', opacity: 0 }}
          whileInView={{ y: '0%', opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease }}
        >
          Rohit <em>Kumar</em>
        </motion.span>
      </div>
      <div className="footer-row">
        <p>© {new Date().getFullYear()} Designed &amp; built by Rohit Kumar</p>
        <p className="footer-time">Local time · <LocalTime /></p>
        <div className="footer-links">
          <a href={linkedinUrl} target="_blank" rel="noreferrer"><RollText>LinkedIn</RollText></a>
          <a href={githubUrl} target="_blank" rel="noreferrer"><RollText>GitHub</RollText></a>
          <a href="#top" className="to-top" aria-label="Back to top"><ArrowUp size={16} /></a>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

function App() {
  const reduceMotion = useReducedMotion();
  const [loading, setLoading] = useState(!reduceMotion);
  const [cursorLabel, setCursorLabel] = useState('');
  const finishLoading = useCallback(() => setLoading(false), []);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  useEffect(() => {
    document.documentElement.classList.toggle('is-loading', loading);
  }, [loading]);

  return (
    <>
      <AnimatePresence>{loading && <Preloader onDone={finishLoading} />}</AnimatePresence>
      <Cursor label={cursorLabel} />
      <div className="grain" aria-hidden="true" />
      <motion.div className="progress" style={{ scaleX: progress }} aria-hidden="true" />
      <Navigation />
      <main>
        <Hero ready={!loading} />
        <Marquee />
        <About />
        <Capabilities />
        <Work setCursorLabel={setCursorLabel} />
        <Toolkit />
        <Research />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
