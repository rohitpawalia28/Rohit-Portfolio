import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { email, githubUrl, linkedinUrl, phone, projectDetails, projects, research, resumeUrl, shipLog, stackGroups, workCards } from './content';
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
  { label: 'Journey', href: '#log' },
  { label: 'Work', href: '#work' },
  { label: 'Stack', href: '#stack' },
  { label: 'Research', href: '#research' },
  { label: 'Contact', href: '#contact' },
];

function Nav({ onSearch }) {
  const [open, setOpen] = useState(false);
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);
  return (
    <header className={`nav ${open ? 'is-open' : ''}`}>
      <a className="nav-mark" href="#top" translate="no" onClick={() => setOpen(false)}><i aria-hidden="true" />Rohit Kumar</a>
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
        <h1 className="hero-title" aria-label="Rohit Kumar, software developer">
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
            <p className="hero-role">Software Developer</p>
            <p>Based in Gurugram, India</p>
          </div>
          <div className="hero-meta-right">
            <a className="btn btn-solid" href={resumeUrl} target="_blank" rel="noreferrer">Résumé {Icon.external}</a>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* Scene 2: a terminal splits "whoami", then grows to fill the screen  */
/* ================================================================== */

const profileLines = [
  ['name', 'Rohit Kumar'],
  ['role', 'Software developer'],
  ['based', 'Gurugram, India'],
  ['studying', 'B.Tech IT, VIT Vellore, 2023–2027'],
  ['shipped', '2 paid client systems, live in production'],
  ['research', '3 published Indian patent applications'],
  ['certified', 'MongoDB Vector Search'],
  ['status', 'Open to internships and freelance work'],
];

/* the window starts a shade lighter than the page and settles into it */
const WIN_FROM = [27, 30, 34];
const WIN_TO = [14, 16, 18];

function Whoami({ reduced, narrow }) {
  const ref = useRef(null);
  const parts = useRef({});
  const [typed, setTyped] = useState(reduced ? 6 : 0);
  const [expanded, setExpanded] = useState(reduced);

  useScene(ref, (p, { rect }) => {
    const { win, chrome, left, right, about, prompt } = parts.current;
    if (!win) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const baseW = Math.min(narrow ? vw * 0.82 : 520, vw - 32);
    const baseH = narrow ? 230 : 300;
    /* the terminal arrives while the sheet is still sliding up, so the screen is never empty */
    const appear = easeOut(seg(clamp(1 - rect.top / vh), 0.25, 0.85));
    const split = easeInOut(seg(p, 0, 0.3));
    const grow = easeInOut(seg(p, 0.3, 0.6));
    const w = lerp(baseW * (0.86 + appear * 0.14), vw, grow);
    const h = lerp(baseH * (0.86 + appear * 0.14), vh, grow);
    const r = lerp(18, 0, grow);
    const insetX = (vw - w) / 2;
    const insetY = (vh - h) / 2;
    win.style.clipPath = `inset(${insetY}px ${insetX}px ${insetY}px ${insetX}px round ${r}px)`;
    win.style.opacity = String(appear);
    win.style.backgroundColor = `rgb(${WIN_FROM.map((c, i) => Math.round(lerp(c, WIN_TO[i], grow))).join(',')})`;
    chrome.style.transform = `translate3d(${insetX}px, ${insetY}px, 0)`;
    chrome.style.width = `${w}px`;
    chrome.style.opacity = String(appear * (1 - seg(p, 0.52, 0.6)));
    const spread = split * (narrow ? 0.34 : 0.4) * vw;
    left.style.transform = `translate3d(${-spread}px, 0, 0)`;
    right.style.transform = `translate3d(${spread}px, 0, 0)`;
    const wordsOut = 1 - seg(p, 0.36, 0.52);
    left.style.opacity = String(appear * wordsOut);
    right.style.opacity = String(appear * wordsOut);
    left.style.filter = `blur(${(1 - wordsOut) * 18}px)`;
    right.style.filter = `blur(${(1 - wordsOut) * 18}px)`;
    prompt.style.opacity = String(1 - seg(p, 0.46, 0.58));
    about.style.opacity = String(seg(p, 0.58, 0.7));
    about.style.transform = `translate3d(0, ${(1 - seg(p, 0.58, 0.74)) * 40}px, 0)`;
    setTyped(Math.round(clamp(seg(clamp(1 - rect.top / vh), 0.6, 1) * 0.5 + seg(p, 0, 0.26) * 0.5) * 6));
    setExpanded(p > 0.6);
  }, !reduced);

  const set = (key) => (el) => { parts.current[key] = el; };
  return (
    <section className={`s-who ${reduced ? 'is-static' : ''} ${expanded ? 'is-expanded' : ''}`} id="about" ref={ref}>
      <div className="pin">
        <div className="who-words" aria-hidden="true">
          <span ref={set('left')}>who</span>
          <span ref={set('right')}>ami</span>
        </div>
        <div className="who-chrome" ref={set('chrome')} aria-hidden="true">
          <i /><i /><i /><span>rohit@portfolio: ~</span>
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
/* Scene 3: ship log — a pinned horizontal timeline                    */
/* ================================================================== */

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
        <p className="log-label">The Journey So Far</p>
        <div className="log-ghost" aria-hidden="true" ref={ghost}>BUILDING SINCE 2021 / BUILDING SINCE 2021</div>
        <ol className="log-track" ref={track}>
          {shipLog.map((entry, i) => (
            <li className={`log-panel ${i === active ? 'is-active' : ''}`} key={entry.title} ref={(el) => { panels.current[i] = el; }}>
              <h3 className="log-title">{entry.title}</h3>
              <p className={`log-date ${entry.type === 'next' ? 'is-next' : ''}`}>{entry.date}</p>
              <p className="log-body">{entry.body}</p>
              {entry.href && <a className="log-link" href={entry.href} target="_blank" rel="noreferrer">View Credential {Icon.external}</a>}
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
/* Scene 4: shipped work on a concave 3D ring. The sheet brightens as  */
/* it rises, so dark eases into paper instead of snapping.             */
/* ================================================================== */

const projectHref = (id) => `#/projects/${id}`;
const primaryLink = (project, go) => project.links.find((link) => (go === 'live' ? /live/i : /code/i).test(link.label)) || project.links[0];

function Work({ reduced, narrow, focusRef }) {
  const ref = useRef(null);
  const ring = useRef(null);
  const cards = useRef([]);
  const hit = useRef(null);
  const [active, setActive] = useState(0);
  const count = workCards.length;
  const stepDeg = narrow ? 40 : 30;

  useScene(ref, (p, { rect, el }) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    el.style.setProperty('--tone', easeInOut(clamp(1 - rect.top / vh)).toFixed(3));
    if (!ring.current) return;
    const cardW = narrow ? Math.min(vw * 0.8, vh * 0.5) : Math.min(vw * 0.4, 640, vh * 0.6);
    const step = (stepDeg * Math.PI) / 180;
    const radius = (cardW / 2) / Math.tan(step / 2) * 1.04;
    const settle = easeOut(seg(p, 0, 0.1));
    const R = lerp(radius * 4, radius, settle);
    const index = seg(p, 0.08, 0.6) * (count - 1);
    const angle = index * stepDeg;
    ring.current.style.transform = `translate3d(0,0,${R}px) rotateY(${angle}deg)`;
    cards.current.forEach((card, i) => {
      if (!card) return;
      const rel = i * stepDeg - angle;
      card.style.transform = `rotateY(${-i * stepDeg}deg) translate3d(0,0,${-R}px)`;
      card.style.width = `${cardW}px`;
      card.style.marginLeft = `${-cardW / 2}px`;
      card.style.marginTop = `${-cardW * 0.3125}px`;
      const fade = 1 - seg(Math.abs(rel), stepDeg * 1.4, stepDeg * 2.4);
      card.style.opacity = String(fade * (0.35 + settle * 0.65));
      card.style.visibility = fade <= 0 ? 'hidden' : 'visible';
      card.style.filter = `brightness(${1 - clamp(Math.abs(rel) / (stepDeg * 3), 0, 0.45)})`;
    });
    const front = clamp(Math.round(index), 0, count - 1);
    setActive(front);
    /* pin the flat link to wherever the front card actually renders */
    const frontCard = cards.current[front];
    if (hit.current && frontCard) {
      const box = frontCard.getBoundingClientRect();
      const stage = hit.current.parentElement.getBoundingClientRect();
      const s2 = hit.current.style;
      s2.left = `${box.left - stage.left}px`;
      s2.top = `${box.top - stage.top}px`;
      s2.width = `${box.width}px`;
      s2.height = `${box.height}px`;
      s2.visibility = settle > 0.6 && Math.abs(index - front) < 0.3 ? 'visible' : 'hidden';
    }
  }, !reduced);

  /* lets the palette and the project pages jump straight to a card */
  focusRef.current = (projectId) => {
    const i = workCards.findIndex((card) => card.project === projectId);
    const el = ref.current;
    if (i < 0 || !el) return;
    const travel = el.offsetHeight - window.innerHeight;
    const p = 0.08 + (i / (count - 1)) * 0.52;
    window.scrollTo({ top: el.offsetTop + travel * p, behavior: 'auto' });
  };

  const card = workCards[active];
  const project = projects.find((item) => item.id === card.project);
  const activeLink = primaryLink(project, card.go);
  return (
    <section className={`s-work ${reduced ? 'is-static' : ''}`} id="work" ref={ref}>
      <div className="pin">
        <div className="work-head">
          <h2 className="work-title">Shipped Work</h2>
          <p>{count} projects. Click a screen to open it, or read the full story.</p>
        </div>
        <div className="work-stage">
          <div className="work-ring" ref={ring}>
            {workCards.map((item, i) => (
              <figure className="work-card" key={item.image} ref={(el) => { cards.current[i] = el; }}>
                <img src={item.image} alt={item.label} width="1280" height="800" loading={i < 2 ? 'eager' : 'lazy'} />
              </figure>
            ))}
          </div>
          {/* 3D hit testing is unreliable, so a flat link sits exactly over the front card */}
          <a className="work-hit" ref={hit} href={activeLink.href} target="_blank" rel="noreferrer" aria-label={`${project.name}: ${activeLink.label} (opens in a new tab)`}>
            <span className="work-card-tag" aria-hidden="true">{card.go === 'live' ? 'Visit Live Site' : 'Open on GitHub'} {Icon.external}</span>
          </a>
        </div>
        <div className="work-caption" aria-live="polite">
          <p className="work-count">{String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</p>
          <h3>{project.name}</h3>
          <p className="work-type">{project.type} <span>{project.stack.join(', ')}</span></p>
          <p className="work-desc">{project.description}</p>
          <div className="work-links">
            <a className="btn btn-ink" href={projectHref(project.id)}>Know More {Icon.arrow}</a>
            {project.links.map((link) => <a className="work-link" key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label} {Icon.external}</a>)}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* Scene 5: stack ring. At the end the sheet dims back to graphite so  */
/* research follows on without a hard edge.                            */
/* ================================================================== */

function Stack({ reduced, narrow }) {
  const ref = useRef(null);
  const ring = useRef(null);
  const [active, setActive] = useState(0);
  const n = stackGroups.length;
  const step = 360 / n;

  useScene(ref, (p) => {
    if (!ring.current) return;
    const rise = easeOut(seg(p, 0, 0.14));
    const spin = seg(p, 0.1, 0.6) * (n - 1);
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
          <div className="stack-ring" ref={ring} style={{ '--r': narrow ? '34vw' : 'min(14rem, 28vh)' }}>
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
/* Scene 6: research — three cards, each with its own live drawing    */
/* ================================================================== */

function Motif({ kind }) {
  if (kind === 'wave') {
    const line = (amp, phase, y0) => Array.from({ length: 41 }, (_, i) => {
      const x = i * 8;
      const y = y0 + Math.sin(i / 4 + phase) * amp + Math.sin(i / 1.7 + phase) * amp * 0.25;
      return `${i ? 'L' : 'M'}${x} ${y.toFixed(1)}`;
    }).join(' ');
    return (
      <svg className="motif motif-wave" viewBox="0 0 320 160" aria-hidden="true">
        <line className="m-threshold" x1="0" x2="320" y1="38" y2="38" />
        <path className="m-soft" d={line(14, 0.6, 104)} />
        <path className="m-soft" d={line(10, 2.2, 120)} />
        <path className="m-main" d={line(22, 1.2, 88)} pathLength="1" />
        <circle className="m-dot" r="5" cx="232" cy="52" />
      </svg>
    );
  }
  if (kind === 'rings') {
    return (
      <svg className="motif motif-rings" viewBox="0 0 320 160" aria-hidden="true">
        {[22, 42, 62, 82].map((r, i) => <circle key={r} className="m-ring" cx="160" cy="80" r={r} style={{ '--d': `${i * 0.6}s` }} />)}
        {[[160, 38], [212, 92], [118, 128], [96, 58], [236, 50], [190, 146]].map(([x, y], i) => <circle key={x} className="m-node" cx={x} cy={y} r="4" style={{ '--d': `${i * 0.4}s` }} />)}
        <circle className="m-core" cx="160" cy="80" r="7" />
      </svg>
    );
  }
  const nodes = [];
  for (let r = 0; r < 4; r += 1) for (let c = 0; c < 7; c += 1) nodes.push([28 + c * 44, 26 + r * 36, (r * 3 + c * 5) % 7]);
  return (
    <svg className="motif motif-lattice" viewBox="0 0 320 160" aria-hidden="true">
      {nodes.map(([x, y], i) => (i % 7 < 6 ? <line key={`h${i}`} className="m-edge" x1={x} y1={y} x2={x + 44} y2={y} /> : null))}
      {nodes.map(([x, y], i) => (i < 21 ? <line key={`v${i}`} className="m-edge" x1={x} y1={y} x2={x} y2={y + 36} /> : null))}
      {nodes.map(([x, y, k]) => <rect key={`${x}-${y}`} className={`m-cell ${k < 2 ? 'is-hot' : ''}`} x={x - 5} y={y - 5} width="10" height="10" rx="2" style={{ '--d': `${k * 0.35}s` }} />)}
    </svg>
  );
}

function ResearchCard({ item, index }) {
  const ref = useRef(null);
  const seen = useOnce(ref, 0.35);
  const tilt = (event) => {
    const el = ref.current;
    if (!el || event.pointerType !== 'mouse') return;
    const box = el.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width;
    const y = (event.clientY - box.top) / box.height;
    el.style.setProperty('--rx', `${(0.5 - y) * 8}deg`);
    el.style.setProperty('--ry', `${(x - 0.5) * 10}deg`);
    el.style.setProperty('--mx', `${x * 100}%`);
    el.style.setProperty('--my', `${y * 100}%`);
  };
  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };
  return (
    <li ref={ref} className={`research-card ${seen ? 'is-in' : ''}`} style={{ '--d': `${index * 140}ms` }} onPointerMove={tilt} onPointerLeave={reset}>
      <div className="research-art"><Motif kind={item.motif} /></div>
      <p className="research-field">{item.field}</p>
      <h3>{item.title}</h3>
      <p className="research-summary">{item.summary}</p>
      <p className="research-status"><i aria-hidden="true" /> Published Indian patent application</p>
    </li>
  );
}

function Research({ reduced }) {
  const ref = useRef(null);
  /* the sheet slides up over the stack and darkens as it rises */
  useScene(ref, (_, { rect, el }) => {
    el.style.setProperty('--tone', easeInOut(clamp(1 - rect.top / window.innerHeight)).toFixed(3));
  }, !reduced);
  return (
    <section className="s-research" id="research" ref={ref}>
      <div className="research-head">
        <h2>Research</h2>
        <div className="research-intro">
          <p className="research-big"><strong>3</strong> published patent applications</p>
          <p>As a co-inventor, exploring adaptive AI, behavioural risk analysis, and language models people can actually read.</p>
        </div>
      </div>
      <ol className="research-grid">
        {research.map((item, i) => <ResearchCard key={item.title} item={item} index={i} />)}
      </ol>
    </section>
  );
}

/* ================================================================== */
/* Scene 7: the page lifts away to reveal "Let's build"                */
/* ================================================================== */

const timeFormat = new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' });

function LocalTime() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 20000);
    return () => clearInterval(id);
  }, []);
  return <time dateTime={now.toISOString()}>{timeFormat.format(now)} IST</time>;
}

const BUILD_WORDS = ['Let’s', 'Build'];

function Contact({ reduced }) {
  const ref = useRef(null);
  const word = useRef(null);
  const letters = useRef([]);
  const [state, setState] = useState({ phase: 'idle' });
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

  /* each letter of "Let's Build" opens up, wide and light, as the cursor nears it */
  useEffect(() => {
    const footer = ref.current;
    if (reduced || !footer || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    let mx = -9999;
    let my = -9999;
    let frame = 0;
    const paint = () => {
      frame = 0;
      letters.current.forEach((el) => {
        if (!el) return;
        const box = el.getBoundingClientRect();
        const d = Math.hypot(box.left + box.width / 2 - mx, box.top + box.height / 2 - my);
        const t = clamp(1 - d / 380);
        const e = t * t * (3 - 2 * t);
        el.style.fontVariationSettings = `'wght' ${Math.round(lerp(800, 260, e))}, 'wdth' ${Math.round(lerp(75, 100, e))}, 'opsz' 96`;
      });
    };
    const move = (event) => { mx = event.clientX; my = event.clientY; if (!frame) frame = requestAnimationFrame(paint); };
    const leave = () => { mx = -9999; my = -9999; if (!frame) frame = requestAnimationFrame(paint); };
    footer.addEventListener('pointermove', move);
    footer.addEventListener('pointerleave', leave);
    return () => {
      footer.removeEventListener('pointermove', move);
      footer.removeEventListener('pointerleave', leave);
      cancelAnimationFrame(frame);
    };
  }, [reduced]);

  const sendMessage = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const values = Object.fromEntries(new FormData(formElement).entries());
    setState({ phase: 'sending' });
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error('Message could not be sent.');
      formElement.reset();
      setState({ phase: 'sent' });
    } catch {
      setState({ phase: 'error' });
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

  const spotlight = (event) => {
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--mx', `${event.clientX - box.left}px`);
    event.currentTarget.style.setProperty('--my', `${event.clientY - box.top}px`);
  };

  let letterIndex = 0;
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
          <p className="contact-status"><i aria-hidden="true" /> Open to internships and freelance work <span>Gurugram, <LocalTime /></span></p>
          <h2 className="contact-word" ref={word} aria-label="Let’s Build">
            {BUILD_WORDS.map((w) => (
              <span className="contact-word-part" key={w} aria-hidden="true">
                {w.split('').map((ch) => {
                  const i = letterIndex;
                  letterIndex += 1;
                  return <span key={i} className="cw-letter" style={{ '--i': i }} ref={(el) => { letters.current[i] = el; }}>{ch}</span>;
                })}
              </span>
            ))}
          </h2>
          <p className="contact-lead">Hiring for an internship or a role, or need a web system built? Send a message and I&rsquo;ll get back to you.</p>
          <div className="contact-pills">
            <button className="pill" onClick={copyEmail}>{Icon.mail} {copied ? 'Email Copied' : email}</button>
            <a className="pill" href={`tel:${phone.replace(/\s/g, '')}`}>{Icon.phone} {phone}</a>
            <a className="pill" href={linkedinUrl} target="_blank" rel="noreferrer">{Icon.linkedin} LinkedIn</a>
            <a className="pill" href={githubUrl} target="_blank" rel="noreferrer">{Icon.github} GitHub</a>
            <a className="pill pill-solid" href={resumeUrl} target="_blank" rel="noreferrer">Résumé {Icon.external}</a>
          </div>
        </div>
        <form className={`contact-form is-${state.phase}`} onSubmit={sendMessage} onPointerMove={spotlight}>
          <p className="form-title">Send a Message</p>
          <label><span>Your Name</span><input name="name" required minLength="2" autoComplete="name" placeholder="Priya Sharma…" /></label>
          <label><span>Email</span><input name="email" type="email" inputMode="email" required autoComplete="email" spellCheck={false} placeholder="priya@company.com…" /></label>
          <label><span>Message</span><textarea name="message" required minLength="10" rows="4" autoComplete="off" placeholder="We’re hiring a full-stack intern for…" /></label>
          <div className="form-foot">
            <button className="btn btn-light" type="submit" disabled={state.phase === 'sending'}>
              {state.phase === 'sending' ? 'Sending…' : state.phase === 'sent' ? <>Sent {Icon.check}</> : 'Send Message'}
            </button>
            <p className={`form-status is-${state.phase}`} role="status">
              {state.phase === 'sent' && 'Message sent. You’ll get a reply as soon as possible.'}
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
/* Project pages (#/projects/:id)                                      */
/* ================================================================== */

function Reveal({ children, className = '', as: Tag = 'div', delay = 0 }) {
  const ref = useRef(null);
  const seen = useOnce(ref, 0.2);
  return <Tag ref={ref} className={`reveal ${seen ? 'is-in' : ''} ${className}`} style={{ '--d': `${delay}ms` }}>{children}</Tag>;
}

function ProjectPage({ id }) {
  const project = projects.find((item) => item.id === id);
  const detail = projectDetails[id];
  const card = workCards.find((item) => item.project === id);
  const index = projects.findIndex((item) => item.id === id);
  const next = projects[(index + 1) % projects.length];

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${project.name} | Rohit Kumar`;
    return () => { document.title = 'Rohit Kumar | Software Developer'; };
  }, [project]);

  return (
    <main className="project-page" key={id}>
      <header className="pp-head">
        <a className="pp-back" href="#work">{Icon.back} All Work</a>
        <p className="pp-count">Project {String(index + 1).padStart(2, '0')} of {String(projects.length).padStart(2, '0')}</p>
        <h1 className="pp-title" aria-label={project.name}>{project.name.split(' ').map((w, i) => <span key={w} aria-hidden="true" style={{ '--i': i }}>{w}</span>)}</h1>
        <div className="pp-meta">
          <p><span>Type</span>{project.type}</p>
          <p><span>Role</span>{project.role}</p>
          <p><span>Year</span>{project.year}</p>
        </div>
      </header>

      <figure className="pp-hero">
        <img src={card.image} alt={card.label} width="1280" height="800" fetchpriority="high" />
      </figure>

      <section className="pp-body">
        <div className="pp-main">
          <Reveal>
            <h2>The Brief</h2>
            <p className="pp-lead">{detail.problem}</p>
          </Reveal>
          <Reveal>
            <h2>What I Built</h2>
            <ul className="pp-built">
              {detail.built.map((line) => <li key={line}>{line}</li>)}
            </ul>
          </Reveal>
          <Reveal>
            <h2>Outcome</h2>
            <p className="pp-lead">{detail.outcome}</p>
          </Reveal>
        </div>
        <aside className="pp-side">
          <p className="pp-side-label">Built With</p>
          <ul className="pp-chips">{project.stack.map((tool) => <li key={tool}>{tool}</li>)}</ul>
          <p className="pp-side-label">Links</p>
          <div className="pp-links">
            {project.links.map((link, i) => (
              <a key={link.href} className={`btn ${i === 0 ? 'btn-solid' : 'btn-line'}`} href={link.href} target="_blank" rel="noreferrer">{link.label} {Icon.external}</a>
            ))}
          </div>
        </aside>
      </section>

      <section className="pp-flow-wrap">
        <Reveal as="h2">How It Fits Together</Reveal>
        <ol className="pp-flow">
          {project.flow.map((step, i) => (
            <Reveal as="li" key={step.stage} delay={i * 120}>
              <span className="pp-flow-stage">{step.stage}</span>
              {step.items.map((item) => <span className="pp-flow-item" key={item}>{item}</span>)}
            </Reveal>
          ))}
        </ol>
      </section>

      {detail.gallery.length > 1 && (
        <section className="pp-gallery">
          <Reveal as="h2">Screens</Reveal>
          <div className="pp-gallery-grid">
            {detail.gallery.map((shot, i) => (
              <Reveal as="figure" key={shot.src} delay={i * 120}>
                <img src={shot.src} alt={shot.caption} width="1280" height="800" loading="lazy" />
                <figcaption>{shot.caption}</figcaption>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <a className="pp-next" href={projectHref(next.id)}>
        <span>Next Project</span>
        <strong>{next.name}</strong>
        {Icon.arrow}
      </a>
      <footer className="pp-foot">
        <p>&copy; {new Date().getFullYear()} Rohit Kumar</p>
        <a href="#contact">Get in Touch</a>
      </footer>
    </main>
  );
}

/* ================================================================== */
/* Page                                                                */
/* ================================================================== */

const readRoute = () => {
  const match = window.location.hash.match(/^#\/projects\/([\w-]+)/);
  return match && projects.some((item) => item.id === match[1]) ? match[1] : null;
};

function App() {
  const reduced = useReducedMotion();
  const narrow = useNarrow();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [route, setRoute] = useState(readRoute);
  const focusWork = useRef(() => {});
  const lastProject = useRef(null);

  useEffect(() => {
    const onHash = () => {
      const next = readRoute();
      setRoute((current) => {
        if (current && !next) lastProject.current = current;
        return next;
      });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  /* coming back from a project page: land on that project's card, or the section asked for */
  useEffect(() => {
    if (route) return;
    const hash = window.location.hash;
    const from = lastProject.current;
    lastProject.current = null;
    if (!from && !hash) return;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (hash === '#work' && from) focusWork.current(from);
      else if (hash === '#contact') window.scrollTo(0, document.documentElement.scrollHeight);
      else if (hash && hash.length > 1) document.querySelector(hash)?.scrollIntoView({ behavior: 'auto', block: 'start' });
      request();
    }));
  }, [route]);

  const goTo = useCallback((hash) => {
    if (readRoute()) { window.location.hash = hash; return; }
    if (hash === '#contact') { window.scrollTo({ top: document.documentElement.scrollHeight, behavior: reduced ? 'auto' : 'smooth' }); return; }
    document.querySelector(hash)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }, [reduced]);

  const actions = useMemo(() => [
    ...projects.map((project) => ({ label: project.name, hint: project.type, run: () => { window.location.hash = projectHref(project.id); } })),
    { label: 'About', hint: 'whoami', run: () => goTo('#about') },
    { label: 'Journey', hint: 'Timeline', run: () => goTo('#log') },
    { label: 'Shipped Work', hint: 'Projects', run: () => goTo('#work') },
    { label: 'Stack', hint: 'Tools by area', run: () => goTo('#stack') },
    { label: 'Research', hint: 'Patent applications', run: () => goTo('#research') },
    { label: 'Contact', hint: 'Send a message', run: () => goTo('#contact') },
    { label: 'Résumé', hint: 'Opens in a new tab', run: () => window.open(resumeUrl, '_blank', 'noopener') },
    { label: 'GitHub', hint: 'github.com/rohitpawalia28', run: () => window.open(githubUrl, '_blank', 'noopener') },
    { label: 'LinkedIn', hint: 'Profile', run: () => window.open(linkedinUrl, '_blank', 'noopener') },
    { label: 'Copy email address', hint: email, run: () => navigator.clipboard?.writeText(email) },
  ], [goTo]);

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

  useEffect(() => { request(); }, [narrow, reduced, route]);

  /* the contact sheet is fixed beneath the page, so its link scrolls to the very bottom */
  useEffect(() => {
    const onClick = (event) => {
      const link = event.target.closest?.('a[href="#contact"]');
      if (!link || readRoute()) return;
      event.preventDefault();
      goTo('#contact');
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [goTo]);

  return (
    <div className={reduced ? 'rm' : ''}>
      <a className="skip" href="#work">Skip to Shipped Work</a>
      <Nav onSearch={() => setPaletteOpen(true)} />
      {route ? <ProjectPage id={route} /> : (
        <>
          <main>
            <Hero reduced={reduced} />
            <Whoami reduced={reduced} narrow={narrow} />
            <ShipLog reduced={reduced} />
            <Work reduced={reduced} narrow={narrow} focusRef={focusWork} />
            <Stack reduced={reduced} narrow={narrow} />
            <Research reduced={reduced} />
          </main>
          <Contact reduced={reduced} />
        </>
      )}
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} actions={actions} />
    </div>
  );
}

export default App;
