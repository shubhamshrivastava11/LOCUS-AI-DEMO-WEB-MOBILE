'use client';
import { useEffect, useRef, useState } from 'react';
import { asset } from '@/lib/base';
import { INTEGRATIONS } from '@/lib/content';
import { Cls, Tag } from './Sections';
import { IconBoard, IconBook, IconChat, IconCode, IconMail } from './Icons';

type Entry = { id: string; src: string; kind: string; title: string; owner: string; cls: string; supersedes?: string; said?: string; where?: string };

// Already in the record when the page opens (oldest last)
const SEED: Entry[] = [
  { id: 'pg', src: 'notion', kind: 'Decision', title: 'Adopt Postgres + pgvector', owner: 'Platform team', cls: 'Internal' },
  { id: 'seats', src: 'microsoft-teams', kind: 'Decision', title: 'Free tier: unlimited seats', owner: 'Growth', cls: 'Restricted' },
  { id: 'jul15', src: 'slack', kind: 'Decision', title: 'Launch on July 15', owner: 'Priya Shah', cls: 'Internal' },
];
// Arrive one at a time; two of them replace earlier decisions
const INCOMING: Entry[] = [
  { id: 'dpa', src: 'gmail', kind: 'Blocker', title: 'EU DPA review blocking two deals', owner: 'Legal', cls: 'Confidential', where: 'Legal thread', said: 'DPA redlines are still with their counsel. Both deals are on hold.' },
  { id: 'jul29', src: 'slack', kind: 'Decision', title: 'Launch on July 29 with SSO', owner: 'Priya Shah', cls: 'Internal', supersedes: 'jul15', where: '#launch-planning', said: 'Let’s move launch to the 29th so SSO ships with it. I’ll own the date.' },
  { id: 'cap', src: 'microsoft-teams', kind: 'Decision', title: 'Cap the free tier at 20 seats', owner: 'Growth', cls: 'Restricted', supersedes: 'seats', where: 'Pricing', said: 'Cap the free tier at 20 seats starting next month.' },
  { id: 'sso', src: 'jira', kind: 'Action', title: 'Draft SSO rollout plan by Oct 20', owner: 'Priya Shah', cls: 'Internal', where: 'LOC-412', said: 'Priya to draft the SSO rollout plan by Oct 20.' },
  { id: 'redis', src: 'github', kind: 'Decision', title: 'No Redis cache for retrieval', owner: 'Platform team', cls: 'Internal', where: 'PR discussion', said: 'Not adding a Redis cache here. We ruled it out in the ADR.' },
];
const SHOW = 5, FLIGHT = 1700, DWELL = 2300, CYCLE = FLIGHT + DWELL;

function SrcIcon({ slug }: { slug: string }) {
  const cat = INTEGRATIONS.find((x) => x.slug === slug)?.cat;
  const I = slug === 'gmail' ? IconMail : cat === 'Communication' ? IconChat : cat === 'Knowledge' ? IconBook : cat === 'Delivery' ? IconBoard : IconCode;
  return <I size={14} />;
}

function TypeIn({ text, on }: { text: string; on: boolean }) {
  const [k, setK] = useState(on ? 0 : text.length);
  useEffect(() => {
    if (!on || matchMedia('(prefers-reduced-motion: reduce)').matches) { setK(text.length); return; }
    setK(0); let i = 0;
    const t = window.setInterval(() => { i += 1; setK(i); if (i >= text.length) clearInterval(t); }, 24);
    return () => clearInterval(t);
  }, [text, on]);
  return <>{text.slice(0, k)}{k < text.length && <span className="caret" />}</>;
}

