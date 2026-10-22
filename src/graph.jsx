import { useEffect, useRef } from 'react';
import { projects } from './content';

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


const COLORS = { ink: '#ECEDEE', cobalt: '#2BB39A', fill: '#2BB39A', packet: '#5FE0C6', slate: '#868C93', line: 'rgba(236,237,238,0.13)', paper: '#111315', label: 'rgba(17,19,21,0.86)' };

export function SystemGraph({ onSelect, reduced, paused }) {
  const canvasRef = useRef(null);
  const selectRef = useRef(onSelect);
  selectRef.current = onSelect;
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

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

    const anchor = () => ({ x: width * 0.5, y: height * 0.5 });

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
      const room = Math.min(width * 0.75, height * 1.1);
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
      return { left: 24, right: width - 24, top: 70, bottom: height - 40 };
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
          const pulse = reduced || pausedRef.current ? 0 : (Math.sin(time / 700) + 1) * 3;
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
        if (!reduced && !pausedRef.current) advancePackets();
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

