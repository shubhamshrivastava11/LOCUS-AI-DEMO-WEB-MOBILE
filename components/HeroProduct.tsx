'use client';
import { useEffect, useRef, useState } from 'react';
import { ToolIcon } from './ToolIcon';
import { Cls, Tag } from './Sections';
import { IconAgent, IconHome, IconLock, IconPulse, IconRadar, IconSearch, IconShield, IconUsers } from './Icons';

type Kind = 'Decision' | 'Action' | 'Blocker';
type Level = 'Public' | 'Internal' | 'Restricted' | 'Confidential';
type Row = {
  id: string; kind: Kind; title: string; owner: string; cls: Level; slug: string; where: string; when: string;
  quote: string; who: string; replaces?: string; agents: [string, string, string][]; why: string;
};

const START: Row[] = [
  { id: 'r1', kind: 'Decision', title: 'Cap the free tier at 20 seats', owner: 'Rosa Diaz', cls: 'Restricted', slug: 'slack', where: '#pricing', when: 'Mon', who: 'Rosa Diaz · Mon 10:14', quote: 'We’re capping the free tier at 20 seats, effective next billing cycle.', replaces: 'Free tier: unlimited seats', why: 'Growth scope only', agents: [['support-agent', 'search_decisions', '2m ago'], ['sales-assistant', 'get_decision_context', '1h ago']] },
  { id: 'r2', kind: 'Decision', title: 'Launch Q3 on July 29 with SSO', owner: 'Priya Shah', cls: 'Internal', slug: 'slack', where: '#launch-planning', when: 'Jun 12', who: 'Priya Shah · Jun 12', quote: 'Moving launch two weeks to July 29 so SSO ships with it. I’ll own the new date.', replaces: 'Launch on July 15', why: 'All members', agents: [['release-agent', 'search_decisions', '14m ago']] },
  { id: 'r3', kind: 'Blocker', title: 'EU DPA review holding two deals', owner: 'Legal', cls: 'Confidential', slug: 'gmail', where: 'Label: Legal', when: 'Oct 9', who: 'Outside counsel · Oct 9', quote: 'Both deals stay on hold until the sub-processor list is final.', why: 'Explicit grants only, every access logged', agents: [] },
  { id: 'r4', kind: 'Decision', title: 'Adopt Postgres + pgvector', owner: 'Platform team', cls: 'Internal', slug: 'notion', where: 'ADR-014', when: 'Sep 3', who: 'Platform team · Sep 3', quote: 'Use Postgres with pgvector for retrieval. No separate vector database.', why: 'All members', agents: [['code-review-agent', 'get_decision_context', '3h ago']] },
  { id: 'r5', kind: 'Action', title: 'SSO rollout plan by Oct 20', owner: 'Priya Shah', cls: 'Internal', slug: 'jira', where: 'LOC-412', when: 'Oct 13', who: 'Priya Shah · Oct 13', quote: 'I’ll have the SSO rollout plan in this ticket by Oct 20.', why: 'All members', agents: [['release-agent', 'search_decisions', '14m ago']] },
];
const QUEUE: Row[] = [
  { id: 'q1', kind: 'Decision', title: 'Cap multi-year discounts at 15%', owner: 'Dana Kim', cls: 'Restricted', slug: 'slack', where: '#deal-desk', when: 'Just now', who: 'Dana Kim · just now', quote: 'Approved: multi-year discounts cap at 15% starting this quarter.', replaces: 'Multi-year discounts up to 25%', why: 'Sales scope only', agents: [] },
  { id: 'q2', kind: 'Decision', title: 'Hold Q4 hiring for the launch team', owner: 'Priya Shah', cls: 'Restricted', slug: 'microsoft-teams', where: 'Launch › General', when: 'Just now', who: 'Priya Shah · just now', quote: 'Let’s hold new hiring for the launch team until after the Q4 release.', why: 'Launch scope only', agents: [] },
  { id: 'q3', kind: 'Decision', title: 'Sunset v1 webhooks on Dec 1', owner: 'Arjun Mehta', cls: 'Internal', slug: 'discord', where: '#api-changes', when: 'Just now', who: 'Arjun Mehta · just now', quote: 'v1 webhooks go away on Dec 1. Migration guide is live.', why: 'All members', agents: [] },
];
const TOOL: Record<string, string> = { slack: 'Slack', gmail: 'Gmail', notion: 'Notion', jira: 'Jira', 'microsoft-teams': 'Teams', discord: 'Discord' };

