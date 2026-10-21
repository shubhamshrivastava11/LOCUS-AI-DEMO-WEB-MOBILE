'use client';
import { useEffect, useRef, useState } from 'react';
import { ToolIcon } from './ToolIcon';

type Status = 'active' | 'open' | 'superseded';
type Rec = { id: string; title: string; owner: string; slug: string; src: string; cls: string; status: Status; by?: string; reads: number; fresh?: boolean };
type Scene = { signal: { slug: string; where: string; who: string; said: string }; write: Rec; supersedes: string; agent: string; time: string };

const BASE: Rec[] = [
  { id: 'DEC-0412', title: 'Launch Q3 on July 29 with SSO', owner: 'Priya Shah', slug: 'slack', src: '#launch-planning', cls: 'Internal', status: 'active', reads: 14 },
  { id: 'DEC-0397', title: 'Free tier includes unlimited seats', owner: 'Rosa Diaz', slug: 'notion', src: 'Pricing › Plans', cls: 'Restricted', status: 'active', reads: 31 },
  { id: 'DEC-0388', title: 'Adopt Postgres with pgvector', owner: 'Platform', slug: 'notion', src: 'ADR-014', cls: 'Internal', status: 'active', reads: 22 },
  { id: 'DEC-0371', title: 'Multi-year discounts up to 25%', owner: 'Dana Kim', slug: 'gmail', src: 'Deal desk', cls: 'Restricted', status: 'active', reads: 9 },
  { id: 'BLK-0102', title: 'EU DPA review holding two deals', owner: 'Legal', slug: 'gmail', src: 'Label: Legal', cls: 'Confidential', status: 'open', reads: 0 },
];

const SCENES: Scene[] = [
  {
    signal: { slug: 'slack', where: '#pricing', who: 'Rosa Diaz', said: 'We’re capping the free tier at 20 seats, effective next billing cycle.' },
    write: { id: 'DEC-0419', title: 'Cap the free tier at 20 seats', owner: 'Rosa Diaz', slug: 'slack', src: '#pricing', cls: 'Restricted', status: 'active', reads: 0 },
    supersedes: 'DEC-0397', agent: 'support-agent', time: '09:41:07',
  },
  {
    signal: { slug: 'slack', where: '#deal-desk', who: 'Dana Kim', said: 'Approved: multi-year discounts cap at 15% starting this quarter.' },
    write: { id: 'DEC-0420', title: 'Cap multi-year discounts at 15%', owner: 'Dana Kim', slug: 'slack', src: '#deal-desk', cls: 'Restricted', status: 'active', reads: 0 },
    supersedes: 'DEC-0371', agent: 'sales-assistant', time: '10:02:44',
  },
];

