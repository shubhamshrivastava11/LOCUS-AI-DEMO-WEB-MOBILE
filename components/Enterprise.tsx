'use client';
import { useEffect, useRef, useState } from 'react';
import { Cls, Tag } from './Sections';
import { IconAgent, IconUser } from './Icons';

/* ---------- 1. Decision Guard ---------- */
const PLANS = [
  { agent: 'Platform agent', plan: 'Add a Redis cache in front of retrieval to cut latency.', hit: { kind: 'Decision', title: 'No Redis cache for retrieval', cls: 'Internal', owner: 'Platform team', src: 'GitHub PR discussion, ADR-014', why: 'Ruled out to keep one datastore. Postgres + pgvector serves retrieval.' }, fix: 'Tune the pgvector HNSW index and add a query-level timeout.' },
  { agent: 'Release agent', plan: 'Post the launch note announcing July 15.', hit: { kind: 'Decision', title: 'Launch on July 29 with SSO', cls: 'Internal', owner: 'Priya Shah', src: 'Slack #launch-planning, Jun 12', why: 'Moved so the security review finishes and SSO ships in the same release.' }, fix: 'Post the launch note announcing July 29, with SSO.' },
  { agent: 'Sales agent', plan: 'Offer the free tier with unlimited seats to close the deal.', hit: { kind: 'Decision', title: 'Cap the free tier at 20 seats', cls: 'Restricted', owner: 'Growth', src: 'Teams, Pricing channel', why: 'Unlimited seats was superseded last month.' }, fix: 'Offer the free tier at 20 seats and a Team trial for the rest.' },
];
const STEPS = ['Reading the plan', 'Searching decisions you can see', 'Checking scope and classification', 'Comparing against active decisions'];

export function GuardDemo() {
  const [p, setP] = useState(0);
  const [stage, setStage] = useState<'idle' | 'scan' | 'hit' | 'revised' | 'override'>('idle');
  const [step, setStep] = useState(0);
  const timers = useRef<number[]>([]);
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => clear, []);
  const run = () => {
    clear(); setStage('scan'); setStep(0);
    const fast = matchMedia('(prefers-reduced-motion: reduce)').matches;
    STEPS.forEach((_, i) => timers.current.push(window.setTimeout(() => setStep(i + 1), fast ? 0 : 420 * (i + 1))));
    timers.current.push(window.setTimeout(() => setStage('hit'), fast ? 0 : 420 * STEPS.length + 250));
  };
  const pick = (i: number) => { clear(); setP(i); setStage('idle'); setStep(0); };
  const x = PLANS[p];
  return (
    <div className="guard">
      <div className="guard-left">
        <div className="guard-agents" role="tablist" aria-label="Choose an agent plan">
          {PLANS.map((pl, i) => <button key={pl.agent} role="tab" aria-selected={i === p} onClick={() => pick(i)}><IconAgent size={16} />{pl.agent}</button>)}
        </div>
        <div className="guard-plan">
          <span className="guard-k">Proposed plan</span>
          <p className={stage === 'revised' ? 'struck' : ''}>{x.plan}</p>
          {stage === 'revised' && <p className="panel-in revised">{x.fix}</p>}
        </div>
        <div className="mono small guard-call">check_plan(<span className="s">&quot;{x.agent.toLowerCase().replace(' ', '-')}&quot;</span>, plan)</div>
        <button className="btn btn-primary btn-block" onClick={run} disabled={stage === 'scan'}>{stage === 'idle' ? 'Run Decision Guard' : 'Run it again'}</button>
      </div>
      <div className="guard-right" aria-live="polite">
        {stage === 'idle' && <div className="guard-empty"><span className="guard-shield" aria-hidden="true">✓</span><p className="small">Pick an agent and run the check. Locus AI compares the plan with every active decision the agent is allowed to see.</p></div>}
        {stage === 'scan' && (
          <ul className="guard-steps">
            {STEPS.map((s, i) => <li key={s} className={i < step ? 'done' : i === step ? 'now' : ''}><span className="dot" />{s}</li>)}
          </ul>
        )}
        {(stage === 'hit' || stage === 'override') && (
          <div className="guard-hit panel-in">
            <div className="row gap-8"><span className="guard-badge">Conflict found</span><span className="caption">1 active decision</span></div>
            <div className="row gap-8 wrap"><Tag t={x.hit.kind as any} /><strong>{x.hit.title}</strong></div>
            <p className="small" style={{ margin: 0 }}>{x.hit.why}</p>
            <div className="row gap-8 wrap"><Cls l={x.hit.cls} /><span className="caption">Owner: {x.hit.owner} · {x.hit.src}</span></div>
            {stage === 'hit' ? (
              <div className="row gap-8 wrap" style={{ marginTop: 6 }}>
                <button className="btn btn-primary" onClick={() => setStage('revised')}>Revise the plan</button>
                <button className="btn btn-secondary" onClick={() => setStage('override')}>Ask {x.hit.owner} to override</button>
              </div>
            ) : (
              <div className="guard-log panel-in"><span className="dot-ok" />Override requested from {x.hit.owner}. The agent is paused, and the request is in the audit log.</div>
            )}
          </div>
        )}
        {stage === 'revised' && (
          <div className="guard-pass panel-in"><span className="guard-shield ok" aria-hidden="true">✓</span><div><strong>No conflicts</strong><p className="small" style={{ margin: 0 }}>The revised plan matches “{x.hit.title}”. The agent can go ahead, and the check is linked to that decision.</p></div></div>
        )}
      </div>
    </div>
  );
}

