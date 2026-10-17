import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { education, email, experience, githubUrl, linkedinUrl, patents, phone, projects, resumeUrl, toolkit } from './content';
import { FlowDiagram, ProcessStory, RouteRail, Sweep, Terminal } from './sections';

/* Graph: me → projects → the tools each one was built with. */
const graphNodes = [
  { id: 'me', label: 'Rohit', kind: 'core' },
  ...projects.map((project) => ({ id: project.id, label: project.short, kind: 'project' })),
  { id: 'patents', label: '3 patents', kind: 'project', target: 'research' },
  ...['React', 'Node.js', 'MongoDB', 'Socket.IO', 'Express', 'JavaScript', 'PySpark', 'Pandas', 'Flask', 'Scikit-learn', 'Python', 'Scapy', 'Applied AI', 'AWS', 'Vercel']
    .map((label) => ({ id: label, label, kind: 'skill' })),
];

const graphEdges = [
  ['me', 'ace'], ['me', 'salon'], ['me', 'taxi'], ['me', 'ids'], ['me', 'patents'],
  ['ace', 'React'], ['ace', 'Node.js'], ['ace', 'MongoDB'], ['ace', 'Socket.IO'],
  ['salon', 'JavaScript'], ['salon', 'MongoDB'], ['salon', 'Node.js'],
  ['taxi', 'PySpark'], ['taxi', 'Pandas'], ['taxi', 'Flask'], ['taxi', 'Scikit-learn'],
  ['ids', 'Python'], ['ids', 'Flask'], ['ids', 'Scapy'], ['ids', 'Pandas'],
  ['patents', 'Applied AI'], ['patents', 'Python'],
  ['Node.js', 'Express'], ['me', 'AWS'], ['me', 'Vercel'],
];

/* ================================================================== */
/* Icons (inline, so the page has no icon dependency)                  */
/* ================================================================== */

const Icon = {
  external: (
    <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M5 3h8v8M13 3 3 13" fill="none" stroke="currentColor" strokeWidth="1.7" /></svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 .5a11.5 11.5 0 0 0-3.64 22.4c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.82 1.19 3.08 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" /></svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" /></svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M3 5h18v14H3z M3 6l9 7 9-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="m16 16 4.5 4.5" stroke="currentColor" strokeWidth="1.8" /></svg>
  ),
};

/* ================================================================== */
/* Hooks                                                               */
/* ================================================================== */

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

function useLocalTime() {
  const format = () => new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' }).format(new Date());
  const [time, setTime] = useState(format);
  useEffect(() => {
    const id = setInterval(() => setTime(format()), 20000);
    return () => clearInterval(id);
  }, []);
  return time;
}

/* ================================================================== */
/* The live system graph                                               */
/* ================================================================== */

/* Graphite + teal, matching the CSS tokens. `ink` is the text colour, `paper` the page, `cobalt` the accent. */
const COLORS = { ink: '#ECEDEE', cobalt: '#2BB39A', fill: '#2BB39A', packet: '#5FE0C6', slate: '#868C93', line: 'rgba(236,237,238,0.13)', paper: '#111315', label: 'rgba(17,19,21,0.86)' };

