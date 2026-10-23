import { useEffect, useMemo, useRef, useState } from 'react';

export const Icon = {
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
  arrow: (
    <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.7" /></svg>
  ),
  back: (
    <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M14 8H3M7 4 3 8l4 4" fill="none" stroke="currentColor" strokeWidth="1.7" /></svg>
  ),
  check: (
    <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="m3 8.5 3.2 3L13 4.5" fill="none" stroke="currentColor" strokeWidth="1.9" /></svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="m16 16 4.5 4.5" stroke="currentColor" strokeWidth="1.8" /></svg>
  ),
};


export function CommandPalette({ open, onClose, actions }) {
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
            autoFocus
            value={query}
            onChange={(event) => { setQuery(event.target.value); setActive(0); }}
            onKeyDown={onKey}
            placeholder="Search projects, sections, links…"
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