export default function HeroLedger({ logos }: { logos: Record<string, string | null> }) {
  const [n, setN] = useState(0); // how many incoming entries have landed
  const [flying, setFlying] = useState<Entry | null>(null);
  const [cycle, setCycle] = useState(0);
  const [hover, setHover] = useState(false);
  const paused = useRef(false);
  const visible = useRef(true);
  const nRef = useRef(0);
  const box = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting; });
    if (box.current) io.observe(box.current);
    let t = 0;
    const tick = () => {
      if (paused.current || !visible.current || document.hidden) { t = window.setTimeout(tick, 400); return; }
      if (nRef.current >= INCOMING.length) { nRef.current = 0; setN(0); }
      const next = INCOMING[nRef.current];
      setCycle((c) => c + 1);
      setFlying(reduced ? null : next);
      t = window.setTimeout(() => {
        nRef.current += 1; setN(nRef.current); setFlying(null);
        t = window.setTimeout(tick, DWELL);
      }, reduced ? 0 : FLIGHT);
    };
    t = window.setTimeout(tick, 700);
    return () => { clearTimeout(t); io.disconnect(); };
  }, []);

  // Gentle tilt toward the pointer
  const onMove = (e: React.PointerEvent) => {
    const el = stage.current; if (!el || e.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--ry', `${x * 6}deg`); el.style.setProperty('--rx', `${-y * 5}deg`);
  };
  const onLeave = () => { const el = stage.current; if (el) { el.style.setProperty('--ry', '0deg'); el.style.setProperty('--rx', '0deg'); } };

  const landed = INCOMING.slice(0, n);
  const rows = [...landed.slice().reverse(), ...SEED].slice(0, SHOW);
  const replacedBy = (id: string) => landed.find((e) => e.supersedes === id);
  const name = (slug: string) => slug === 'microsoft-teams' ? 'Teams' : INTEGRATIONS.find((x) => x.slug === slug)?.name ?? slug;
  const ago = (e: Entry) => {
    const i = landed.findIndex((x) => x.id === e.id);
    if (i === -1) return 'Earlier';
    const steps = landed.length - 1 - i;
    return steps === 0 ? 'Just now' : `${steps * 4} min ago`;
  };

  return (
    <div className="ledger-stage" ref={stage} onPointerMove={onMove} onPointerLeave={onLeave}>
    {flying && (
      <div className="flight" key={`f-${cycle}`} aria-hidden="true">
        <span className="flight-src">{logos[flying.src] ? <img src={asset(logos[flying.src]!)} alt="" width={14} height={14} /> : <SrcIcon slug={flying.src} />}{name(flying.src)} · {flying.where}</span>
        <span className="flight-said">“{flying.said}”</span>
      </div>
    )}
    <div className={`ledger ${flying ? 'catching' : ''}`} ref={box} onMouseEnter={() => { paused.current = true; setHover(true); }} onMouseLeave={() => { paused.current = false; setHover(false); }} aria-label="Live decision record for a sample workspace">
      <div className="ledger-head">
        <span className="ledger-live"><span className="live-dot" />{flying ? 'Capturing…' : 'Listening'}</span>
        <span className="ledger-title">Decision record</span>
        <span className="ledger-ws">Acme workspace</span>
        <span className="ledger-timer" key={`t-${cycle}`} style={{ animationDuration: `${CYCLE}ms`, animationPlayState: hover ? 'paused' : 'running' }} />
      </div>
      <ol className="ledger-list" aria-live="polite">
        {rows.map((e, i) => {
          const by = replacedBy(e.id);
          const fresh = i === 0 && landed.length > 0 && e.id === landed.at(-1)?.id;
          return (
            <li key={e.id} className={`ledger-row ${fresh ? 'fresh' : ''} ${by ? 'old' : ''}`}>
              <span className="ledger-src" title={name(e.src)}>
                {logos[e.src] ? <img src={asset(logos[e.src]!)} alt="" width={14} height={14} /> : <SrcIcon slug={e.src} />}
                {name(e.src)}
              </span>
              <div className="ledger-body">
                <div className="ledger-line"><Tag t={(by ? 'Superseded' : e.kind) as any} /><span className="ledger-t"><span className="strike">{fresh ? <TypeIn text={e.title} on /> : e.title}</span></span></div>
                {by ? <span className="ledger-by">Replaced by “{by.title}”</span> : <span className="ledger-meta">{e.owner} · <Cls l={e.cls} /></span>}
              </div>
              <span className="ledger-ago">{ago(e)}</span>
            </li>
          );
        })}
      </ol>
      <div className="ledger-foot">Sample data · point at the record to pause it</div>
    </div>
    </div>
  );
}