function SystemGraph({ onSelect, reduced }) {
  const canvasRef = useRef(null);
  const selectRef = useRef(onSelect);
  selectRef.current = onSelect;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let scale = 1;
    let wide = true;
    let frame = 0;
    let running = true;
    let visible = true;

    const index = new Map();
    const nodes = graphNodes.map((node, i) => {
      const item = { ...node, x: 0, y: 0, vx: 0, vy: 0, i, born: 0, lw: node.label.length * (node.kind === 'project' ? 9 : 7.2) };
      index.set(node.id, item);
      return item;
    });
    const edges = graphEdges.map(([a, b]) => ({ a: index.get(a), b: index.get(b) }));
    const neighbours = new Map(nodes.map((node) => [node, new Set()]));
    edges.forEach(({ a, b }) => { neighbours.get(a).add(b); neighbours.get(b).add(a); });
    const edgesOf = new Map(nodes.map((node) => [node, edges.filter((edge) => edge.a === node || edge.b === node)]));

    const pointer = { x: -999, y: -999, inside: false };
    let hovered = null;
    let dragging = null;
    let downAt = null;

    const anchor = () => (wide ? { x: width * 0.68, y: height * 0.47 } : { x: width * 0.5, y: height * 0.5 });

    const seed = () => {
      const a = anchor();
      nodes.forEach((node, i) => {
        const angle = (i / nodes.length) * Math.PI * 2;
        node.x = a.x + Math.cos(angle) * 6;
        node.y = a.y + Math.sin(angle) * 6;
        node.vx = Math.cos(angle) * (node.kind === 'skill' ? 9 : 6);
        node.vy = Math.sin(angle) * (node.kind === 'skill' ? 9 : 6);
        node.born = node.kind === 'core' ? 0 : node.kind === 'project' ? 10 : 22 + i * 1.5;
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const firstRun = width === 0;
      width = rect.width;
      height = rect.height;
      wide = width > 860;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const room = wide ? Math.min(width * 0.6, height) : Math.min(width, height);
      scale = Math.max(0.5, Math.min(1.15, room / 640));
      measure();
      if (firstRun) seed();
    };

    /* Packets travel edge to edge, like messages moving through the system. */
    const packets = Array.from({ length: 9 }, (_, i) => {
      const edge = edges[(i * 5) % edges.length];
      return { edge, from: edge.a, t: Math.random(), speed: 0.006 + Math.random() * 0.006 };
    });

    const bounds = () => {
      const left = wide ? width * 0.36 : 24;
      return { left, right: width - 30, top: wide ? 96 : 24, bottom: height - (wide ? 120 : 30) };
    };

    const step = () => {
      const a = anchor();
      const box = bounds();
      const rest = { project: 165 * scale, skill: 88 * scale };

      for (let i = 0; i < nodes.length; i += 1) {
        const n1 = nodes[i];
        for (let j = i + 1; j < nodes.length; j += 1) {
          const n2 = nodes[j];
          let dx = n2.x - n1.x;
          let dy = n2.y - n1.y;
          let d2 = dx * dx + dy * dy;
          if (d2 < 1) { dx = Math.random() - 0.5; dy = Math.random() - 0.5; d2 = 1; }
          const force = Math.min((2600 * scale * scale) / d2, 6);
          const d = Math.sqrt(d2);
          const fx = (dx / d) * force;
          const fy = (dy / d) * force;
          n1.vx -= fx; n1.vy -= fy;
          n2.vx += fx; n2.vy += fy;
        }
      }

      edges.forEach(({ a: from, b: to }) => {
        const target = to.kind !== 'skill' ? rest.project : from.kind === 'core' ? rest.skill * 1.9 : rest.skill;
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        const pull = (d - target) * 0.012;
        const fx = (dx / d) * pull;
        const fy = (dy / d) * pull;
        from.vx += fx; from.vy += fy;
        to.vx -= fx; to.vy -= fy;
      });

      /* keep labels from sitting on top of each other */
      const boxOf = (node) => {
        if (node.kind === 'core') return [node.x - 26, node.y - 26, node.x + 26, node.y + 52];
        if (node.kind === 'project') return [node.x - 12, node.y - 14, node.x + 22 + node.lw, node.y + 14];
        return [node.x - 8, node.y - 10, node.x + 14 + node.lw, node.y + 10];
      };
      for (let i = 0; i < nodes.length; i += 1) {
        const b1 = boxOf(nodes[i]);
        for (let j = i + 1; j < nodes.length; j += 1) {
          const b2 = boxOf(nodes[j]);
          const ox = Math.min(b1[2], b2[2]) - Math.max(b1[0], b2[0]);
          const oy = Math.min(b1[3], b2[3]) - Math.max(b1[1], b2[1]);
          if (ox <= 0 || oy <= 0) continue;
          const n1 = nodes[i];
          const n2 = nodes[j];
          if (oy < ox) {
            const dir = n2.y >= n1.y ? 1 : -1;
            n1.vy -= dir * oy * 0.12; n2.vy += dir * oy * 0.12;
          } else {
            const dir = n2.x >= n1.x ? 1 : -1;
            n1.vx -= dir * ox * 0.08; n2.vx += dir * ox * 0.08;
          }
        }
      }

      nodes.forEach((node) => {
        const gravity = node.kind === 'core' ? 0.06 : 0.0025;
        node.vx += (a.x - node.x) * gravity;
        node.vy += (a.y - node.y) * gravity;

        if (pointer.inside && !dragging && node.kind === 'skill' && node !== hovered) {
          const dx = node.x - pointer.x;
          const dy = node.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 12000) {
            const d = Math.sqrt(d2 + 1);
            node.vx += (dx / d) * 0.3;
            node.vy += (dy / d) * 0.3;
          }
        }

        if (node === dragging) {
          node.x += (pointer.x - node.x) * 0.35;
          node.y += (pointer.y - node.y) * 0.35;
          node.vx = 0; node.vy = 0;
          return;
        }
        node.vx *= 0.82;
        node.vy *= 0.82;
        node.x += node.vx;
        node.y += node.vy;
        const labelRoom = node.kind === 'core' ? 0 : node.lw + 20;
        node.x = Math.max(box.left, Math.min(box.right - labelRoom, node.x));
        node.y = Math.max(box.top, Math.min(box.bottom, node.y));
      });
    };

    const draw = (time) => {
      ctx.clearRect(0, 0, width, height);
      const focus = hovered || dragging;
      const lit = focus ? neighbours.get(focus) : null;

      edges.forEach(({ a: from, b: to }) => {
        const appear = Math.min(1, Math.max(0, (frame - Math.max(from.born, to.born)) / 30));
        if (appear <= 0) return;
        const active = focus && (from === focus || to === focus);
        ctx.globalAlpha = appear;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = active ? COLORS.cobalt : focus ? 'rgba(236,237,238,0.05)' : COLORS.line;
        ctx.lineWidth = active ? 1.6 : 1;
        ctx.stroke();
      });
      ctx.globalAlpha = 1;

      if (!reduced && frame > 70) {
        packets.forEach((packet) => {
          const to = packet.edge.a === packet.from ? packet.edge.b : packet.edge.a;
          const x = packet.from.x + (to.x - packet.from.x) * packet.t;
          const y = packet.from.y + (to.y - packet.from.y) * packet.t;
          ctx.beginPath();
          ctx.arc(x, y, 3.4, 0, Math.PI * 2);
          ctx.shadowColor = 'rgba(95,224,198,0.7)';
          ctx.shadowBlur = 8;
          ctx.fillStyle = COLORS.packet;
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      }

      ctx.textBaseline = 'middle';
      nodes.forEach((node) => {
        const age = Math.min(1, Math.max(0, (frame - node.born) / 30));
        if (age <= 0) return;
        const dimmed = focus && node !== focus && !lit.has(node);
        ctx.globalAlpha = (dimmed ? 0.25 : 1) * age;

        if (node.kind === 'core') {
          const pulse = reduced ? 0 : (Math.sin(time / 700) + 1) * 3;
          ctx.beginPath();
          ctx.arc(node.x, node.y, 22 + pulse, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(43,179,154,0.4)';
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(node.x, node.y, 14, 0, Math.PI * 2);
          ctx.shadowColor = 'rgba(43,179,154,0.6)';
          ctx.shadowBlur = 18;
          ctx.fillStyle = COLORS.fill;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.font = '650 15px "Bricolage Grotesque", sans-serif';
          ctx.fillStyle = COLORS.ink;
          ctx.textAlign = 'center';
          ctx.fillText(node.label, node.x, node.y + 40);
        } else if (node.kind === 'project') {
          const isFocus = node === focus;
          ctx.beginPath();
          ctx.arc(node.x, node.y, isFocus ? 10 : 8, 0, Math.PI * 2);
          ctx.fillStyle = isFocus ? COLORS.cobalt : COLORS.ink;
          ctx.fill();
          ctx.font = `${isFocus ? 750 : 620} ${Math.round(15 * Math.max(scale, 0.88))}px "Bricolage Grotesque", sans-serif`;
          ctx.textAlign = 'left';
          const textWidth = ctx.measureText(node.label).width;
          const lx = node.x + 16;
          ctx.fillStyle = COLORS.label;
          ctx.fillRect(lx - 5, node.y - 12, textWidth + 10, 24);
          ctx.fillStyle = isFocus ? COLORS.cobalt : COLORS.ink;
          ctx.fillText(node.label, lx, node.y + 1);
        } else {
          ctx.beginPath();
          ctx.arc(node.x, node.y, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = COLORS.paper;
          ctx.fill();
          ctx.lineWidth = 1.4;
          ctx.strokeStyle = node === focus ? COLORS.cobalt : COLORS.slate;
          ctx.stroke();
          ctx.font = `500 ${Math.round(12.5 * Math.max(scale, 0.9))}px "Bricolage Grotesque", sans-serif`;
          ctx.fillStyle = node === focus || (lit && lit.has(node)) ? COLORS.ink : COLORS.slate;
          ctx.textAlign = 'left';
          ctx.fillText(node.label, node.x + 9, node.y + 1);
        }
      });
      ctx.globalAlpha = 1;
    };

    const advancePackets = () => {
      packets.forEach((packet) => {
        packet.t += packet.speed;
        if (packet.t < 1) return;
        const arrived = packet.edge.a === packet.from ? packet.edge.b : packet.edge.a;
        const options = edgesOf.get(arrived).filter((edge) => edge !== packet.edge);
        packet.edge = options.length ? options[Math.floor(Math.random() * options.length)] : packet.edge;
        packet.from = arrived;
        packet.t = 0;
      });
    };

    const measure = () => {
      nodes.forEach((node) => {
        if (node.kind === 'core') return;
        ctx.font = node.kind === 'project'
          ? `750 ${Math.round(15 * Math.max(scale, 0.88))}px "Bricolage Grotesque", sans-serif`
          : `500 ${Math.round(12.5 * Math.max(scale, 0.9))}px "Bricolage Grotesque", sans-serif`;
        node.lw = ctx.measureText(node.label).width;
      });
    };
    document.fonts?.ready.then(() => { if (running) measure(); });

    const loop = (time) => {
      if (!running) return;
      if (visible && width) {
        frame += 1;
        step();
        if (!reduced) advancePackets();
        draw(time);
      }
      requestAnimationFrame(loop);
    };

    const nodeAt = (x, y) => {
      let best = null;
      let bestDistance = Infinity;
      nodes.forEach((node) => {
        const reach = node.kind === 'skill' ? 14 : 24;
        const d = (node.x - x) ** 2 + (node.y - y) ** 2;
        const labelHit = node.kind !== 'core' && x > node.x && x < node.x + node.lw + 20 && Math.abs(y - node.y) < 12;
        if ((d < reach * reach || labelHit) && d < bestDistance) { best = node; bestDistance = d; }
      });
      return best;
    };

    const local = (event) => {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    const onMove = (event) => {
      const p = local(event);
      pointer.x = p.x; pointer.y = p.y; pointer.inside = true;
      if (!dragging) hovered = nodeAt(p.x, p.y);
      canvas.style.cursor = dragging ? 'grabbing' : hovered ? (hovered.kind === 'project' ? 'pointer' : 'grab') : 'default';
    };
    const onLeave = () => { pointer.inside = false; if (!dragging) hovered = null; };
    const onDown = (event) => {
      const p = local(event);
      const node = nodeAt(p.x, p.y);
      downAt = { ...p, node };
      if (node && event.pointerType === 'mouse') {
        dragging = node;
        canvas.setPointerCapture(event.pointerId);
      }
    };
    const onUp = (event) => {
      const p = local(event);
      const moved = downAt ? Math.hypot(p.x - downAt.x, p.y - downAt.y) : 99;
      const target = downAt?.node;
      dragging = null;
      downAt = null;
      if (target && moved < 6 && target.kind === 'project') selectRef.current?.(target.target || target.id);
    };

    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointerup', onUp);
    const resizer = new ResizeObserver(resize);
    resizer.observe(canvas);
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    io.observe(canvas);
    resize();

    if (reduced) {
      for (let i = 0; i < 400; i += 1) step();
      frame = 400;
    }
    requestAnimationFrame(loop);

    return () => {
      running = false;
      resizer.disconnect();
      io.disconnect();
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointerup', onUp);
    };
  }, [reduced]);

  return <canvas ref={canvasRef} className="graph" aria-label="Interactive map of Rohit's projects and the tools behind them" role="img" />;
}

/* ================================================================== */
/* Name that responds to the cursor through variable-font axes         */
/* ================================================================== */

function ReactiveName({ lines, sectionRef, reduced, as: Tag = 'h1', className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    if (reduced) return undefined;
    const section = sectionRef.current;
    const letters = Array.from(ref.current.querySelectorAll('.letter'));
    let frameId = 0;
    let px = -9999;
    let py = -9999;
    const current = letters.map(() => ({ w: 640, d: 100 }));

    const tick = () => {
      let settled = true;
      letters.forEach((letter, i) => {
        const rect = letter.getBoundingClientRect();
        const distance = Math.hypot(px - (rect.left + rect.width / 2), py - (rect.top + rect.height / 2));
        const influence = Math.max(0, 1 - distance / 280);
        const target = { w: 640 + influence * 160, d: 100 - influence * 25 };
        const state = current[i];
        state.w += (target.w - state.w) * 0.18;
        state.d += (target.d - state.d) * 0.18;
        if (Math.abs(target.w - state.w) > 0.5 || Math.abs(target.d - state.d) > 0.1) settled = false;
        letter.style.fontVariationSettings = `"wght" ${state.w.toFixed(0)}, "wdth" ${state.d.toFixed(1)}, "opsz" 96`;
      });
      frameId = settled ? 0 : requestAnimationFrame(tick);
    };
    const kick = () => { if (!frameId) frameId = requestAnimationFrame(tick); };
    const onMove = (event) => { px = event.clientX; py = event.clientY; kick(); };
    const onLeave = () => { px = -9999; py = -9999; kick(); };
    section.addEventListener('pointermove', onMove);
    section.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frameId);
      section.removeEventListener('pointermove', onMove);
      section.removeEventListener('pointerleave', onLeave);
    };
  }, [sectionRef, reduced]);

  let count = 0;
  return (
    <Tag ref={ref} className={`name ${className}`} aria-label={lines.join(' ')}>
      {lines.map((line) => (
        <span className="name-line" key={line} aria-hidden="true">
          {line.split('').map((char) => {
            count += 1;
            return <span className="letter" key={count} style={{ '--i': count }}>{char === ' ' ? '\u00A0' : char}</span>;
          })}
        </span>
      ))}
    </Tag>
  );
}

/* ================================================================== */
/* Command palette                                                     */
/* ================================================================== */

function CommandPalette({ open, onClose, actions }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? actions.filter((action) => `${action.label} ${action.hint}`.toLowerCase().includes(q)) : actions;
  }, [query, actions]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActive(0);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  if (!open) return null;

  const run = (action) => { onClose(); action.run(); };

  const onKey = (event) => {
    if (event.key === 'ArrowDown') { event.preventDefault(); setActive((i) => Math.min(i + 1, results.length - 1)); }
    if (event.key === 'ArrowUp') { event.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
    if (event.key === 'Enter' && results[active]) run(results[active]);
    if (event.key === 'Escape') onClose();
  };

  return (
    <div className="palette-backdrop" onMouseDown={onClose}>
      <div className="palette" role="dialog" aria-modal="true" aria-label="Jump to" onMouseDown={(event) => event.stopPropagation()}>
        <div className="palette-input">
          {Icon.search}
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => { setQuery(event.target.value); setActive(0); }}
            onKeyDown={onKey}
            placeholder="Jump to a project, section, or link"
            aria-label="Search"
          />
          <kbd>Esc</kbd>
        </div>
        <ul>
          {results.map((action, i) => (
            <li key={action.label}>
              <button className={i === active ? 'is-active' : ''} onMouseEnter={() => setActive(i)} onClick={() => run(action)}>
                <span>{action.label}</span>
                <small>{action.hint}</small>
              </button>
            </li>
          ))}
          {results.length === 0 && <li className="palette-empty">Nothing matches “{query}”. Try a project name or “contact”.</li>}
        </ul>
      </div>
    </div>
  );
}

