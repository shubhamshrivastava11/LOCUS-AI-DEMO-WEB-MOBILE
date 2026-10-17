'use client';
import { useEffect, useRef, useState } from 'react';
import { ToolIcon } from './ToolIcon';
import { IconAgent } from './Icons';

type Kind = 'source' | 'person' | 'decision' | 'agent';
type N = { id: string; kind: Kind; x: number; y: number; label: string; sub?: string; slug?: string; appear?: number; detail: string };
type E = { from: string; to: string; kind: 'source' | 'owner' | 'reads' | 'supersedes'; appear?: number; until?: number };

// Positions are percentages of the canvas.
const NODES: N[] = [
  { id: 'src-launch', kind: 'source', slug: 'slack', x: 13, y: 14, label: '#launch-planning', detail: 'Slack channel · Launch team' },
  { id: 'd412', kind: 'decision', x: 42, y: 16, label: 'Launch Q3 on July 29', sub: 'DEC-0412', detail: 'Active · Internal · owner Priya Shah' },
  { id: 'priya', kind: 'person', x: 70, y: 8, label: 'Priya Shah', sub: 'PS', detail: 'Lead · Launch' },
  { id: 'release', kind: 'agent', x: 86, y: 30, label: 'release-agent', detail: 'Reads with Priya’s access' },

  { id: 'src-pricing', kind: 'source', slug: 'slack', x: 12, y: 46, label: '#pricing', appear: 1, detail: 'Slack · Rosa Diaz: “We’re capping the free tier at 20 seats.”' },
  { id: 'd419', kind: 'decision', x: 44, y: 48, label: 'Cap free tier at 20 seats', sub: 'DEC-0419', appear: 2, detail: 'Active · Restricted to Growth · owner Rosa Diaz' },
  { id: 'rosa', kind: 'person', x: 72, y: 54, label: 'Rosa Diaz', sub: 'RD', detail: 'Lead · Growth' },

  { id: 'src-notion', kind: 'source', slug: 'notion', x: 12, y: 82, label: 'Pricing › Plans', detail: 'Notion page · last edited Aug 30' },
  { id: 'd397', kind: 'decision', x: 42, y: 84, label: 'Free tier: unlimited seats', sub: 'DEC-0397', detail: 'Owner Rosa Diaz · replaced by DEC-0419' },
  { id: 'support', kind: 'agent', x: 84, y: 82, label: 'support-agent', detail: 'Acts for Sam Lee · Growth' },
];
const EDGES: E[] = [
  { from: 'src-launch', to: 'd412', kind: 'source' },
  { from: 'd412', to: 'priya', kind: 'owner' },
  { from: 'release', to: 'd412', kind: 'reads' },
  { from: 'src-notion', to: 'd397', kind: 'source' },
  { from: 'd397', to: 'rosa', kind: 'owner' },
  { from: 'support', to: 'd397', kind: 'reads', until: 3 },
  { from: 'src-pricing', to: 'd419', kind: 'source', appear: 2 },
  { from: 'd419', to: 'rosa', kind: 'owner', appear: 2 },
  { from: 'd419', to: 'd397', kind: 'supersedes', appear: 3 },
  { from: 'support', to: 'd419', kind: 'reads', appear: 4 },
];
// Narrow screens: a taller, tighter layout so nothing clips at the edges.
const MOBILE: Record<string, { x: number; y: number }> = {
  'src-launch': { x: 26, y: 6 }, d412: { x: 32, y: 17 }, priya: { x: 82, y: 9 }, release: { x: 74, y: 28 },
  'src-pricing': { x: 24, y: 39 }, d419: { x: 32, y: 50 }, rosa: { x: 84, y: 47 },
  'src-notion': { x: 26, y: 70 }, d397: { x: 32, y: 82 }, support: { x: 72, y: 94 },
};
const STEPS = ['Listening to 10 sources', 'Message captured from Slack #pricing', 'Decision DEC-0419 written, owner Rosa Diaz', 'DEC-0419 supersedes DEC-0397', 'support-agent now reads DEC-0419'];

