import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { email, githubUrl, linkedinUrl, patents, phone, projects, resumeUrl, shipLog, stackGroups, workCards } from './content';
import { SystemGraph } from './graph';
import { CommandPalette, Icon } from './ui';

/* ================================================================== */
/* Scroll engine                                                       */
/* One rAF per frame drives every scene. Each scene gets p in [0,1]:   */
/* how far the page has scrolled through that scene's pinned stretch.  */
/* ================================================================== */

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (p, a, b) => clamp((p - a) / (b - a));
const easeOut = (t) => 1 - (1 - t) ** 3;
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const lerp = (a, b, t) => a + (b - a) * t;

const runners = new Set();
let queued = false;
const flush = () => { queued = false; runners.forEach((run) => run()); };
const request = () => { if (!queued) { queued = true; requestAnimationFrame(flush); } };
if (typeof window !== 'undefined') {
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request);
}

function useScene(ref, onFrame, enabled = true) {
  const frame = useRef(onFrame);
  frame.current = onFrame;
  useEffect(() => {
    if (!enabled) return undefined;
    const run = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const p = travel > 0 ? clamp(-rect.top / travel) : rect.top < 0 ? 1 : 0;
      const visible = rect.bottom > -200 && rect.top < window.innerHeight + 200;
      frame.current(p, { rect, el, visible });
    };
    runners.add(run);
    run();
    return () => { runners.delete(run); };
  }, [ref, enabled]);
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return reduced;
}

function useNarrow() {
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 860px)').matches);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 860px)');
    const update = () => setNarrow(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return narrow;
}

/* ================================================================== */
/* Text effects                                                        */
/* ================================================================== */

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>{}[]#$%&*+=';

/** Letters cycle through random glyphs before settling, left to right. */
function Scramble({ text, play, delay = 0, className = '' }) {
  const [out, setOut] = useState(text);
  const done = useRef(false);
  useEffect(() => {
    if (!play || done.current) return undefined;
    done.current = true;
    let frame = 0;
    let start = 0;
    const total = 520 + text.length * 14;
    const tick = (now) => {
      if (!start) start = now + delay;
      const t = now < start ? 0 : (now - start) / total;
      setOut(text.split('').map((ch, i) => {
        if (ch === ' ') return ' ';
        const settle = i / text.length;
        return t > settle ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }).join(''));
      if (t < 1.05) frame = requestAnimationFrame(tick);
      else setOut(text);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [play, text, delay]);
  return <span className={className} aria-label={text}><span aria-hidden="true">{out}</span></span>;
}

/** Fires once when the element is at least `amount` in view. */
function useOnce(ref, amount = 0.4) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setSeen(true); io.disconnect(); }
    }, { threshold: amount });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, amount]);
  return seen;
}

/* ================================================================== */
/* Navigation                                                          */
/* ================================================================== */

const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'Log', href: '#log' },
  { label: 'Stack', href: '#stack' },
  { label: 'Research', href: '#research' },
  { label: 'Contact', href: '#contact' },
];

function Nav({ onSearch }) {
  const [open, setOpen] = useState(false);
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);
  return (
    <header className={`nav ${open ? 'is-open' : ''}`}>
      <a className="nav-mark" href="#top" translate="no" onClick={() => setOpen(false)}>Rohit Kumar</a>
      <nav className="nav-links" aria-label="Main">
        {navLinks.map((link) => <a key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</a>)}
      </nav>
      <button className="nav-search" onClick={onSearch}>Search <kbd>{isMac ? '⌘ K' : 'Ctrl K'}</kbd></button>
      <button className="nav-toggle" aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}><i /><i /></button>
    </header>
  );
}

/* ================================================================== */
/* Scene 1: depth hero — the name sits behind and in front of Rohit    */
/* ================================================================== */

