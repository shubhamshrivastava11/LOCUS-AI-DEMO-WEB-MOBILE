'use client';
import { useMemo, useState } from 'react';
import { Cls } from './Sections';
import { IconAgent, IconLock, IconUser } from './Icons';

/* ---------- Who can see this decision? ---------- */
type Viewer = { key: string; name: string; role: string; scope: string | null; grants: string[] };
const VIEWERS: Viewer[] = [
  { key: 'priya', name: 'Priya Shah', role: 'Lead', scope: 'Launch', grants: ['dpa'] },
  { key: 'sam', name: 'Sam Ortiz', role: 'Member', scope: 'Growth', grants: [] },
  { key: 'alex', name: 'Alex Kim', role: 'Admin', scope: null, grants: [] },
  { key: 'jordan', name: 'Jordan Lee', role: 'Guest', scope: null, grants: [] },
];
type Rec = { id: string; title: string; cls: 'Public' | 'Internal' | 'Restricted' | 'Confidential' | 'Personal'; scope?: string; owner?: string; sharedWithGuests?: boolean };
const RECS: Rec[] = [
  { id: 'pg', title: 'Adopt Postgres + pgvector', cls: 'Public', scope: 'Platform', sharedWithGuests: true },
  { id: 'jul29', title: 'Launch on July 29 with SSO', cls: 'Internal', scope: 'Launch' },
  { id: 'hiring', title: 'Hold Q4 hiring for the launch team', cls: 'Restricted', scope: 'Launch' },
  { id: 'cap', title: 'Cap the free tier at 20 seats', cls: 'Restricted', scope: 'Growth' },
  { id: 'dpa', title: 'EU DPA review blocking two deals', cls: 'Confidential', scope: 'Legal' },
  { id: 'renew', title: 'Follow up with Acme on renewal terms', cls: 'Personal', owner: 'priya' },
];

function check(v: Viewer, r: Rec): { ok: boolean; why: string } {
  if (r.cls === 'Personal') return r.owner === v.key ? { ok: true, why: 'Their own Gmail. Private to them.' } : { ok: false, why: 'From someone’s personal Gmail. Hidden, including from Admins.' };
  if (v.role === 'Guest') return r.cls === 'Public' && r.sharedWithGuests ? { ok: true, why: 'Public and shared with Guests.' } : { ok: false, why: 'Guests see only what is explicitly shared.' };
  if (r.cls === 'Public' || r.cls === 'Internal') return { ok: true, why: r.cls === 'Public' ? 'Public to the workspace.' : 'Internal. Visible to all Members.' };
  if (r.cls === 'Restricted') return v.scope === r.scope ? { ok: true, why: `In their scope (${r.scope}).` } : { ok: false, why: `Restricted to the ${r.scope} scope.` };
  return v.grants.includes(r.id) ? { ok: true, why: 'Explicit grant. This access is logged.' } : { ok: false, why: 'Confidential. Needs an explicit grant.' };
}

export function PermissionSimulator() {
  const [vk, setVk] = useState('priya');
  const [agent, setAgent] = useState(false);
  const v = VIEWERS.find((x) => x.key === vk)!;
  const res = RECS.map((r) => ({ r, ...check(v, r) }));
  const seen = res.filter((x) => x.ok).length;
  return (
    <div className="psim">
      <div className="psim-controls">
        <div className="psim-group" role="radiogroup" aria-label="View as">
          {VIEWERS.map((x) => (
            <button key={x.key} role="radio" aria-checked={x.key === vk} className="psim-viewer" onClick={() => setVk(x.key)}>
              <strong>{x.name}</strong><span>{x.role}{x.scope ? ` · ${x.scope}` : ''}</span>
            </button>
          ))}
        </div>
        <label className="psim-switch">
          <input type="checkbox" checked={agent} onChange={(e) => setAgent(e.target.checked)} />
          <span className="psim-track" aria-hidden="true"><span /></span>
          <span className="small">Ask through an agent acting for {v.name.split(' ')[0]}</span>
        </label>
      </div>
      <div className="psim-head" aria-live="polite">
        <span className="psim-who">{agent ? <IconAgent size={16} /> : <IconUser size={16} />}{agent ? `release-agent for ${v.name}` : v.name}</span>
        <span className="psim-count"><b>{seen}</b> of {RECS.length} decisions visible</span>
      </div>
      {agent && <div className="psim-call mono">search_decisions(query: &quot;*&quot;, on_behalf_of: &quot;{v.key}@acme.com&quot;) → {seen} results</div>}
      <ul className="psim-list">
        {res.map(({ r, ok, why }) => (
          <li key={r.id} className={ok ? 'ok' : 'no'}>
            <span className="psim-state" role="img" aria-label={ok ? 'Visible' : 'Hidden'}>{ok ? '✓' : <IconLock size={14} />}</span>
            <span className="psim-title">{ok ? r.title : <span className="psim-redacted">{r.title}</span>}</span>
            <span className="psim-cls">{r.cls === 'Personal' ? <span className="cls psim-personal">Personal</span> : <Cls l={r.cls} />}</span>
            <span className="psim-why">{why}</span>
          </li>
        ))}
      </ul>
      <p className="caption" style={{ margin: 0 }}>Sample workspace. The same check runs for people and for agents, on every search, digest and MCP call.</p>
    </div>
  );
}

/* ---------- What does forgetting cost? ---------- */
const fmt = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 0 });
export function CostCalculator() {
  const [people, setPeople] = useState(120);
  const [hours, setHours] = useState(1.5);
  const [rate, setRate] = useState(85);
  const r = useMemo(() => {
    const h = people * hours * 46; // working weeks per year
    return { hours: h, cost: h * rate, fte: h / 1800 };
  }, [people, hours, rate]);
  const field = (label: string, val: number, set: (n: number) => void, min: number, max: number, step: number, unit: (n: number) => string) => (
    <label className="calc-field">
      <span className="calc-label"><span>{label}</span><output>{unit(val)}</output></span>
      <input type="range" min={min} max={max} step={step} value={val} onChange={(e) => set(Number(e.target.value))} style={{ ['--p' as any]: `${((val - min) / (max - min)) * 100}%` }} />
    </label>
  );
  return (
    <div className="calc">
      <div className="calc-inputs">
        {field('People who make or rely on team decisions', people, setPeople, 10, 2000, 10, (n) => fmt(n))}
        {field('Hours each spends per week finding or re-arguing past decisions', hours, setHours, 0.5, 6, 0.5, (n) => `${n} h`)}
        {field('Fully loaded cost per hour', rate, setRate, 30, 250, 5, (n) => `$${n}`)}
        <p className="caption" style={{ margin: 0 }}>Your estimates, not Locus AI benchmarks. Assumes 46 working weeks a year.</p>
      </div>
      <div className="calc-out" aria-live="polite">
        <span className="calc-k">Time spent each year</span>
        <span className="calc-big">{fmt(r.hours)} <small>hours</small></span>
        <div className="calc-row">
          <div><span className="calc-k">Cost each year</span><span className="calc-mid">${fmt(r.cost)}</span></div>
          <div><span className="calc-k">Equal to</span><span className="calc-mid">{r.fte.toFixed(1)} <small>full-time people</small></span></div>
        </div>
        <span className="calc-note">That is the time a shared decision memory is built to give back.</span>
      </div>
    </div>
  );
}