// phases: 0 idle · 1 signal arrives · 2 record written · 3 old record superseded · 4 agent reads
export default function LedgerHero() {
  const [si, setSi] = useState(0);
  const [phase, setPhase] = useState(0);
  const [hover, setHover] = useState<string | null>(null);
  const timers = useRef<number[]>([]);
  const visible = useRef(true);
  const box = useRef<HTMLDivElement>(null);
  const s = SCENES[si];

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting; });
    if (box.current) io.observe(box.current);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setPhase(4); return () => io.disconnect(); }
    let scene = 0;
    const play = () => {
      timers.current.forEach(clearTimeout); timers.current = [];
      if (!visible.current || document.hidden) { timers.current.push(window.setTimeout(play, 1000)); return; }
      setSi(scene); setPhase(0);
      [1, 2, 3, 4].forEach((p, i) => timers.current.push(window.setTimeout(() => setPhase(p), 700 + i * 1500)));
      timers.current.push(window.setTimeout(() => { scene = (scene + 1) % SCENES.length; play(); }, 700 + 4 * 1500 + 3600));
    };
    play();
    return () => { io.disconnect(); timers.current.forEach(clearTimeout); };
  }, []);

  const rows: Rec[] = [
    ...(phase >= 2 ? [{ ...s.write, reads: phase >= 4 ? 1 : 0, fresh: true }] : []),
    ...BASE.map((r) => (r.id === s.supersedes && phase >= 3 ? { ...r, status: 'superseded' as Status, by: s.write.id } : r)),
  ];
  const events = [
    phase >= 4 && { t: s.time.replace(/:\d\d$/, ':09'), op: 'read', text: <><b>{s.agent}</b> read {s.write.id} · access checked</> },
    phase >= 3 && { t: s.time.replace(/:\d\d$/, ':08'), op: 'supersede', text: <>{s.supersedes} → {s.write.id}</> },
    phase >= 2 && { t: s.time, op: 'write', text: <>{s.write.id} from {s.signal.slug}://{s.signal.where}</> },
  ].filter(Boolean) as { t: string; op: string; text: React.ReactNode }[];

  return (
    <div className="lg" ref={box}>
      <div className="lg-head">
        <div className="lg-title"><span className="lg-dot" />Decision ledger <span className="lg-ws">Sample workspace</span></div>
        <div className="lg-meta"><span>Live</span></div>
      </div>

      <div className={`lg-signal ${phase === 1 ? 'on' : phase > 1 ? 'done' : ''}`} key={`sig-${si}`} aria-live="polite">
        <span className="lg-signal-src"><ToolIcon slug={s.signal.slug} size={13} />{s.signal.where}</span>
        <span className="lg-signal-q"><b>{s.signal.who}:</b> “{s.signal.said}”</span>
        <span className="lg-signal-st">{phase <= 1 ? 'Reading…' : 'Captured'}</span>
      </div>

      <div className="lg-table" role="table" aria-label="Decision records">
        <div className="lg-row lg-th" role="row">
          <span role="columnheader">Record</span><span role="columnheader">Decision</span><span role="columnheader" className="lg-c-owner">Owner</span><span role="columnheader" className="lg-c-src">Source</span><span role="columnheader" className="lg-c-cls">Access</span><span role="columnheader">Status</span><span role="columnheader" className="lg-c-reads">Agent reads</span>
        </div>
        {rows.map((r) => {
          const link = hover && (hover === r.id || hover === r.by || (r.id === s.write.id && hover === s.supersedes) || (r.id === s.supersedes && hover === s.write.id));
          return (
            <div key={r.id} role="row" className={`lg-row ${r.fresh ? 'fresh' : ''} ${r.status} ${link ? 'link' : ''}`} onMouseEnter={() => setHover(r.id)} onMouseLeave={() => setHover(null)}>
              <span role="cell" className="lg-id">{r.id}</span>
              <span role="cell" className="lg-dec">{r.title}</span>
              <span role="cell" className="lg-c-owner">{r.owner}</span>
              <span role="cell" className="lg-c-src"><ToolIcon slug={r.slug} size={12} />{r.src}</span>
              <span role="cell" className={`lg-c-cls lg-cls ${r.cls.toLowerCase()}`}>{r.cls}</span>
              <span role="cell" className="lg-st">{r.status === 'superseded' ? <>Superseded → <b>{r.by}</b></> : r.status === 'open' ? 'Open blocker' : 'Active'}</span>
              <span role="cell" className="lg-c-reads">{r.cls === 'Confidential' ? <span className="lg-none">No agent access</span> : <>{r.reads}{r.fresh && phase >= 4 && <em className="lg-stamp">{s.agent}</em>}</>}</span>
            </div>
          );
        })}
      </div>

      <div className="lg-log" aria-label="Event log">
        {events.length === 0 ? <div className="lg-ev"><span className="lg-t">{s.time.slice(0, 5)}</span><span className="lg-op">idle</span><span>Listening to 10 sources</span></div>
          : events.map((e) => <div key={e.op} className="lg-ev"><span className="lg-t">{e.t}</span><span className={`lg-op ${e.op}`}>{e.op}</span><span>{e.text}</span></div>)}
      </div>
    </div>
  );
}
