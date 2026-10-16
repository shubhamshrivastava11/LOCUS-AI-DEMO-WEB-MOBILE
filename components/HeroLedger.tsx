'use client';
import { useEffect, useRef, useState } from 'react';
import { asset } from '@/lib/base';
import { INTEGRATIONS } from '@/lib/content';
import { Cls, Tag } from './Sections';
import { IconBoard, IconBook, IconChat, IconCode, IconMail } from './Icons';

type Entry = { id: string; src: string; kind: string; title: string; owner: string; cls: string; supersedes?: string };

// Already in the record when the page opens (oldest last)
const SEED: Entry[] = [
  { id: 'pg', src: 'notion', kind: 'Decision', title: 'Adopt Postgres + pgvector', owner: 'Platform team', cls: 'Internal' },
  { id: 'seats', src: 'microsoft-teams', kind: 'Decision', title: 'Free tier: unlimited seats', owner: 'Growth', cls: 'Restricted' },
  { id: 'jul15', src: 'slack', kind: 'Decision', title: 'Launch on July 15', owner: 'Priya Shah', cls: 'Internal' },
];
// Arrive one at a time; two of them replace earlier decisions
const INCOMING: Entry[] = [
  { id: 'dpa', src: 'gmail', kind: 'Blocker', title: 'EU DPA review blocking two deals', owner: 'Legal', cls: 'Confidential' },
  { id: 'jul29', src: 'slack', kind: 'Decision', title: 'Launch on July 29 with SSO', owner: 'Priya Shah', cls: 'Internal', supersedes: 'jul15' },
  { id: 'cap', src: 'microsoft-teams', kind: 'Decision', title: 'Cap the free tier at 20 seats', owner: 'Growth', cls: 'Restricted', supersedes: 'seats' },
  { id: 'sso', src: 'jira', kind: 'Action', title: 'Draft SSO rollout plan by Oct 20', owner: 'Priya Shah', cls: 'Internal' },
  { id: 'redis', src: 'github', kind: 'Decision', title: 'No Redis cache for retrieval', owner: 'Platform team', cls: 'Internal' },
];
const SHOW = 5, EVERY = 3400;

function SrcIcon({ slug }: { slug: string }) {
  const cat = INTEGRATIONS.find((x) => x.slug === slug)?.cat;
  const I = slug === 'gmail' ? IconMail : cat === 'Communication' ? IconChat : cat === 'Knowledge' ? IconBook : cat === 'Delivery' ? IconBoard : IconCode;
  return <I size={14} />;
}

export default function HeroLedger({ logos }: { logos: Record<string, string | null> }) {
  const [n, setN] = useState(0); // how many incoming entries have landed
  const paused = useRef(false);
  const visible = useRef(true);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting; });
    if (box.current) io.observe(box.current);
    const first = window.setTimeout(() => setN(1), 1400);
    const t = window.setInterval(() => {
      if (paused.current || !visible.current || document.hidden) return;
      setN((x) => (x >= INCOMING.length ? 0 : x + 1));
    }, EVERY);
    return () => { clearTimeout(first); clearInterval(t); io.disconnect(); };
  }, []);

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
    <div className="ledger" ref={box} onMouseEnter={() => { paused.current = true; }} onMouseLeave={() => { paused.current = false; }} aria-label="Live decision record for a sample workspace">
      <div className="ledger-head">
        <span className="ledger-live"><span className="live-dot" />Capturing</span>
        <span className="ledger-title">Decision record</span>
        <span className="ledger-ws">Acme workspace</span>
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
                <div className="ledger-line"><Tag t={(by ? 'Superseded' : e.kind) as any} /><span className="ledger-t"><span className="strike">{e.title}</span></span></div>
                {by ? <span className="ledger-by">Replaced by “{by.title}”</span> : <span className="ledger-meta">{e.owner} · <Cls l={e.cls} /></span>}
              </div>
              <span className="ledger-ago">{ago(e)}</span>
            </li>
          );
        })}
      </ol>
      <div className="ledger-foot">Sample data · point at the record to pause it</div>
    </div>
  );
}