/* ================================================================== */
/* Sections                                                            */
/* ================================================================== */

function Nav({ onOpenPalette }) {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);
  const close = () => setMenu(false);

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${menu ? 'is-open' : ''}`}>
      <a className="nav-name" href="#top" onClick={close}>Rohit Kumar</a>
      <nav className="nav-links" aria-label="Main">
        <a href="#work" onClick={close}>Projects</a>
        <a href="#experience" onClick={close}>Experience</a>
        <a href="#about" onClick={close}>About</a>
        <a href="#research" onClick={close}>Research</a>
        <a href="#contact" onClick={close}>Contact</a>
      </nav>
      <button className="nav-jump" onClick={onOpenPalette}>
        {Icon.search}<span>Jump to</span><kbd>{isMac ? '⌘' : 'Ctrl'} K</kbd>
      </button>
      <button className="nav-menu" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-label={menu ? 'Close menu' : 'Open menu'}>
        <i /><i />
      </button>
    </header>
  );
}

function Hero({ onSelect, reduced }) {
  const sectionRef = useRef(null);
  const time = useLocalTime();
  return (
    <section className="hero" id="top" ref={sectionRef}>
      <SystemGraph onSelect={onSelect} reduced={reduced} />
      <div className="hero-copy">
        <p className="hero-status"><span className="signal" aria-hidden="true" />Open to internships and freelance work</p>
        <ReactiveName lines={['Rohit', 'Kumar']} sectionRef={sectionRef} reduced={reduced} />
        <p className="hero-role">Full-stack developer</p>
        <p className="hero-lede">I build web systems that people run their day on: bookings, classrooms, dashboards, and live updates.</p>
        <div className="hero-actions">
          <a className="button button-primary" href="#work">View projects</a>
          <a className="button button-plain" href={resumeUrl} target="_blank" rel="noreferrer">Open résumé {Icon.external}</a>
        </div>
      </div>
      <div className="hero-strip">
        <dl>
          <div><dt>Studying</dt><dd>B.Tech IT, VIT Vellore, 2023–2027</dd></div>
          <div><dt>Based in</dt><dd>Gurugram, India</dd></div>
          <div><dt>Local time</dt><dd>{time} IST</dd></div>
        </dl>
        <a className="scroll-cue" href="#work" aria-label="Scroll to projects">
          <span className="scroll-cue-line" aria-hidden="true"><i /></span>
          <span>Scroll</span>
        </a>
        <p className="graph-hint">
          <span className="packet-key" aria-hidden="true" />
          <span>Everything I&rsquo;ve built, wired to the tools behind it. <span className="hint-pointer">Drag a node, or click a project to open it.</span><span className="hint-touch">Tap a project to open it.</span></span>
        </p>
      </div>
    </section>
  );
}

function Work({ openId, setOpenId }) {
  return (
    <section className="work" id="work">
      <header className="section-head">
        <Sweep>Projects</Sweep>
        <p>Two paid client systems running in production, and two data and security projects built at VIT. Open any project to see how it works.</p>
      </header>
      <ul className="cases">
        {projects.map((project) => {
          const open = openId === project.id;
          return (
            <li className={`case ${open ? 'is-open' : ''}`} id={`case-${project.id}`} key={project.id}>
              <button className="case-head" aria-expanded={open} aria-controls={`case-body-${project.id}`} onClick={() => setOpenId(open ? null : project.id)}>
                <span className="case-year">{project.year}</span>
                <span className="case-name">{project.name}</span>
                <span className="case-type">{project.type}</span>
                <span className="case-toggle" aria-hidden="true" />
              </button>
              <div className="case-body" id={`case-body-${project.id}`} role="region" aria-label={project.name} inert={!open}>
                <div className="case-inner">
                  <div className="case-main">
                    <p className="case-description">{project.description}</p>
                    <FlowDiagram flow={project.flow} />
                  </div>
                  <div className="case-meta">
                    <p className="case-role">{project.role}</p>
                    <ul className="case-stack">{project.stack.map((item) => <li key={item}>{item}</li>)}</ul>
                    <div className="case-links">
                      {project.links.map((link) => (
                        <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label} {Icon.external}</a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Experience() {
  return (
    <section className="experience" id="experience">
      <header className="section-head">
        <Sweep>Experience</Sweep>
        <p>Paid, independent client work, delivered from first requirements call to production.</p>
      </header>
      <ol className="jobs">
        {experience.map((job) => (
          <li className="job" key={job.role}>
            <div className="job-when">
              <p className="job-dates">{job.dates}</p>
              <p>{job.place}</p>
            </div>
            <div className="job-main">
              <h3>{job.role}</h3>
              <p className="job-org">{job.org}</p>
              <ul className="job-points">
                {job.points.map((point) => <li key={point}>{point}</li>)}
              </ul>
              <ul className="case-stack">{job.stack.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function About() {
  return (
    <section className="about" id="about">
      <figure className="portrait">
        <div className="portrait-frame"><img src="/rohit.webp" alt="Rohit Kumar" loading="lazy" width="900" height="1099" /></div>
      </figure>
      <div className="about-copy">
        <Sweep>I like the part where a requirement turns into something people use every day.</Sweep>
        <p>I&rsquo;m a final-year Information Technology student at VIT Vellore. From March to June 2026 I worked freelance and shipped two paid client systems, from the first requirements call through MongoDB, admin workflows, and production deploys.</p>
        <p>I&rsquo;m also a co-inventor on three published Indian patent applications in applied AI, which taught me to test an idea properly before calling it done.</p>

        <div className="about-columns">
          <div>
            <h3>Education</h3>
            <ol className="timeline">
              {education.map((item) => (
                <li key={item.title}><span>{item.years}</span><div><strong>{item.title}</strong><em>{item.place}</em></div></li>
              ))}
            </ol>
          </div>
          <div>
            <h3>What I work with</h3>
            <dl className="toolkit">
              {toolkit.map(([group, items]) => (
                <div key={group}><dt>{group}</dt><dd>{items.join(', ')}</dd></div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

function Research() {
  return (
    <section className="research" id="research">
      <header className="section-head">
        <Sweep>Research</Sweep>
        <p>Co-inventor on three published Indian patent applications exploring adaptive AI, behavioral risk analysis, and interpretable language models.</p>
      </header>
      <ul className="patents">
        {patents.map((title) => (
          <li key={title}>
            <p>{title}</p>
            <span>Published Indian patent application</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Contact() {
  const [state, setState] = useState({ phase: 'idle', email: '' });
  const [copied, setCopied] = useState(false);

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
    <section className="contact" id="contact">
      <div className="contact-intro">
        <Sweep>Get in touch</Sweep>
        <p>Hiring for an internship or role, or need a web system built? Send a message and I&rsquo;ll reply within a day.</p>
        <ul className="contact-links">
          <li><button onClick={copyEmail}>{Icon.mail}<span>{copied ? 'Email address copied' : email}</span></button></li>
          <li><a href={`tel:${phone.replace(/\s/g, '')}`}>{Icon.phone}<span>{phone}</span></a></li>
          <li><a href={linkedinUrl} target="_blank" rel="noreferrer">{Icon.linkedin}<span>LinkedIn</span></a></li>
          <li><a href={githubUrl} target="_blank" rel="noreferrer">{Icon.github}<span>GitHub</span></a></li>
        </ul>
      </div>

      <form className="contact-form" onSubmit={sendMessage}>
        <label>
          <span>Your name</span>
          <input name="name" required minLength="2" autoComplete="name" />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" required autoComplete="email" />
        </label>
        <label>
          <span>Message</span>
          <textarea name="message" required minLength="10" rows="5" placeholder="What are you working on, and where could I help?" />
        </label>
        <div className="form-foot">
          <button className="button button-primary" type="submit" disabled={state.phase === 'sending'}>
            {state.phase === 'sending' ? 'Sending…' : 'Send message'}
          </button>
          <p className={`form-status is-${state.phase}`} role="status">
            {state.phase === 'sent' && `Message sent. I’ll reply to ${state.email}.`}
            {state.phase === 'error' && 'Message not sent: the server didn’t respond. Try again, or email me directly.'}
          </p>
        </div>
      </form>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Rohit Kumar</p>
      <nav className="footer-links" aria-label="Elsewhere">
        <a href={githubUrl} target="_blank" rel="noreferrer">{Icon.github}<span>GitHub</span></a>
        <a href={linkedinUrl} target="_blank" rel="noreferrer">{Icon.linkedin}<span>LinkedIn</span></a>
        <a href={`mailto:${email}`}>{Icon.mail}<span>Email</span></a>
        <a href="#top">Back to top</a>
      </nav>
    </footer>
  );
}

/* ================================================================== */
/* Page                                                                */
/* ================================================================== */

function App() {
  const reduced = useReducedMotion();
  const [openId, setOpenId] = useState('ace');
  const [paletteOpen, setPaletteOpen] = useState(false);

  const goTo = useCallback((hash) => {
    document.querySelector(hash)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }, [reduced]);

  const openProject = useCallback((id) => {
    if (id === 'research') { goTo('#research'); return; }
    setOpenId(id);
    requestAnimationFrame(() => goTo(`#case-${id}`));
  }, [goTo]);

  const actions = useMemo(() => [
    ...projects.map((project) => ({ label: project.name, hint: project.type, run: () => openProject(project.id) })),
    { label: 'Experience', hint: 'Freelance full-stack developer', run: () => goTo('#experience') },
    { label: 'How I ship', hint: 'Five-step process', run: () => goTo('#process') },
    { label: 'About', hint: 'Background and education', run: () => goTo('#about') },
    { label: 'Terminal', hint: 'Type commands', run: () => goTo('#terminal') },
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

  return (
    <>
      <a className="skip" href="#work">Skip to projects</a>
      <Nav onOpenPalette={() => setPaletteOpen(true)} />
      <RouteRail />
      <main>
        <Hero onSelect={openProject} reduced={reduced} />
        <Work openId={openId} setOpenId={setOpenId} />
        <Experience />
        <ProcessStory />
        <About />
        <Research />
        <Terminal onOpenProject={openProject} onGoTo={goTo} />
        <Contact />
      </main>
      <Footer />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} actions={actions} />
    </>
  );
}

export default App;
