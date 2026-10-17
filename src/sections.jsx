import { Fragment, useEffect, useRef, useState } from 'react';
import { education, email, experience, githubUrl, linkedinUrl, patents, phone, processSteps, projects, resumeUrl, toolkit } from './content';

/* ================================================================== */
/* Shared: run a callback once an element scrolls into view            */
/* ================================================================== */

function useInView(ref, { threshold = 0.35, once = true } = {}) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        if (once) observer.disconnect();
      } else if (!once) {
        setInView(false);
      }
    }, { threshold });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, threshold, once]);
  return inView;
}

const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ================================================================== */
/* Sweep: a heading whose letters sweep from thin to full weight       */
/* ================================================================== */

export function Sweep({ as: Tag = 'h2', children, className = '' }) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);
  const inView = useInView(ref, { threshold: 0.6 });

  useEffect(() => { if (!prefersReducedMotion()) setReady(true); }, []);

  let index = 0;
  const words = String(children).split(' ');
  return (
    <Tag ref={ref} className={`sweep ${ready ? 'is-ready' : ''} ${inView ? 'is-in' : ''} ${className}`} aria-label={String(children)}>
      {words.map((word, w) => (
        <Fragment key={w}>
          <span className="sweep-word" aria-hidden="true">
            {word.split('').map((char) => {
              index += 1;
              return <span className="ch" key={index} style={{ '--i': index }}>{char}</span>;
            })}
          </span>
          {w < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  );
}

/* ================================================================== */
/* Route rail: the page as a route, with a packet showing progress     */
/* ================================================================== */

const stops = [
  { id: 'top', label: 'Start' },
  { id: 'work', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'process', label: 'Process' },
  { id: 'about', label: 'About' },
  { id: 'research', label: 'Research' },
  { id: 'terminal', label: 'Terminal' },
  { id: 'contact', label: 'Contact' },
];

export function RouteRail() {
  const [state, setState] = useState({ progress: 0, active: 0, visible: false });

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      let active = 0;
      stops.forEach((stop, i) => {
        const element = document.getElementById(stop.id);
        if (element && element.getBoundingClientRect().top < window.innerHeight * 0.45) active = i;
      });
      setState({ progress, active, visible: window.scrollY > window.innerHeight * 0.6 });
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <>
      <div className="route-bar" aria-hidden="true"><i style={{ transform: `scaleX(${state.progress})` }} /></div>
      <nav className={`route ${state.visible ? 'is-visible' : ''}`} aria-label="Page sections">
        <span className="route-line" aria-hidden="true"><i style={{ transform: `scaleY(${state.progress})` }} /></span>
        <span className="route-packet" aria-hidden="true" style={{ top: `${state.progress * 100}%` }} />
        <ol>
          {stops.map((stop, i) => (
            <li key={stop.id} className={`${i === state.active ? 'is-active' : ''} ${i < state.active ? 'is-passed' : ''}`}>
              <a href={`#${stop.id}`} aria-current={i === state.active ? 'location' : undefined}>
                <span className="route-dot" aria-hidden="true" />
                <span className="route-label">{stop.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

/* ================================================================== */
/* Flow diagram inside each case: how data moves through the project   */
/* ================================================================== */

export function FlowDiagram({ flow }) {
  return (
    <ol className="flow" aria-label="How it works">
      {flow.map((column, i) => (
        <li className="flow-step" key={column.stage} style={{ '--k': i }}>
          <span className="flow-stage">{column.stage}</span>
          <div className="flow-items">
            {column.items.map((item) => <span className="flow-item" key={item}>{item}</span>)}
          </div>
          {i < flow.length - 1 && <span className="flow-link" aria-hidden="true"><i /></span>}
        </li>
      ))}
    </ol>
  );
}

/* ================================================================== */
/* Process story: a pinned section that builds a system as you scroll  */
/* ================================================================== */

const people = [{ x: 104, label: 'Admin', initial: 'A' }, { x: 262, label: 'Teacher', initial: 'T' }, { x: 420, label: 'Student', initial: 'S' }];
const screens = ['Admin panel', 'Teacher view', 'Student app'];
const collections = ['Users', 'Attendance', 'Marks', 'Timetable'];
const collectionX = [76, 197, 318, 439];
const packetPaths = [
  'M104 82 L104 300 L197 300 L197 418',
  'M262 82 L262 300 L318 300 L318 418',
  'M420 82 L420 300 L439 300 L439 418',
  'M76 418 L76 300 L262 300 L262 82',
];

function ProcessDiagram({ active, reduced }) {
  const on = (step) => (active >= step ? 'layer is-on' : 'layer');
  return (
    <svg className="process-diagram" viewBox="0 0 520 520" role="img" aria-label="Diagram of a client system being built: people, data, API, screens, and production">
      {/* step 5: production frame */}
      <g className={on(4)}>
        <rect x="8" y="18" width="504" height="490" rx="22" className="d-frame" />
        <rect x="26" y="6" width="150" height="26" rx="13" className="d-chip" />
        <text x="101" y="23" textAnchor="middle" className="d-chip-text">Live in production</text>
      </g>

      {/* step 4: screens and their wiring */}
      <g className={on(3)}>
        {people.map((person) => <line key={person.label} x1={person.x} y1="82" x2={person.x} y2="150" className="d-wire" />)}
        {people.map((person) => <line key={`${person.label}-api`} x1={person.x} y1="200" x2={person.x} y2="266" className="d-wire" />)}
        {people.map((person, i) => (
          <g key={screens[i]}>
            <rect x={person.x - 62} y="150" width="124" height="50" rx="10" className="d-screen" />
            <rect x={person.x - 62} y="150" width="124" height="12" rx="6" className="d-screen-bar" />
            <text x={person.x} y="186" textAnchor="middle">{screens[i]}</text>
          </g>
        ))}
      </g>

      {/* step 3: API */}
      <g className={on(2)}>
        {collectionX.map((x) => <line key={x} x1={x} y1="336" x2={x} y2="418" className="d-wire" />)}
        <rect x="40" y="266" width="440" height="70" rx="14" className="d-api" />
        <text x="62" y="294" className="d-api-title">Node + Express API</text>
        {['/auth', '/attendance', '/marks', '/timetable'].map((route, i) => (
          <g key={route}>
            <rect x={62 + i * 100} y="306" width="88" height="20" rx="6" className="d-route" />
            <text x={106 + i * 100} y="320" textAnchor="middle" className="d-route-text">{route}</text>
          </g>
        ))}
        <rect x="350" y="252" width="118" height="26" rx="13" className="d-live" />
        <text x="409" y="269" textAnchor="middle" className="d-live-text">Socket.IO live</text>
      </g>

      {/* step 2: data */}
      <g className={on(1)}>
        {collections.map((name, i) => (
          <g key={name}>
            <rect x={collectionX[i] - 54} y="418" width="108" height="56" rx="10" className="d-data" />
            <ellipse cx={collectionX[i]} cy="418" rx="54" ry="8" className="d-data-top" />
            <text x={collectionX[i]} y="454" textAnchor="middle">{name}</text>
          </g>
        ))}
        <text x="260" y="498" textAnchor="middle" className="d-caption">MongoDB collections</text>
      </g>

      {/* step 1: people */}
      <g className={on(0)}>
        {people.map((person) => (
          <g key={person.label}>
            <circle cx={person.x} cy="62" r="20" className="d-person" />
            <text x={person.x} y="67" textAnchor="middle" className="d-person-initial">{person.initial}</text>
            <text x={person.x + 28} y="67" className="d-person-label">{person.label}</text>
          </g>
        ))}
      </g>

      {active >= 4 && !reduced && packetPaths.map((path, i) => (
        <circle key={path} r="5.5" className="d-packet">
          <animateMotion dur="2.6s" begin={`${i * 0.55}s`} repeatCount="indefinite" path={path} />
        </circle>
      ))}
    </svg>
  );
}

export function ProcessStory() {
  const sectionRef = useRef(null);
  const [state, setState] = useState({ active: 0, within: 0 });
  const reduced = prefersReducedMotion();

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = sectionRef.current.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const progress = travel > 0 ? Math.min(0.9999, Math.max(0, -rect.top / travel)) : 0;
      const scaled = progress * processSteps.length;
      setState({ active: Math.floor(scaled), within: scaled % 1 });
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const jump = (step) => {
    const section = sectionRef.current;
    const travel = section.offsetHeight - window.innerHeight;
    const top = section.getBoundingClientRect().top + window.scrollY + ((step + 0.35) / processSteps.length) * travel;
    window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <section className="process" id="process" ref={sectionRef} style={{ '--steps': processSteps.length }}>
      <div className="process-sticky">
        <div className="process-copy">
          <Sweep>How I ship a client system</Sweep>
          <p className="process-intro">Scroll to watch one get built, using ACE Academy as the example.</p>
          <ol className="process-steps">
            {processSteps.map((step, i) => (
              <li key={step.title} className={`${i === state.active ? 'is-active' : ''} ${i < state.active ? 'is-done' : ''}`}>
                <button onClick={() => jump(i)} aria-current={i === state.active ? 'step' : undefined}>
                  <span className="process-num">{i + 1}</span>
                  <span className="process-title">{step.title}</span>
                </button>
                <div className="process-detail">
                  <div>
                    <p>{step.text}</p>
                    <span className="process-meter" aria-hidden="true"><i style={{ transform: `scaleX(${i === state.active ? state.within : i < state.active ? 1 : 0})` }} /></span>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="process-visual">
          <ProcessDiagram active={state.active} reduced={reduced} />
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* Terminal: for visitors who would rather type                        */
/* ================================================================== */

const commandList = ['help', 'whoami', 'projects', 'open <project>', 'experience', 'stack', 'patents', 'education', 'contact', 'resume', 'hire', 'clear'];

function respond(raw, { onOpenProject, onGoTo }) {
  const input = raw.trim();
  const [command, ...rest] = input.split(/\s+/);
  const arg = rest.join(' ').toLowerCase();
  const lower = input.toLowerCase();

  if (!input) return [];
  if (lower === 'hire' || lower === 'hire rohit' || lower === 'sudo hire rohit') {
    setTimeout(() => onGoTo('#contact'), 900);
    return [{ text: 'Opening the contact form…', tone: 'ok' }];
  }

  switch (command.toLowerCase()) {
    case 'help':
      return [{ text: 'Available commands:', tone: 'head' }, ...commandList.map((name) => ({ text: `  ${name}` }))];
    case 'whoami':
      return [
        { text: 'Rohit Kumar', tone: 'head' },
        { text: 'Full-stack developer. Final-year B.Tech IT at VIT Vellore, 2023–2027.' },
        { text: 'Based in Gurugram, India. Open to internships and freelance work.' },
      ];
    case 'projects':
    case 'ls':
      return [
        ...projects.map((project) => ({ text: `${project.year}  ${project.id.padEnd(6)} ${project.name}` })),
        { text: 'Type "open ace" (or salon, taxi, ids) to jump to one.', tone: 'dim' },
      ];
    case 'open':
    case 'cd': {
      const match = projects.find((project) => project.id === arg || project.name.toLowerCase().includes(arg));
      if (!arg || !match) return [{ text: `No project called "${arg}". Try: ${projects.map((p) => p.id).join(', ')}.`, tone: 'err' }];
      setTimeout(() => onOpenProject(match.id), 600);
      return [{ text: `Opening ${match.name}…`, tone: 'ok' }];
    }
    case 'experience':
      return experience.flatMap((job) => [
        { text: `${job.role}, ${job.org}`, tone: 'head' },
        { text: `${job.dates}, ${job.place}`, tone: 'dim' },
        ...job.points.map((point) => ({ text: `- ${point}` })),
      ]);
    case 'stack':
      return toolkit.map(([group, items]) => ({ text: `${group.padEnd(11)} ${items.join(', ')}` }));
    case 'patents':
      return [{ text: 'Published Indian patent applications (co-inventor):', tone: 'head' }, ...patents.map((title, i) => ({ text: `${i + 1}. ${title}` }))];
    case 'education':
      return education.map((item) => ({ text: `${item.years.padEnd(10)} ${item.title}, ${item.place}` }));
    case 'contact':
      return [{ text: `email     ${email}` }, { text: `phone     ${phone}` }, { text: `linkedin  ${linkedinUrl.replace('https://www.', '')}` }, { text: `github    ${githubUrl.replace('https://', '')}` }];
    case 'resume':
      window.open(resumeUrl, '_blank', 'noopener');
      return [{ text: 'Opening résumé in a new tab.', tone: 'ok' }];
    case 'time':
    case 'date':
      return [{ text: `${new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' }).format(new Date())} IST` }];
    default:
      return [{ text: `command not found: ${command}. Type "help" to see what's available.`, tone: 'err' }];
  }
}

export function Terminal({ onOpenProject, onGoTo }) {
  const sectionRef = useRef(null);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const [lines, setLines] = useState([]);
  const [value, setValue] = useState('');
  const [typing, setTyping] = useState(false);
  const history = useRef([]);
  const cursor = useRef(-1);
  const started = useRef(false);
  const inView = useInView(sectionRef, { threshold: 0.4 });

  const run = (text) => {
    if (text.trim().toLowerCase() === 'clear') { setLines([]); return; }
    const output = respond(text, { onOpenProject, onGoTo });
    setLines((current) => [...current, { text, tone: 'in' }, ...output]);
    if (text.trim()) history.current.unshift(text);
    cursor.current = -1;
  };

  /* When the terminal first comes into view, it types "whoami" by itself. */
  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    if (prefersReducedMotion()) { run('whoami'); return; }
    const word = 'whoami';
    let i = 0;
    setTyping(true);
    const id = setInterval(() => {
      i += 1;
      setValue(word.slice(0, i));
      if (i === word.length) {
        clearInterval(id);
        setTimeout(() => { run(word); setValue(''); setTyping(false); }, 350);
      }
    }, 110);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    const body = bodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, [lines]);

  const onKeyDown = (event) => {
    if (event.key === 'Enter') { event.preventDefault(); run(value); setValue(''); }
    if (event.key === 'ArrowUp' && history.current.length) {
      event.preventDefault();
      cursor.current = Math.min(cursor.current + 1, history.current.length - 1);
      setValue(history.current[cursor.current]);
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      cursor.current = Math.max(cursor.current - 1, -1);
      setValue(cursor.current === -1 ? '' : history.current[cursor.current]);
    }
    if (event.key === 'Tab') {
      const match = commandList.map((name) => name.split(' ')[0]).find((name) => value && name.startsWith(value.toLowerCase()));
      if (match) { event.preventDefault(); setValue(match); }
    }
  };

  return (
    <section className="terminal-section" id="terminal" ref={sectionRef}>
      <div className="terminal-copy">
        <Sweep>Quick lookup</Sweep>
        <p>Prefer the command line? Everything on this page is available as a command. Type one, or tap a suggestion.</p>
        <div className="terminal-suggestions">
          {['help', 'projects', 'experience', 'stack', 'contact'].map((command) => (
            <button key={command} onClick={() => { run(command); }}>{command}</button>
          ))}
        </div>
      </div>
      <div className="terminal" onClick={() => inputRef.current?.focus({ preventScroll: true })}>
        <div className="terminal-bar" aria-hidden="true"><i /><i /><i /><span>rohit@portfolio: ~</span></div>
        <div className="terminal-body" ref={bodyRef} role="log" aria-live="polite">
          {lines.map((line, i) => (
            <p key={i} className={`t-${line.tone || 'out'}`}>
              {line.tone === 'in' ? <><span className="t-prompt">~ $</span> {line.text}</> : line.text}
            </p>
          ))}
          <label className="terminal-input">
            <span className="t-prompt">~ $</span>
            <input
              ref={inputRef}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={onKeyDown}
              readOnly={typing}
              spellCheck="false"
              autoCapitalize="off"
              autoComplete="off"
              aria-label="Terminal command"
            />
          </label>
        </div>
      </div>
    </section>
  );
}