export default function HeroProduct() {
  const [rows, setRows] = useState<Row[]>(START);
  const [sel, setSel] = useState('r1');
  const [fresh, setFresh] = useState<string | null>(null);
  const [filter, setFilter] = useState<'All' | Kind>('All');
  const [calls, setCalls] = useState(1284);
  const manual = useRef(false);
  const q = useRef(0);
  const visible = useRef(true);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting; });
    if (box.current) io.observe(box.current);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => io.disconnect();
    const t = window.setInterval(() => {
      if (!visible.current || document.hidden) return;
      setCalls((c) => c + 1 + Math.floor(Math.random() * 3));
      if (q.current < QUEUE.length && Math.random() < 0.5) {
        const r = QUEUE[q.current++];
        setRows((rs) => [r, ...rs].slice(0, 6));
        setFresh(r.id);
        if (!manual.current) setSel(r.id);
      }
    }, 2600);
    return () => { io.disconnect(); clearInterval(t); };
  }, []);

  const shown = rows.filter((r) => filter === 'All' || r.kind === filter);
  const cur = rows.find((r) => r.id === sel) || rows[0];
  const pick = (id: string) => { manual.current = true; setSel(id); };

  return (
    <div className="hp" ref={box}>
      <div className="hp-top">
        <span className="hp-ws"><span className="hp-ws-logo">A</span>Acme</span>
        <span className="hp-search"><IconSearch size={14} />Ask about a decision, owner or thread</span>
        <span className="hp-live"><i />Capturing from 10 sources</span>
      </div>
      <div className="hp-app">
        <nav className="hp-side" aria-hidden="true">
          {[[IconHome, 'Home'], [IconSearch, 'Ask'], [IconRadar, 'Decisions', true], [IconPulse, 'Team Pulse'], [IconAgent, 'Agents']].map(([I, l, on]: any) => <span key={l} className={on ? 'on' : ''}><I size={15} />{l}</span>)}
          <span className="hp-side-k">Admin</span>
          {[[IconUsers, 'Members & roles'], [IconShield, 'Policies'], [IconLock, 'Audit log']].map(([I, l]: any) => <span key={l}><I size={15} />{l}</span>)}
        </nav>

        <section className="hp-main">
          <div className="hp-main-h">
            <div><strong>Decisions</strong><span>Captured from your tools, current first</span></div>
            <div className="hp-filters" role="group" aria-label="Filter">
              {(['All', 'Decision', 'Action', 'Blocker'] as const).map((f) => <button key={f} aria-pressed={filter === f} onClick={() => setFilter(f)}>{f === 'All' ? 'All' : f + 's'}</button>)}
            </div>
          </div>
          <div className="hp-table" role="list">
            {shown.map((r) => (
              <button key={r.id} role="listitem" className={`hp-row ${sel === r.id ? 'on' : ''} ${fresh === r.id ? 'fresh' : ''}`} onClick={() => pick(r.id)} onMouseEnter={() => pick(r.id)}>
                <span className="hp-c-kind"><Tag t={r.kind} /></span>
                <span className="hp-c-title">{r.title}{fresh === r.id && <em>New</em>}</span>
                <span className="hp-c-owner">{r.owner}</span>
                <span className="hp-c-cls"><Cls l={r.cls} /></span>
                <span className="hp-c-src"><ToolIcon slug={r.slug} size={13} />{r.where}</span>
                <span className="hp-c-when">{r.when}</span>
              </button>
            ))}
          </div>
        </section>

        <aside className="hp-detail" key={cur.id} aria-live="polite">
          <div className="hp-d-top"><Tag t={cur.kind} /><Cls l={cur.cls} /></div>
          <strong className="hp-d-title">{cur.title}</strong>
          <dl className="hp-d-fields">
            <div><dt>Owner</dt><dd>{cur.owner}</dd></div>
            <div><dt>Access</dt><dd>{cur.why}</dd></div>
          </dl>
          <div className="hp-d-src">
            <span className="hp-d-k"><ToolIcon slug={cur.slug} size={12} /> {TOOL[cur.slug]} · {cur.where}</span>
            <p>“{cur.quote}”</p>
            <span className="hp-d-who">{cur.who}</span>
          </div>
          {cur.replaces && <div className="hp-d-line"><span className="hp-d-k">Replaces</span><s>{cur.replaces}</s></div>}
          <div className="hp-d-agents">
            <span className="hp-d-k">Used by agents</span>
            {cur.agents.length === 0
              ? <span className="hp-d-none">{cur.cls === 'Confidential' ? 'No agent can see this record' : 'Not queried yet'}</span>
              : cur.agents.map(([a, f, t]) => <div key={a} className="hp-d-agent"><IconAgent size={13} /><span>{a}</span><code>{f}</code><em>{t}</em></div>)}
          </div>
        </aside>
      </div>
      <div className="hp-foot"><span>{calls.toLocaleString()} agent calls answered today · every one checked against the caller’s access</span><span>Sample workspace</span></div>
    </div>
  );
}