function Hero({ reduced }) {
  const ref = useRef(null);
  const parts = useRef({});
  useScene(ref, (p) => {
    const { back, front, portrait, meta } = parts.current;
    if (!back) return;
    const e = easeOut(p);
    back.style.transform = `translate3d(0, ${-e * 34}vh, 0) scale(${1 - e * 0.08})`;
    back.style.filter = `blur(${e * 16}px)`;
    back.style.opacity = String(1 - seg(p, 0.15, 0.85));
    front.style.transform = `translate3d(0, ${e * 18}vh, 0) scale(${1 + e * 0.12})`;
    front.style.opacity = String(1 - seg(p, 0, 0.6));
    portrait.style.transform = `translate3d(-50%, ${e * 8}vh, 0) scale(${1 - e * 0.1})`;
    portrait.style.filter = `brightness(${1 - e * 0.55})`;
    meta.style.opacity = String(1 - seg(p, 0, 0.35));
    if (parts.current.glow) parts.current.glow.style.opacity = String(1 - seg(p, 0.05, 0.7));
  }, !reduced);

  const set = (key) => (el) => { parts.current[key] = el; };
  return (
    <section className="s-hero" id="top" ref={ref}>
      <div className="pin">
        <div className="hero-glow" ref={set('glow')} aria-hidden="true" />
        <h1 className="hero-title" aria-label="Rohit Kumar, full-stack developer">
          <span className="hero-word hero-back" ref={set('back')} aria-hidden="true">
            {'ROHIT'.split('').map((c, i) => <span key={i} style={{ '--i': i }}>{c}</span>)}
          </span>
          <span className="hero-word hero-front" ref={set('front')} aria-hidden="true">
            {'KUMAR'.split('').map((c, i) => <span key={i} style={{ '--i': i + 5 }}>{c}</span>)}
          </span>
        </h1>
        <img className="hero-portrait" ref={set('portrait')} src="/hero-silhouette.webp" alt="" width="1200" height="1100" fetchpriority="high" />
        <div className="hero-meta" ref={set('meta')}>
          <div className="hero-meta-left">
            <p className="hero-role">Full-Stack Developer</p>
            <p>B.Tech IT, VIT Vellore, class of 2027. Based in Gurugram, India.</p>
          </div>
          <div className="hero-meta-right">
            <p>I build web systems that people run their day on, and ship them to production. Open to internships and freelance work.</p>
            <div className="hero-actions">
              <a className="btn btn-solid" href="#work">See Shipped Work</a>
              <a className="btn btn-line" href={resumeUrl} target="_blank" rel="noreferrer">Résumé {Icon.external}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* Scene 2: a terminal over the system graph — it splits "whoami",     */
/* then grows until the window is the whole screen.                    */
/* ================================================================== */

const profileLines = [
  ['name', 'Rohit Kumar'],
  ['role', 'Full-stack developer'],
  ['based', 'Gurugram, India'],
  ['studying', 'B.Tech IT, VIT Vellore, 2023–2027'],
  ['shipped', '2 paid client systems, live in production'],
  ['research', '3 published Indian patent applications'],
  ['certified', 'AWS Cloud Practitioner'],
  ['status', 'Open to internships and freelance work'],
];

function Whoami({ reduced, narrow, onSelect }) {
  const ref = useRef(null);
  const parts = useRef({});
  const [typed, setTyped] = useState(reduced ? 6 : 0);
  const [expanded, setExpanded] = useState(reduced);

  useScene(ref, (p) => {
    const { win, chrome, left, right, world, about, prompt } = parts.current;
    if (!win) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const baseW = Math.min(narrow ? vw * 0.82 : 520, vw - 32);
    const baseH = narrow ? 230 : 300;
    const appear = easeOut(seg(p, 0, 0.14));
    const split = easeInOut(seg(p, 0.16, 0.44));
    const grow = easeInOut(seg(p, 0.46, 0.74));
    const w = lerp(baseW * (0.86 + appear * 0.14), vw, grow);
    const h = lerp(baseH * (0.86 + appear * 0.14), vh, grow);
    const r = lerp(18, 0, grow);
    const insetX = (vw - w) / 2;
    const insetY = (vh - h) / 2;
    win.style.clipPath = `inset(${insetY}px ${insetX}px ${insetY}px ${insetX}px round ${r}px)`;
    win.style.opacity = String(appear);
    chrome.style.transform = `translate3d(${insetX}px, ${insetY}px, 0)`;
    chrome.style.width = `${w}px`;
    chrome.style.opacity = String(appear * (1 - seg(p, 0.66, 0.74)));
    const spread = split * (narrow ? 0.34 : 0.4) * vw;
    left.style.transform = `translate3d(${-spread}px, 0, 0)`;
    right.style.transform = `translate3d(${spread}px, 0, 0)`;
    const wordsOut = 1 - seg(p, 0.5, 0.66);
    left.style.opacity = String(appear * wordsOut);
    right.style.opacity = String(appear * wordsOut);
    left.style.filter = `blur(${(1 - wordsOut) * 18}px)`;
    right.style.filter = `blur(${(1 - wordsOut) * 18}px)`;
    world.style.opacity = String(1 - grow * 0.9);
    world.style.transform = `scale(${1 + grow * 0.12})`;
    prompt.style.opacity = String(1 - seg(p, 0.6, 0.72));
    about.style.opacity = String(seg(p, 0.72, 0.82));
    about.style.transform = `translate3d(0, ${(1 - seg(p, 0.72, 0.86)) * 40}px, 0)`;
    setTyped(Math.round(seg(p, 0.18, 0.42) * 6));
    setExpanded(p > 0.74);
  }, !reduced);

  const set = (key) => (el) => { parts.current[key] = el; };
  return (
    <section className={`s-who ${reduced ? 'is-static' : ''} ${expanded ? 'is-expanded' : ''}`} id="about" ref={ref}>
      <div className="pin">
        <div className="who-world" ref={set('world')}>
          <SystemGraph onSelect={onSelect} reduced={reduced} />
        </div>
        <div className="who-words" aria-hidden="true">
          <span ref={set('left')}>who</span>
          <span ref={set('right')}>ami</span>
        </div>
        <div className="who-chrome" ref={set('chrome')} aria-hidden="true">
          <i /><i /><i /><span>rohit@ship-log: ~</span>
        </div>
        <div className="who-window" ref={set('win')}>
          <p className="who-prompt" ref={set('prompt')} aria-hidden="true">
            <span className="t-prompt">~ $</span> {'whoami'.slice(0, typed)}<span className="caret" />
          </p>
          <div className="who-about" ref={set('about')}>
            <div className="who-statement">
              <h2>I turn messy, real-world workflows into web systems people use every day.</h2>
              <p>Classrooms that take attendance in real time. A salon that takes bookings while the owner works. Fare data at a scale that needs Spark. I like the whole path: the first requirements call, the data model, the API, the screens, and the deploy.</p>
            </div>
            <dl className="who-output">
              <p className="who-cmd"><span className="t-prompt">~ $</span> whoami --verbose</p>
              {profileLines.map(([key, value], i) => (
                <div key={key}>
                  <dt>{key}</dt>
                  <dd><Scramble text={value} play={expanded} delay={i * 70} /></dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* Scene 3: ship log — a pinned horizontal commit history              */
/* ================================================================== */

const hashOf = (text) => {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(16).padStart(8, '0').slice(0, 7);
};

function ShipLog({ reduced }) {
  const ref = useRef(null);
  const track = useRef(null);
  const ghost = useRef(null);
  const rail = useRef(null);
  const panels = useRef([]);
  const last = useRef(0);
  const [travel, setTravel] = useState(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduced) return undefined;
    const measure = () => setTravel(Math.max(0, track.current.scrollWidth - window.innerWidth));
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [reduced]);

  useScene(ref, (_, { visible, rect }) => {
    if (!visible || !track.current) return;
    const p = travel > 0 ? clamp(-rect.top / travel) : 0;
    const x = -p * travel;
    const velocity = clamp((p - last.current) * 60, -1, 1);
    last.current = p;
    track.current.style.transform = `translate3d(${x}px, 0, 0) skewX(${velocity * -6}deg)`;
    ghost.current.style.transform = `translate3d(${x * 0.35}px, 0, 0)`;
    rail.current.style.transform = `scaleX(${p})`;
    const center = window.innerWidth / 2;
    let best = 0;
    let bestD = Infinity;
    panels.current.forEach((panel, i) => {
      if (!panel) return;
      const box = panel.getBoundingClientRect();
      const d = (box.left + box.width / 2 - center) / window.innerWidth;
      const ad = Math.abs(d);
      if (ad < bestD) { bestD = ad; best = i; }
      const head = panel.firstElementChild;
      panel.style.opacity = String(1 - clamp(ad * 1.1, 0, 0.75));
      head.style.filter = `blur(${clamp(ad - 0.12, 0, 1) * 14}px)`;
      head.style.transform = `translate3d(${d * -80}px, 0, 0)`;
      head.style.textShadow = Math.abs(velocity) > 0.05
        ? `${velocity * 10}px 0 rgba(43,179,154,.55), ${velocity * -10}px 0 rgba(236,237,238,.25)`
        : 'none';
    });
    setActive(best);
    /* once scrolling stops, run one more frame so the smear settles to sharp */
    if (Math.abs(velocity) > 0.001) setTimeout(request, 90);
  }, !reduced);

  return (
    <section className={`s-log ${reduced ? 'is-static' : ''}`} id="log" ref={ref} style={{ height: reduced ? 'auto' : `calc(200vh + ${travel}px)` }}>
      <div className="pin">
        <p className="log-label"><span className="t-prompt">~ $</span> git log --graph --reverse</p>
        <div className="log-ghost" ref={ghost} aria-hidden="true">SHIPPING SINCE 2021 / SHIPPING SINCE 2021</div>
        <ol className="log-track" ref={track}>
          {shipLog.map((entry, i) => (
            <li className={`log-panel ${i === active ? 'is-active' : ''}`} key={entry.title} ref={(el) => { panels.current[i] = el; }}>
              <h3 className="log-title">{entry.title}</h3>
              <div className="log-meta">
                <span className="log-hash" translate="no">{hashOf(entry.title)}</span>
                <span className={`log-type t-${entry.type}`} translate="no">{entry.type}</span>
                <span className="log-date">{entry.date}</span>
              </div>
              <p className="log-body">{entry.body}</p>
            </li>
          ))}
        </ol>
        <div className="log-graph" aria-hidden="true">
          <span className="log-graph-line"><i ref={rail} /></span>
          {shipLog.map((entry, i) => <span key={entry.title} className={`log-dot ${i <= active ? 'is-on' : ''}`} style={{ left: `${(i / (shipLog.length - 1)) * 100}%` }} />)}
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* Scene 4: shipped work on a concave 3D strip                         */
/* ================================================================== */

function Work({ reduced, narrow, focusRef }) {
  const ref = useRef(null);
  const ring = useRef(null);
  const cards = useRef([]);
  const [active, setActive] = useState(0);
  const count = workCards.length;
  const stepDeg = narrow ? 34 : 26;

  useScene(ref, (p) => {
    if (!ring.current) return;
    const vw = window.innerWidth;
    const cardW = narrow ? vw * 0.76 : Math.min(vw * 0.42, 720);
    const step = (stepDeg * Math.PI) / 180;
    const radius = (cardW / 2) / Math.tan(step / 2) * 1.04;
    const settle = easeOut(seg(p, 0, 0.12));
    const R = lerp(radius * 4, radius, settle);
    const travel = seg(p, 0.1, 0.92);
    const index = travel * (count - 1);
    const angle = index * stepDeg;
    ring.current.style.transform = `translate3d(0,0,${R}px) rotateY(${angle}deg)`;
    cards.current.forEach((card, i) => {
      if (!card) return;
      const rel = i * stepDeg - angle;
      card.style.transform = `rotateY(${-i * stepDeg}deg) translate3d(0,0,${-R}px)`;
      card.style.width = `${cardW}px`;
      card.style.marginLeft = `${-cardW / 2}px`;
      card.style.marginTop = `${-cardW * 0.3125}px`;
      const fade = 1 - seg(Math.abs(rel), stepDeg * 1.6, stepDeg * 2.6);
      card.style.opacity = String(fade * (0.35 + settle * 0.65));
      card.style.visibility = fade <= 0 ? 'hidden' : 'visible';
      card.style.filter = `brightness(${1 - clamp(Math.abs(rel) / (stepDeg * 3), 0, 0.45)})`;
    });
    setActive(clamp(Math.round(index), 0, count - 1));
  }, !reduced);

  /* lets the graph and the palette jump straight to a project */
  focusRef.current = (projectId) => {
    const i = workCards.findIndex((card) => card.project === projectId);
    const el = ref.current;
    if (i < 0 || !el) return;
    const travel = el.offsetHeight - window.innerHeight;
    const p = 0.1 + (i / (count - 1)) * 0.82;
    window.scrollTo({ top: el.offsetTop + travel * p, behavior: reduced ? 'auto' : 'smooth' });
  };

  const card = workCards[active];
  const project = projects.find((item) => item.id === card.project);
  return (
    <section className={`s-work ${reduced ? 'is-static' : ''}`} id="work" ref={ref}>
      <div className="pin">
        <div className="work-stage">
          <div className="work-ring" ref={ring}>
            {workCards.map((item, i) => (
              <figure className="work-card" key={item.image} ref={(el) => { cards.current[i] = el; }}>
                <img src={item.image} alt={item.label} width="1280" height="800" loading={i < 2 ? 'eager' : 'lazy'} />
              </figure>
            ))}
          </div>
        </div>
        <div className="work-caption" aria-live="polite">
          <p className="work-count">{String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</p>
          <h3>{project.name}</h3>
          <p className="work-type">{card.label.split(', ')[1]} <span>{project.stack.join(', ')}</span></p>
          <p className="work-desc">{project.description}</p>
          <div className="work-links">
            {project.links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label} {Icon.external}</a>)}
          </div>
        </div>
        <h2 className="work-title">Shipped Work</h2>
      </div>
    </section>
  );
}

/* ================================================================== */
/* Scene 5: stack ring                                                 */
/* ================================================================== */

function Stack({ reduced, narrow }) {
  const ref = useRef(null);
  const ring = useRef(null);
  const [active, setActive] = useState(0);
  const n = stackGroups.length;
  const step = 360 / n;

  useScene(ref, (p) => {
    if (!ring.current) return;
    const rise = easeOut(seg(p, 0, 0.18));
    const spin = seg(p, 0.15, 0.95) * (n - 1);
    ring.current.style.transform = `translate3d(0, ${(1 - rise) * 30}vh, 0) rotate(${-spin * step}deg) scale(${0.8 + rise * 0.2})`;
    ring.current.style.opacity = String(rise);
    setActive(clamp(Math.round(spin), 0, n - 1));
  }, !reduced);

  const group = stackGroups[active];
  return (
    <section className={`s-stack ${reduced ? 'is-static' : ''}`} id="stack" ref={ref}>
      <div className="pin">
        <h2 className="stack-title">The Stack</h2>
        <div className="stack-stage">
          <div className="stack-ring" ref={ring} style={{ '--r': narrow ? '34vw' : '15.5rem' }}>
            {stackGroups.map((item, i) => (
              <div className={`stack-card ${i === active ? 'is-active' : ''}`} key={item.name} style={{ '--a': `${i * step}deg` }}>
                <div className="stack-face">
                  <span className="stack-name">{item.name}</span>
                  <span className="stack-num">{item.items.length} {item.items.length === 1 ? 'tool' : 'tools'}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="stack-center" aria-live="polite">
            <p className="stack-group">{group.name}</p>
            <ul>{group.items.map((tool) => <li key={tool}>{tool}</li>)}</ul>
          </div>
        </div>
        <ul className="stack-list">
          {stackGroups.map((item) => <li key={item.name}><strong>{item.name}</strong> {item.items.join(', ')}</li>)}
        </ul>
        <ol className="stack-index">
          {stackGroups.map((item, i) => <li key={item.name} className={i === active ? 'is-active' : ''}>{item.name}</li>)}
        </ol>
      </div>
    </section>
  );
}

/* ================================================================== */
/* Scene 6: research                                                   */
/* ================================================================== */

function ResearchRow({ title, index }) {
  const ref = useRef(null);
  const seen = useOnce(ref, 0.6);
  return (
    <li ref={ref} className={`research-row ${seen ? 'is-in' : ''}`} style={{ '--d': `${index * 120}ms` }}>
      <p>{title}</p>
      <span>Published Indian patent application</span>
    </li>
  );
}

function Research() {
  return (
    <section className="s-research" id="research">
      <div className="research-head">
        <h2>Research</h2>
        <p>Co-inventor on 3 published Indian patent applications exploring adaptive AI, behavioral risk analysis, and interpretable language models.</p>
      </div>
      <ol className="research-list">
        {patents.map((title, i) => <ResearchRow key={title} title={title} index={i} />)}
      </ol>
    </section>
  );
}

/* ================================================================== */
/* Scene 7: the page lifts away to reveal "Let's build"                */
/* ================================================================== */

function Contact({ reduced }) {
  const ref = useRef(null);
  const word = useRef(null);
  const [state, setState] = useState({ phase: 'idle', email: '' });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (reduced) return undefined;
    const run = () => {
      const el = ref.current;
      if (!el || !word.current) return;
      const doc = document.documentElement.scrollHeight;
      const q = clamp((window.scrollY + window.innerHeight - (doc - el.offsetHeight)) / el.offsetHeight);
      const e = easeOut(q);
      word.current.style.filter = `blur(${(1 - e) * 22}px)`;
      word.current.style.transform = `translate3d(0, ${(1 - e) * 14}vh, 0) scaleY(${1 + (1 - e) * 0.6})`;
      word.current.style.opacity = String(0.15 + e * 0.85);
    };
    runners.add(run);
    run();
    return () => { runners.delete(run); };
  }, [reduced]);

  const sendMessage = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const values = Object.fromEntries(new FormData(formElement).entries());
    setState({ phase: 'sending', email: values.email });
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error('Message could not be sent.');
      formElement.reset();
      setState({ phase: 'sent', email: values.email });
    } catch {
      setState({ phase: 'error', email: values.email });
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <footer
      className="s-contact"
      id="contact"
      ref={ref}
      onFocusCapture={() => {
        const bottom = document.documentElement.scrollHeight - window.innerHeight;
        if (window.scrollY < bottom - 4) window.scrollTo({ top: bottom, behavior: 'auto' });
      }}
    >
      <div className="contact-inner">
        <div className="contact-left">
          <h2 className="contact-word" ref={word}>Let&rsquo;s Build</h2>
          <p className="contact-lead">Hiring for an internship or a role, or need a web system built? Send a message and I&rsquo;ll reply within a day.</p>
          <div className="contact-pills">
            <button className="pill" onClick={copyEmail}>{Icon.mail} {copied ? 'Email Copied' : email}</button>
            <a className="pill" href={`tel:${phone.replace(/\s/g, '')}`}>{Icon.phone} {phone}</a>
            <a className="pill" href={linkedinUrl} target="_blank" rel="noreferrer">{Icon.linkedin} LinkedIn</a>
            <a className="pill" href={githubUrl} target="_blank" rel="noreferrer">{Icon.github} GitHub</a>
            <a className="pill pill-solid" href={resumeUrl} target="_blank" rel="noreferrer">Résumé {Icon.external}</a>
          </div>
        </div>
        <form className="contact-form" onSubmit={sendMessage}>
          <label><span>Your Name</span><input name="name" required minLength="2" autoComplete="name" placeholder="Priya Sharma…" /></label>
          <label><span>Email</span><input name="email" type="email" inputMode="email" required autoComplete="email" spellCheck={false} placeholder="priya@company.com…" /></label>
          <label><span>Message</span><textarea name="message" required minLength="10" rows="4" autoComplete="off" placeholder="We’re hiring a full-stack intern for…" /></label>
          <div className="form-foot">
            <button className="btn btn-solid" type="submit" disabled={state.phase === 'sending'}>{state.phase === 'sending' ? 'Sending…' : 'Send Message'}</button>
            <p className={`form-status is-${state.phase}`} role="status">
              {state.phase === 'sent' && `Message sent. I’ll reply to ${state.email}.`}
              {state.phase === 'error' && 'Message not sent: the server didn’t respond. Try again in a minute, or email me directly.'}
            </p>
          </div>
        </form>
      </div>
      <div className="contact-bottom">
        <p>&copy; {new Date().getFullYear()} Rohit Kumar</p>
        <a href="#top">Back to Top</a>
      </div>
    </footer>
  );
}

/* ================================================================== */
/* Page                                                                */
/* ================================================================== */

function App() {
  const reduced = useReducedMotion();
  const narrow = useNarrow();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const focusWork = useRef(() => {});

  const goTo = useCallback((hash) => {
    document.querySelector(hash)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }, [reduced]);

  const openProject = useCallback((id) => {
    if (id === 'research') { goTo('#research'); return; }
    focusWork.current(id);
  }, [goTo]);

  const actions = useMemo(() => [
    ...projects.map((project) => ({ label: project.name, hint: project.type, run: () => openProject(project.id) })),
    { label: 'About', hint: 'whoami', run: () => goTo('#about') },
    { label: 'Ship Log', hint: 'Timeline', run: () => goTo('#log') },
    { label: 'Stack', hint: 'Tools by area', run: () => goTo('#stack') },
    { label: 'Research', hint: 'Patent applications', run: () => goTo('#research') },
    { label: 'Contact', hint: 'Send a message', run: () => goTo('#contact') },
    { label: 'Résumé', hint: 'Opens in a new tab', run: () => window.open(resumeUrl, '_blank', 'noopener') },
    { label: 'GitHub', hint: 'github.com/rohitpawalia28', run: () => window.open(githubUrl, '_blank', 'noopener') },
    { label: 'LinkedIn', hint: 'Profile', run: () => window.open(linkedinUrl, '_blank', 'noopener') },
    { label: 'Copy email address', hint: email, run: () => navigator.clipboard?.writeText(email) },
  ], [goTo, openProject]);

  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => { request(); }, [narrow, reduced]);

  return (
    <div className={reduced ? 'rm' : ''}>
      <a className="skip" href="#work">Skip to Shipped Work</a>
      <Nav onSearch={() => setPaletteOpen(true)} />
      <main>
        <Hero reduced={reduced} />
        <Whoami reduced={reduced} narrow={narrow} onSelect={openProject} />
        <ShipLog reduced={reduced} />
        <Work reduced={reduced} narrow={narrow} focusRef={focusWork} />
        <Stack reduced={reduced} narrow={narrow} />
        <Research />
      </main>
      <Contact reduced={reduced} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} actions={actions} />
    </div>
  );
}

export default App;