export default function MemoryGraph() {
  const [step, setStep] = useState(0);
  const [pos, setPos] = useState<Record<string, { x: number; y: number }>>(() => Object.fromEntries(NODES.map((n) => [n.id, { x: n.x, y: n.y }])));
  const [hot, setHot] = useState<string | null>(null);
  const [run, setRun] = useState(0);
  const drag = useRef<{ id: string; moved: boolean } | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const visible = useRef(true);

  useEffect(() => {
    const mq = matchMedia('(max-width: 600px)');
    const apply = () => setPos(Object.fromEntries(NODES.map((n) => [n.id, mq.matches ? MOBILE[n.id] : { x: n.x, y: n.y }])));
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting; });
    if (box.current) io.observe(box.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setStep(4); return; }
    setStep(0);
    const ts: number[] = [];
    const go = (s: number) => {
      if (s > 4) { ts.push(window.setTimeout(() => setRun((r) => r + 1), 5200)); return; }
      ts.push(window.setTimeout(() => {
        if (!visible.current || document.hidden) { go(s); return; }
        setStep(s); go(s + 1);
      }, s === 1 ? 900 : 1500));
    };
    go(1);
    return () => ts.forEach(clearTimeout);
  }, [run]);

  const shownNode = (n: N) => (n.appear ?? 0) <= step;
  const shownEdge = (e: E) => (e.appear ?? 0) <= step && (e.until === undefined || step < e.until);
  const edges = EDGES.filter(shownEdge);
  const neighbors = hot ? new Set([hot, ...edges.filter((e) => e.from === hot || e.to === hot).flatMap((e) => [e.from, e.to])]) : null;

  const onDown = (id: string) => (e: React.PointerEvent) => {
    drag.current = { id, moved: false };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current || !box.current) return;
    const r = box.current.getBoundingClientRect();
    const x = Math.min(94, Math.max(6, ((e.clientX - r.left) / r.width) * 100));
    const y = Math.min(94, Math.max(6, ((e.clientY - r.top) / r.height) * 100));
    drag.current.moved = true;
    setPos((p) => ({ ...p, [drag.current!.id]: { x, y } }));
  };
  const onUp = () => { drag.current = null; };

  const path = (e: E) => {
    const a = pos[e.from], b = pos[e.to];
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 - (e.kind === 'supersedes' ? 0 : 4);
    const cx = e.kind === 'supersedes' ? Math.max(a.x, b.x) + 14 : mx;
    return `M ${a.x} ${a.y} Q ${cx} ${my} ${b.x} ${b.y}`;
  };
  const hotNode = hot ? NODES.find((n) => n.id === hot) : null;

  return (
    <div className="mg">
      <div className="mg-canvas" ref={box} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}>
        <svg className="mg-edges" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {edges.map((e) => {
            const dim = neighbors && !(neighbors.has(e.from) && neighbors.has(e.to));
            return <path key={`${e.from}-${e.to}`} d={path(e)} className={`mg-e ${e.kind} ${dim ? 'dim' : ''} ${(e.appear ?? 0) === step && step > 0 ? 'new' : ''}`} />;
          })}
        </svg>
        {edges.filter((e) => e.kind === 'supersedes' || e.kind === 'reads').map((e) => {
          const a = pos[e.from], b = pos[e.to];
          const dim = neighbors && !(neighbors.has(e.from) && neighbors.has(e.to));
          return <span key={`l-${e.from}-${e.to}`} className={`mg-elabel ${e.kind} ${dim ? 'dim' : ''}`} style={{ left: `${(a.x + b.x) / 2 + (e.kind === 'supersedes' ? 9 : 0)}%`, top: `${(a.y + b.y) / 2 - 3}%` }}>{e.kind === 'supersedes' ? 'supersedes' : 'reads'}</span>;
        })}
        {NODES.filter(shownNode).map((n) => {
          const p = pos[n.id];
          const superseded = n.id === 'd397' && step >= 3;
          const dim = neighbors && !neighbors.has(n.id);
          return (
            <button key={n.id} type="button"
              className={`mg-n ${n.kind} ${superseded ? 'superseded' : ''} ${(n.appear ?? 0) === step && step > 0 ? 'new' : ''} ${dim ? 'dim' : ''} ${hot === n.id ? 'hot' : ''}`}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              onPointerDown={onDown(n.id)} onMouseEnter={() => setHot(n.id)} onMouseLeave={() => setHot(null)} onFocus={() => setHot(n.id)} onBlur={() => setHot(null)}
              aria-label={`${n.label}. ${n.detail}`}>
              {n.kind === 'source' && <><ToolIcon slug={n.slug!} size={13} />{n.label}</>}
              {n.kind === 'person' && <><span className="mg-av">{n.sub}</span><span className="mg-pl">{n.label}</span></>}
              {n.kind === 'agent' && <><IconAgent size={13} />{n.label}</>}
              {n.kind === 'decision' && <><span className="mg-id">{n.sub}{superseded ? ' · replaced' : ''}</span><span className="mg-t">{n.label}</span></>}
            </button>
          );
        })}
        {hotNode && <div className="mg-tip" style={{ left: `${Math.min(pos[hotNode.id].x, 70)}%`, top: `${pos[hotNode.id].y > 60 ? pos[hotNode.id].y - 18 : pos[hotNode.id].y + 9}%` }}>{hotNode.detail}</div>}
      </div>
      <div className="mg-bar">
        <span className="mg-log"><i />{STEPS[step]}</span>
        <span className="mg-legend"><span className="l source">source</span><span className="l owner">owner</span><span className="l reads">agent read</span><span className="l supersedes">supersedes</span></span>
        <button type="button" className="mg-replay" onClick={() => setRun((r) => r + 1)}>Replay</button>
      </div>
    </div>
  );
}