/* ---------- 2. Reversal impact ---------- */
const DEPENDENTS = [
  ['Release agent', 'Scheduled launch email for July 29'],
  ['Docs agent', 'Updated the public changelog date'],
  ['Support agent', 'Answered 6 customer tickets with July 29'],
  ['Pull request #331', 'Feature flag set to flip on July 29'],
];
export function ReversalDemo() {
  const [rev, setRev] = useState(false);
  return (
    <div className="viz">
      <div className={`viz-decision ${rev ? 'reversed' : ''}`}>
        <div className="row gap-8 wrap"><Tag t={rev ? 'Superseded' : 'Decision'} /><strong style={{ textDecoration: rev ? 'line-through' : 'none' }}>Launch on July 29 with SSO</strong></div>
        <span className="caption">{rev ? 'Reversed just now by Priya Shah' : 'Owner: Priya Shah · active since Jun 12'}</span>
      </div>
      <ul className="viz-deps">
        {DEPENDENTS.map(([who, what], i) => (
          <li key={who} className={rev ? 'hit' : ''} style={{ transitionDelay: rev ? `${i * 110}ms` : '0ms' }}>
            <span className="viz-k">{who}</span><span className="small">{what}</span>
            <span className="viz-flag">{rev ? 'Needs review' : 'Relies on this'}</span>
          </li>
        ))}
      </ul>
      <button className="btn btn-secondary" onClick={() => setRev((r) => !r)}>{rev ? 'Undo' : 'Reverse this decision'}</button>
    </div>
  );
}

/* ---------- 3. Change alerts ---------- */
export function AlertsDemo() {
  const [sent, setSent] = useState(false);
  const agents = ['Release agent', 'Docs agent', 'Support agent'];
  return (
    <div className="viz">
      <div className="viz-decision">
        <span className="caption">Owner confirms a replacement</span>
        <div className="row gap-8 wrap"><span className="small" style={{ textDecoration: 'line-through' }}>Free tier: unlimited seats</span><span className="small">→</span><strong className="small">Free tier capped at 20 seats</strong></div>
      </div>
      <ul className="viz-agents">
        {agents.map((a, i) => (
          <li key={a} className={sent ? 'got' : ''} style={{ transitionDelay: sent ? `${200 + i * 160}ms` : '0ms' }}>
            <span className="loom-mark"><IconAgent size={16} /></span>
            <span><strong className="small">{a}</strong><span className="caption" style={{ display: 'block' }}>{sent ? 'Received: free tier is now 20 seats. Reason attached.' : 'Subscribed to: pricing'}</span></span>
          </li>
        ))}
      </ul>
      <button className="btn btn-secondary" onClick={() => setSent((s) => !s)}>{sent ? 'Reset' : 'Confirm the replacement'}</button>
    </div>
  );
}

/* ---------- 4. Ownerless handover ---------- */
const OWNED = ['Adopt Postgres + pgvector', 'No Redis cache for retrieval', 'Async standups on Fridays'];
export function HandoverDemo() {
  const [moved, setMoved] = useState(false);
  return (
    <div className="viz">
      <div className="hand">
        <div className={`hand-person ${moved ? 'gone' : ''}`}>
          <span className="hand-av"><IconUser size={16} /></span>
          <span><strong className="small">Daniel Ortiz</strong><span className="caption" style={{ display: 'block' }}>{moved ? 'Left Platform team' : 'Platform lead'}</span></span>
        </div>
        <div className="hand-person">
          <span className="hand-av alt"><IconUser size={16} /></span>
          <span><strong className="small">Mei Chen</strong><span className="caption" style={{ display: 'block' }}>Suggested: same team and scope</span></span>
        </div>
      </div>
      <ul className="hand-list">
        {OWNED.map((d, i) => (
          <li key={d} className={moved ? 'moved' : ''} style={{ transitionDelay: moved ? `${i * 120}ms` : '0ms' }}>
            <span className="small">{d}</span><span className="caption">{moved ? 'Owner: Mei Chen' : 'Owner: Daniel Ortiz'}</span>
          </li>
        ))}
      </ul>
      <button className="btn btn-secondary" onClick={() => setMoved((m) => !m)}>{moved ? 'Reset' : 'Daniel changes role'}</button>
    </div>
  );
}

/* ---------- 5. Decision Health ---------- */
const TEAMS = [
  { team: 'Platform', relit: 1, days: 2, owned: 100 },
  { team: 'Launch', relit: 3, days: 4, owned: 92 },
  { team: 'Growth', relit: 6, days: 9, owned: 71 },
];
export function HealthDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return (
    <div className="viz" ref={ref}>
      <div className="health-head caption"><span>Team</span><span>Argued over again</span><span>Days to decide</span><span>With an owner</span></div>
      {TEAMS.map((t) => (
        <div key={t.team} className="health-row">
          <strong className="small">{t.team}</strong>
          <span className="hbar"><span className="track"><span style={{ width: on ? `${t.relit * 15}%` : 0 }} className={t.relit > 4 ? 'warn' : ''} /></span><em>{t.relit}</em></span>
          <span className="hbar"><span className="track"><span style={{ width: on ? `${t.days * 10}%` : 0 }} className={t.days > 6 ? 'warn' : ''} /></span><em>{t.days}</em></span>
          <span className="hbar"><span className="track"><span style={{ width: on ? `${t.owned}%` : 0 }} className={t.owned < 80 ? 'warn' : 'good'} /></span><em>{t.owned}%</em></span>
        </div>
      ))}
      <p className="caption" style={{ margin: 0 }}>Sample data for the fictional Acme workspace, last 30 days.</p>
    </div>
  );
}
