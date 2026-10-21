'use client';
import { asset } from '@/lib/base';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IconAgent, IconFile, IconHome, IconList, IconLock, IconMoon, IconPulse, IconRadar, IconSearch, IconSettings, IconShield, IconSun, IconUsers } from '@/components/Icons';

type Screen = 'home' | 'search' | 'explorer' | 'pulse' | 'agents' | 'members' | 'security' | 'policies' | 'audit' | 'usage' | 'adoption';
type Kind = 'Decision' | 'Action' | 'Blocker' | 'Superseded';
type Level = 'Public' | 'Internal' | 'Restricted' | 'Confidential';
type Rec = { id: string; kind: Kind; title: string; cls: Level; owner: string; team: string; source: string; date: string; why: string; thread: [string, string][] };

const RECORDS: Rec[] = [
  { id: 'd1', kind: 'Decision', title: 'Adopt Postgres + pgvector for the context layer', cls: 'Internal', owner: 'Arjun Mehta', team: 'Platform', source: 'Slack #platform', date: '2026-10-14', why: 'One database for decisions and embeddings keeps operations simple; HNSW latency met the 200 ms target in the spike.', thread: [['Arjun', 'Spike results are in: pgvector + HNSW is well under 200 ms.'], ['Mei', 'Agreed. Let’s not run a second store.'], ['Priya', 'Locking it. Arjun owns the migration plan.']] },
  { id: 'd2', kind: 'Blocker', title: 'Legal review of the EU DPA is blocking two enterprise deals', cls: 'Confidential', owner: 'Legal', team: 'Legal', source: 'Gmail', date: '2026-10-14', why: 'Counsel needs the sub-processor list before signing.', thread: [['Legal', 'We need the updated sub-processor list before we can sign.']] },
  { id: 'd3', kind: 'Action', title: 'Priya to draft the SSO rollout plan by Oct 20', cls: 'Internal', owner: 'Priya Shah', team: 'Launch', source: 'Jira LOC-412', date: '2026-10-13', why: 'SSO ships in the same release as the Q3 launch.', thread: [['Priya', 'I’ll have the rollout plan in Jira by Oct 20.']] },
  { id: 'd4', kind: 'Decision', title: 'Cap the free tier at 20 seats', cls: 'Restricted', owner: 'Growth', team: 'Growth', source: 'Notion · Pricing', date: '2026-10-12', why: 'Large free teams were not converting; 20 seats covers 94% of current free workspaces.', thread: [['Sam', 'Proposal: cap free at 20 seats, effective next billing cycle.'], ['Priya', 'Approved.']] },
  { id: 'd5', kind: 'Decision', title: 'Move standups to async on Fridays', cls: 'Public', owner: 'Mei Lin', team: 'Platform', source: 'Slack #eng', date: '2026-10-11', why: 'Frees a focus block for the whole engineering org.', thread: [['Mei', 'Trying async Friday standups for a month.']] },
  { id: 'd6', kind: 'Decision', title: 'Launch on July 29 with SSO', cls: 'Internal', owner: 'Priya Shah', team: 'Launch', source: 'Slack #launch-planning', date: '2026-10-10', why: 'Finish the security review and ship SSO in the same release.', thread: [['Priya', 'Moving launch two weeks to July 29 so SSO ships with it.']] },
  { id: 'd7', kind: 'Action', title: 'Arjun to publish the MCP auth guide', cls: 'Public', owner: 'Arjun Mehta', team: 'Platform', source: 'Confluence', date: '2026-10-09', why: 'Agents need a documented auth flow before the beta.', thread: [['Arjun', 'Guide goes up on Confluence this week.']] },
  { id: 'd8', kind: 'Blocker', title: 'Waiting on infra quota for the staging cluster', cls: 'Internal', owner: 'Infra', team: 'Infra', source: 'Jira INF-88', date: '2026-10-08', why: 'Quota request pending with the cloud provider.', thread: [['Infra', 'Quota ticket filed, ETA 3 business days.']] },
  { id: 'd9', kind: 'Decision', title: 'Sunset the legacy webhook API on Dec 1', cls: 'Internal', owner: 'Platform', team: 'Platform', source: 'Notion · ADR-019', date: '2026-10-06', why: 'Fewer than 3% of calls still use it; all have migration paths.', thread: [['Arjun', 'ADR-019 approved: sunset Dec 1.']] },
  { id: 'd10', kind: 'Superseded', title: 'Free tier with unlimited seats', cls: 'Restricted', owner: 'Growth', team: 'Growth', source: 'Notion · Pricing', date: '2026-08-30', why: 'Replaced by the 20-seat cap on Oct 12.', thread: [['Sam', 'Original free tier plan (superseded).']] },
  { id: 'd11', kind: 'Action', title: 'Hire a contract designer for onboarding', cls: 'Restricted', owner: 'Growth', team: 'Growth', source: 'Gmail', date: '2026-10-05', why: 'Onboarding redesign needs extra capacity in Q4.', thread: [['Sam', 'Opening a contract role for onboarding design.']] },
  { id: 'd12', kind: 'Decision', title: 'Default classification for new records is Internal', cls: 'Public', owner: 'Maya Chen', team: 'Security', source: 'Slack #security', date: '2026-10-03', why: 'Safer default than Public while classification rules mature.', thread: [['Maya', 'Setting Internal as the default level.']] },
];
const SUGGESTED = ['Why did we move the Q3 launch to July 29?', 'Who owns the SSO rollout?', 'What changed in pricing this month?', 'What are the salary bands for 2027?'];
const ROLES = ['Owner', 'Admin', 'Lead', 'Member', 'Guest'] as const;
const LEVELS: Level[] = ['Public', 'Internal', 'Restricted', 'Confidential'];
const fmt = (d: string) => new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const Tag = ({ k }: { k: Kind }) => <span className={`tag tag-${k.toLowerCase()}`}>{k}</span>;
const Cls = ({ l }: { l: Level }) => <span className={`cls cls-${l.toLowerCase()}`}>{l}</span>;

export default function DemoApp() {
  const [screen, setScreen] = useState<Screen>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [records, setRecords] = useState<Rec[]>(RECORDS);
  const [open, setOpen] = useState<Rec | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [gmailOk, setGmailOk] = useState(false);
  const [usage, setUsage] = useState<UsageCfg>(DEFAULT_USAGE);
  const [audit, setAudit] = useState<[string, string, string, string][]>([
    ['Oct 15 · 09:41', 'Maya Chen', 'Granted Confidential access', '“EU DPA review” → Legal team'],
    ['Oct 15 · 09:12', 'Okta SCIM', 'Provisioned user', 'mei@acme.com · Member'],
    ['Oct 14 · 18:03', 'Priya Shah', 'Changed role', 'Arjun Mehta · Member → Lead'],
    ['Oct 14 · 16:20', 'System', 'Source disconnected', 'Gmail · token expired'],
    ['Oct 14 · 11:05', 'Maya Chen', 'Updated rule', '#leadership → Confidential'],
  ]);
  const t = useRef<ReturnType<typeof setTimeout>>();
  const notify = useCallback((m: string) => { setToast(m); clearTimeout(t.current); t.current = setTimeout(() => setToast(null), 2600); }, []);
  const log = useCallback((what: string, obj: string) => {
    const now = new Date();
    const stamp = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' · ' + now.toTimeString().slice(0, 5);
    setAudit((a) => [[stamp, 'Priya Shah', what, obj], ...a]);
  }, []);
  useEffect(() => { try { const s = localStorage.getItem('locus-theme'); if (s === 'dark' || s === 'light') setTheme(s); } catch {} }, []);
  useEffect(() => { document.documentElement.dataset.theme = theme; try { localStorage.setItem('locus-theme', theme); } catch {} return () => { delete document.documentElement.dataset.theme; }; }, [theme]);
  useEffect(() => { const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null); if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); document.getElementById('global-search')?.focus(); } }; window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, []);
  useEffect(() => { window.scrollTo({ top: 0 }); }, [screen]);

  const ask = (q: string) => { setQuery(q); setScreen('search'); };
  const nav: [Screen, string, any, number?][] = [['home', 'Home', IconHome], ['search', 'Search', IconSearch], ['explorer', 'Memory Explorer', IconRadar, records.length], ['pulse', 'Team Pulse', IconPulse], ['agents', 'Agents', IconAgent]];
  const admin: [Screen, string, any][] = [['members', 'Members & roles', IconUsers], ['adoption', 'Adoption & ROI', IconPulse], ['usage', 'Models & usage', IconSettings], ['security', 'Security & SSO', IconShield], ['policies', 'Policies', IconLock], ['audit', 'Audit log', IconList]];

  return (
    <>
      <aside className="demo-banner" aria-label="Demo notice"><span>Interactive demo with sample data for a fictional company, Acme.</span><Link href="/">Back to website</Link><Link href="/contact">Book a demo</Link></aside>
      <div className="app">
        <aside className="app-side" aria-label="App navigation">
          <div className="hide-m" style={{ padding: '0 8px 4px' }}><img src={asset(theme === 'dark' ? '/logo-dark.svg' : '/logo-light.svg')} alt="Locus AI" width={140} height={29} /></div>
          <div className="ws hide-m"><img src={asset('/mark.svg')} alt="" width={22} height={22} />Acme<span style={{ marginLeft: 'auto' }} className="caption">▾</span></div>
          {nav.map(([k, l, I, c]) => <button key={k} className="nav-item" aria-current={screen === k ? 'page' : undefined} onClick={() => setScreen(k)}><I size={17} />{l}{c ? <span className="count">{c}</span> : null}</button>)}
          <div className="side-label">Admin</div>
          {admin.map(([k, l, I]) => <button key={k} className="nav-item" aria-current={screen === k ? 'page' : undefined} onClick={() => setScreen(k)}><I size={17} />{l}</button>)}
          <div className="hide-m" style={{ flex: 1 }} />
          <div className="hide-m card" style={{ padding: '10px 12px', background: 'var(--bg-page)' }}>
            <div className="row gap-8" style={{ fontSize: 13, fontWeight: 600 }}><span className="live-dot" />Capturing · {gmailOk ? 6 : 5} of 6 sources</div>
            <div className="caption" style={{ color: gmailOk ? 'var(--text-2)' : 'var(--danger)' }}>{gmailOk ? 'All sources syncing' : 'Gmail needs reconnecting'}</div>
          </div>
          <div className="hide-m row gap-8" style={{ padding: '10px 8px 0' }}><span className="icon-chip" style={{ width: 32, height: 32, borderRadius: 99, fontSize: 12, fontWeight: 700 }}>PS</span><div><div style={{ fontSize: 14, fontWeight: 600 }}>Priya Shah</div><div className="caption">Owner</div></div></div>
        </aside>
        <div className="app-main">
          <header className="app-top">
            <form onSubmit={(e) => { e.preventDefault(); const v = (e.currentTarget.elements.namedItem('q') as HTMLInputElement).value.trim(); if (v) ask(v); }} role="search">
              <label htmlFor="global-search" className="sr-only">Search decisions</label>
              <input id="global-search" name="q" className="input" placeholder="Ask about a decision, owner or thread   ⌘K" />
            </form>
            <span className="caption hide-sm" style={{ marginLeft: 'auto' }}>Viewing as Owner · all scopes</span>
            <button className="icon-btn" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? <IconSun /> : <IconMoon />}</button>
          </header>
          <main id="main" className="app-body" key={screen}>
            <div className="panel-in stack gap-20">
              {screen === 'home' && <Home records={records} ask={ask} open={setOpen} gmailOk={gmailOk} reconnect={() => { setGmailOk(true); log('Reconnected source', 'Gmail'); notify('Gmail reconnected. Capturing resumed.'); }} go={setScreen} usage={usage} />}
              {screen === 'search' && <Search query={query} ask={ask} notify={notify} gmailOk={gmailOk} />}
              {screen === 'explorer' && <Explorer records={records} open={setOpen} notify={notify} />}
              {screen === 'pulse' && <Pulse records={records} notify={notify} />}
              {screen === 'agents' && <Agents />}
              {screen === 'members' && <Members log={log} notify={notify} />}
              {screen === 'security' && <Security log={log} notify={notify} />}
              {screen === 'policies' && <Policies log={log} notify={notify} />}
              {screen === 'audit' && <Audit audit={audit} />}
              {screen === 'adoption' && <Adoption />}
              {screen === 'usage' && <Usage cfg={usage} setCfg={setUsage} log={log} notify={notify} />}
            </div>
          </main>
        </div>
      </div>
      {open && (
        <>
          <div className="drawer-scrim" onClick={() => setOpen(null)} />
          <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
            <div className="row between"><div className="row gap-8"><Tag k={open.kind} /><Cls l={open.cls} /></div><button className="btn btn-ghost" onClick={() => setOpen(null)} autoFocus>Close</button></div>
            <h2 id="drawer-title" className="h3">{open.title}</h2>
            <dl style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: '10px 12px', margin: 0, fontSize: 14 }}>
              <dt className="muted">Owner</dt><dd style={{ margin: 0, fontWeight: 600 }}>{open.owner} · {open.team}</dd>
              <dt className="muted">Captured</dt><dd style={{ margin: 0, fontWeight: 600 }}>{fmt(open.date)} from {open.source}</dd>
              <dt className="muted">Status</dt><dd style={{ margin: 0, fontWeight: 600 }}>{open.kind === 'Superseded' ? 'Superseded' : 'Active'}</dd>
            </dl>
            <div className="card" style={{ background: 'var(--brand-subtle)', border: 0 }}><div className="overline" style={{ color: 'var(--brand-on-subtle)' }}>Why</div><p className="small" style={{ color: 'var(--text)', marginTop: 6 }}>{open.why}</p></div>
            <div className="card stack gap-12"><div className="overline" style={{ color: 'var(--text-3)' }}>Source · {open.source}</div>{open.thread.map(([w, m], i) => <div key={i} className="row gap-12" style={{ alignItems: 'flex-start' }}><span className="icon-chip" style={{ width: 26, height: 26, borderRadius: 6, fontSize: 12, fontWeight: 700 }}>{w[0]}</span><span className="small">{m}</span></div>)}</div>
            <div className="field"><label htmlFor="cls-sel">Classification</label>
              <select id="cls-sel" className="select" value={open.cls} onChange={(e) => { const l = e.target.value as Level; setRecords((rs) => rs.map((r) => r.id === open.id ? { ...r, cls: l } : r)); log('Changed classification', `“${open.title.slice(0, 40)}” → ${l}`); setOpen({ ...open, cls: l }); notify(`Classification set to ${l}. Logged to audit.`); }}>{LEVELS.map((l) => <option key={l}>{l}</option>)}</select>
            </div>
            <div className="row gap-8 wrap"><button className="btn btn-primary" onClick={() => notify(`Opening ${open.source}…`)}>Open source</button><button className="btn btn-secondary" onClick={() => { navigator.clipboard?.writeText(`https://app.locus.ai/d/${open.id}`); notify('Link copied'); }}>Copy link</button><button className="btn btn-ghost" onClick={() => notify('Thanks. Marked for review.')}>Mark wrong</button></div>
          </aside>
        </>
      )}
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}

function Header({ title, sub, right }: { title: string; sub?: string; right?: React.ReactNode }) {
  return <div className="row between wrap gap-16" style={{ alignItems: 'flex-end' }}><div className="stack gap-4"><h1 className="h2">{title}</h1>{sub && <p className="small">{sub}</p>}</div>{right && <div className="row gap-8 wrap">{right}</div>}</div>;
}
function FeedRow({ r, onOpen, cols }: { r: Rec; onOpen: (r: Rec) => void; cols?: boolean }) {
  return <button className="feed-row" onClick={() => onOpen(r)}><span style={{ width: 92 }}><Tag k={r.kind} /></span><span className="t" style={{ textDecoration: r.kind === 'Superseded' ? 'line-through' : undefined, color: r.kind === 'Superseded' ? 'var(--text-2)' : undefined }}>{r.title}</span><span className="hide-sm" style={{ width: 120 }}><Cls l={r.cls} /></span>{cols && <span className="hide-sm muted" style={{ width: 100 }}>{r.owner}</span>}<span className="hide-sm muted" style={{ width: 150 }}>{r.source}</span><span className="muted" style={{ width: 54, textAlign: 'right' }}>{fmt(r.date)}</span></button>;
}

function Home({ records, ask, open, gmailOk, reconnect, go, usage }: any) {
  const [q, setQ] = useState('');
  const c = (k: Kind) => records.filter((r: Rec) => r.kind === k).length;
  return (
    <>
      <Header title="Good morning, Priya" sub="Week of Oct 12 · Acme · all scopes you can access" />
      <form className="card row gap-12" style={{ padding: 8, paddingLeft: 16, border: '1.5px solid var(--focus)' }} onSubmit={(e) => { e.preventDefault(); if (q.trim()) ask(q.trim()); }}>
        <label htmlFor="home-ask" className="sr-only">Ask Locus AI</label>
        <input id="home-ask" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask Locus AI what your team decided…" style={{ flex: 1, border: 0, outline: 0, background: 'transparent', fontSize: 16, minHeight: 40 }} />
        <button className="btn btn-primary">Ask</button>
      </form>
      <div className="row gap-8 wrap">{SUGGESTED.slice(0, 3).map((s) => <button key={s} className="chip" onClick={() => ask(s)}>{s}</button>)}</div>
      <div className="grid g4">
        {[['Decisions', c('Decision'), 'Captured in the last 2 weeks'], ['Open actions', c('Action'), '1 due this week'], ['Blockers', c('Blocker'), '1 older than 5 days'], ['Superseded', c('Superseded'), 'Linked to replacements']].map(([a, b, s]) => <div className="card stat" key={a as string}><span className="small">{a}</span><b style={{ color: a === 'Blockers' ? 'var(--warning)' : undefined }}>{b}</b><span className="caption">{s}</span></div>)}
      </div>
      <TokenMeterCard cfg={usage} go={go} />
      {!gmailOk && <div className="row gap-12 wrap card" style={{ background: 'var(--danger-bg)', border: 0, padding: '12px 16px' }}><span className="small" style={{ color: 'var(--danger)', flex: 1 }}>Gmail disconnected 2 hours ago. Decisions from email are paused until it is reconnected.</span><button className="btn btn-secondary" onClick={reconnect}>Reconnect Gmail</button></div>}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="row between" style={{ padding: '14px 16px' }}><span className="overline" style={{ color: 'var(--text-3)' }}>Decision Radar · live</span><button className="btn btn-ghost" onClick={() => go('explorer')}>View all</button></div>
        {records.slice(0, 6).map((r: Rec) => <FeedRow key={r.id} r={r} onOpen={open} />)}
      </div>
    </>
  );
}

function Search({ query, ask, notify, gmailOk }: any) {
  const [phase, setPhase] = useState<'idle' | 'loading' | 'done'>(query ? 'loading' : 'idle');
  const [q, setQ] = useState(query);
  useEffect(() => { setQ(query); if (!query) return; setPhase('loading'); const id = setTimeout(() => setPhase('done'), 1100); return () => clearTimeout(id); }, [query]);
  const restricted = /salary|salaries|compensation|bands|termination/i.test(query);
  const r = /sso|owner|own/i.test(query) ? RECORDS[2] : /pricing|free|tier/i.test(query) ? RECORDS[3] : RECORDS[5];
  return (
    <>
      <form className="card row gap-12" style={{ padding: 8, paddingLeft: 16, border: '1.5px solid var(--focus)' }} onSubmit={(e) => { e.preventDefault(); if (q.trim()) ask(q.trim()); }}>
        <label htmlFor="s-q" className="sr-only">Question</label>
        <input id="s-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask a question in plain language" style={{ flex: 1, border: 0, outline: 0, background: 'transparent', fontSize: 16, minHeight: 40 }} />
        <button className="btn btn-primary">Ask</button>
      </form>
      {phase === 'idle' && <div className="stack gap-12"><p className="small">Try one of these:</p><div className="row gap-8 wrap">{SUGGESTED.map((s) => <button key={s} className="chip" onClick={() => ask(s)}>{s}</button>)}</div></div>}
      {phase === 'loading' && <div className="card stack gap-12" aria-busy="true"><span className="caption">Searching {gmailOk ? 6 : 5} sources…</span>{[92, 84, 88, 48].map((w) => <div key={w} className="skeleton" style={{ width: `${w}%` }} />)}</div>}
      {phase === 'done' && restricted && (
        <div className="card card-lg stack gap-12 center" style={{ padding: 48 }}>
          <Cls l="Confidential" />
          <h2 className="h3">This answer draws on Confidential records</h2>
          <p className="body" style={{ maxWidth: 520 }}>You can see that matching records exist, but not what they say. Access is granted per person by an Admin, and every view is logged.</p>
          <div className="row gap-8"><button className="btn btn-primary" onClick={() => notify('Access request sent to Maya Chen (Admin).')}>Request access</button><button className="btn btn-ghost" onClick={() => notify('Owner: People team')}>See who owns it</button></div>
        </div>
      )}
      {phase === 'done' && !restricted && (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 20, alignItems: 'start' }}>
          <div className="stack gap-16" style={{ gridColumn: 'span 2', minWidth: 0 }}>
            {!gmailOk && <div className="card small" style={{ background: 'var(--warning-bg)', color: 'var(--warning)', border: 0 }}>Partial answer: Gmail is disconnected, so recent email decisions may be missing.</div>}
            <div className="card card-lg stack gap-12">
              <div className="row gap-8 wrap"><Tag k={r.kind} /><Cls l={r.cls} /><span className="caption">High confidence · {r.thread.length + 1} sources agree · active</span></div>
              <p style={{ margin: 0, fontSize: 18, lineHeight: 1.6 }}>{r.title}. {r.why} Owner: <b>{r.owner}</b>. <span style={{ color: 'var(--link)', fontWeight: 600 }}>[1] [2]</span></p>
              <div className="row gap-8 wrap"><span className="caption">Was this right?</span><button className="btn btn-secondary" onClick={() => notify('Thanks. This improves future answers.')}>Useful</button><button className="btn btn-secondary" onClick={() => notify('Flagged for review by the record owner.')}>Wrong</button></div>
            </div>
            <div className="card stack gap-12">
              <span className="overline" style={{ color: 'var(--text-3)' }}>Decision timeline</span>
              {[['May 28', 'Launch on July 15', 'superseded'], [fmt(r.date), r.title, 'active']].map(([d, tt, s]) => <div key={tt} className="row gap-12"><span className="caption" style={{ width: 56 }}>{d}</span><span className="timeline-dot" style={{ background: s === 'active' ? 'var(--brand)' : 'transparent', border: s === 'active' ? 0 : '2px solid var(--border-strong)' }} /><span style={{ fontWeight: 600, textDecoration: s === 'superseded' ? 'line-through' : undefined, color: s === 'superseded' ? 'var(--text-2)' : undefined }}>{tt}</span></div>)}
            </div>
          </div>
          <div className="stack gap-16">
            <div className="card stack gap-12"><span className="overline" style={{ color: 'var(--text-3)' }}>Sources</span>{[[r.source, 'Internal'], ['Notion · Q3 Roadmap', 'Internal']].map(([s, l], i) => <div key={s} className="row between gap-8" style={{ padding: 10, borderRadius: 10, background: 'var(--bg-page)' }}><span className="small" style={{ color: 'var(--text)', fontWeight: 600 }}>{i + 1}  {s}</span><Cls l={l as Level} /></div>)}</div>
            <div className="card stack gap-8"><span className="overline" style={{ color: 'var(--text-3)' }}>Why you can see this</span><p className="small">You are an Owner with access to these scopes. 1 Confidential source was excluded from this answer.</p></div>
            <div className="code" style={{ fontSize: 12.5, padding: 16, borderRadius: 14 }}><span className="c">● Agents can ask this too</span>{'\n'}<span className="k">search_decisions</span>(query: <span className="s">&quot;{query.slice(0, 22)}&quot;</span>)</div>
          </div>
        </div>
      )}
    </>
  );
}

function Explorer({ records, open, notify }: any) {
  const [kind, setKind] = useState<'All' | Kind>('All');
  const [cls, setCls] = useState<'All' | Level>('All');
  const [text, setText] = useState('');
  const [desc, setDesc] = useState(true);
  const [page, setPage] = useState(0);
  const rows = useMemo(() => records.filter((r: Rec) => (kind === 'All' || r.kind === kind) && (cls === 'All' || r.cls === cls) && (!text || (r.title + r.owner + r.source).toLowerCase().includes(text.toLowerCase()))).sort((a: Rec, b: Rec) => (desc ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date))), [records, kind, cls, text, desc]);
  const per = 6; const pages = Math.max(1, Math.ceil(rows.length / per)); const view = rows.slice(page * per, page * per + per);
  useEffect(() => setPage(0), [kind, cls, text]);
  const exportCsv = () => {
    const csv = ['type,summary,classification,owner,source,date', ...rows.map((r: Rec) => [r.kind, r.title, r.cls, r.owner, r.source, r.date].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'locus-ai-memory-explorer.csv'; a.click(); notify(`Exported ${rows.length} records`);
  };
  return (
    <>
      <Header title="Memory Explorer" sub={`${rows.length} of ${records.length} records · every decision, action and blocker, cited and classified`} right={<><button className="btn btn-secondary" onClick={exportCsv}>Export CSV</button><button className="btn btn-primary" onClick={() => notify('Decision logging opens here (demo).')}>Log a decision</button></>} />
      <div className="row gap-8 wrap">
        {(['All', 'Decision', 'Action', 'Blocker', 'Superseded'] as const).map((k) => <button key={k} className="chip" aria-pressed={kind === k} onClick={() => setKind(k)}>{k === 'All' ? 'All types' : k === 'Superseded' ? 'Superseded' : k + 's'}</button>)}
        <label className="sr-only" htmlFor="cls-f">Classification</label>
        <select id="cls-f" className="select" style={{ width: 'auto', minHeight: 34, borderRadius: 99 }} value={cls} onChange={(e) => setCls(e.target.value as any)}><option value="All">All classifications</option>{LEVELS.map((l) => <option key={l}>{l}</option>)}</select>
        <label className="sr-only" htmlFor="txt-f">Filter</label>
        <input id="txt-f" className="input" style={{ width: 220, minHeight: 34, borderRadius: 99 }} placeholder="Filter by text, owner, source" value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>Type</th><th>Summary</th><th>Classification</th><th className="hide-sm">Owner</th><th className="hide-sm">Source</th><th><button className="sort-btn" onClick={() => setDesc(!desc)} aria-label={`Sort by date ${desc ? 'ascending' : 'descending'}`}>Date {desc ? '↓' : '↑'}</button></th></tr></thead>
          <tbody>
            {view.map((r: Rec) => <tr key={r.id} className="clickable" tabIndex={0} onClick={() => open(r)} onKeyDown={(e) => e.key === 'Enter' && open(r)}><td><Tag k={r.kind} /></td><td style={{ fontWeight: 600, textDecoration: r.kind === 'Superseded' ? 'line-through' : undefined }}>{r.title}</td><td><Cls l={r.cls} /></td><td className="hide-sm muted">{r.owner}</td><td className="hide-sm muted">{r.source}</td><td className="muted">{fmt(r.date)}</td></tr>)}
            {!view.length && <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40 }} className="muted">No records match these filters.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="row between"><span className="caption">Page {page + 1} of {pages}</span><div className="row gap-8"><button className="btn btn-secondary" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button><button className="btn btn-secondary" disabled={page >= pages - 1} onClick={() => setPage(page + 1)}>Next</button></div></div>
    </>
  );
}

function Pulse({ records, notify }: any) {
  const teams = ['Platform', 'Launch', 'Growth', 'Legal', 'Infra', 'Security'];
  const counts = teams.map((tm) => [tm, records.filter((r: Rec) => r.team === tm).length] as [string, number]);
  const max = Math.max(...counts.map((c) => c[1]));
  return (
    <>
      <Header title="Team Pulse" sub="Week of Oct 12 · built from the work itself" right={<button className="btn btn-primary" onClick={() => notify('Digest shared to #leadership')}>Share digest to Slack</button>} />
      <div className="grid g2" style={{ alignItems: 'start' }}>
        <div className="card stack gap-12"><span className="overline" style={{ color: 'var(--text-3)' }}>Records by team</span>{counts.map(([tm, n]) => <div key={tm} className="row gap-12"><span className="small" style={{ width: 80, color: 'var(--text)' }}>{tm}</span><span className="bar-track"><span className="bar-fill" style={{ display: 'block', width: `${(n / max) * 100}%` }} /></span><b style={{ width: 20, textAlign: 'right' }}>{n}</b></div>)}</div>
        <div className="card stack gap-16"><span className="overline" style={{ color: 'var(--text-3)' }}>This week in one read</span>{[['Shipped', 'Postgres + pgvector chosen for the context layer.'], ['Changed', 'Free tier capped at 20 seats, replacing the August plan.'], ['Stuck', 'Legal review of the EU DPA, blocking two deals.'], ['Next', 'SSO rollout plan due Oct 20 (Priya).']].map(([a, b]) => <div key={a}><div className="mono caption" style={{ color: a === 'Stuck' ? 'var(--warning)' : 'var(--link)' }}>{a.toUpperCase()}</div><div>{b}</div></div>)}</div>
      </div>
    </>
  );
}

function Agents() {
  return (
    <>
      <Header title="Agents" sub="Connect any MCP client. Agents inherit the permissions of the person they act for." />
      <div className="grid g2" style={{ alignItems: 'start' }}>
        <div className="card stack gap-12"><span className="overline" style={{ color: 'var(--text-3)' }}>Connected agents</span>{[['release-agent', 'Claude · acts as Priya Shah', '142 calls this week'], ['code-review-bot', 'Cursor · acts as Platform team', '61 calls this week']].map(([a, b, c]) => <div key={a} className="row between gap-12" style={{ padding: 12, borderRadius: 10, background: 'var(--bg-page)' }}><div><div style={{ fontWeight: 600 }}>{a}</div><div className="caption">{b}</div></div><span className="status status-ok">{c}</span></div>)}</div>
        <div className="code"><span className="c">{'// mcp.json'}</span>{'\n{\n  '}<span className="p">&quot;locus-ai&quot;</span>: {'{\n    '}<span className="p">&quot;url&quot;</span>: <span className="s">&quot;https://mcp.locus.ai/acme&quot;</span>,{'\n    '}<span className="p">&quot;auth&quot;</span>: <span className="s">&quot;oauth&quot;</span>{'\n  }\n}'}</div>
      </div>
    </>
  );
}

type Role = typeof ROLES[number];
type Member = { id: string; name: string; email: string; role: Role; scopes: string[]; last: string; grants: string[]; expires?: string; idle?: boolean; extended?: boolean };
const SCOPES = ['Leadership', 'Security', 'Platform', 'Infra', 'Launch', 'Growth', 'Legal'];
const SEED_MEMBERS: Member[] = [
  { id: 'priya', name: 'Priya Shah', email: 'priya@acme.com', role: 'Owner', scopes: ['Leadership', 'Launch'], last: 'Now', grants: ['d2'] },
  { id: 'maya', name: 'Maya Chen', email: 'maya@acme.com', role: 'Admin', scopes: ['Security'], last: '2h ago', grants: [] },
  { id: 'arjun', name: 'Arjun Mehta', email: 'arjun@acme.com', role: 'Lead', scopes: ['Platform', 'Infra'], last: 'Yesterday', grants: [] },
  { id: 'mei', name: 'Mei Lin', email: 'mei@acme.com', role: 'Member', scopes: ['Platform'], last: '1h ago', grants: [] },
  { id: 'dev', name: 'Dev Patel', email: 'dev@acme.com', role: 'Member', scopes: ['Platform', 'Infra'], last: '34 days ago', grants: [], idle: true },
  { id: 'lena', name: 'Lena Park', email: 'lena@acme.com', role: 'Member', scopes: ['Infra'], last: 'Today', grants: [] },
  { id: 'nina', name: 'Nina Rao', email: 'nina@acme.com', role: 'Member', scopes: ['Launch'], last: 'Today', grants: [] },
  { id: 'rosa', name: 'Rosa Diaz', email: 'rosa@acme.com', role: 'Lead', scopes: ['Growth'], last: '3h ago', grants: [] },
  { id: 'sam', name: 'Sam Lee', email: 'sam@acme.com', role: 'Member', scopes: ['Growth'], last: '3 days ago', grants: [] },
  { id: 'omar', name: 'Omar Haddad', email: 'omar@acme.com', role: 'Member', scopes: ['Legal'], last: 'Today', grants: ['d2'] },
  { id: 'jordan', name: 'Jordan Cole', email: 'contractor@agency.io', role: 'Guest', scopes: ['Launch'], last: '5 days ago', grants: [], expires: 'Nov 12' },
];
const AGENTS = [{ id: 'release-agent', actsFor: 'priya' }, { id: 'support-agent', actsFor: 'sam' }];
const CAPS: [string, Role[]][] = [
  ['Read Public decisions', ['Owner', 'Admin', 'Lead', 'Member', 'Guest']],
  ['Read Internal decisions', ['Owner', 'Admin', 'Lead', 'Member']],
  ['Read Restricted in own scopes', ['Owner', 'Lead', 'Member']],
  ['Read Confidential with a grant', ['Owner', 'Admin', 'Lead', 'Member']],
  ['Manage members of own scopes', ['Owner', 'Admin', 'Lead']],
  ['Change roles', ['Owner', 'Admin']],
  ['Configure sources and policies', ['Owner', 'Admin']],
  ['Export the audit log', ['Owner', 'Admin']],
  ['Billing and tenant settings', ['Owner']],
];
const can = (role: Role, cap: string) => CAPS.find((c) => c[0] === cap)![1].includes(role);
const TEAM_SCOPE: Record<string, string> = { Platform: 'Platform', Infra: 'Infra', Launch: 'Launch', Growth: 'Growth', Legal: 'Legal', Security: 'Security' };
function sees(m: Member, r: Rec) {
  if (m.role === 'Guest') return r.cls === 'Public' && m.scopes.includes(TEAM_SCOPE[r.team]);
  if (r.cls === 'Public' || r.cls === 'Internal') return true;
  if (r.cls === 'Restricted') return m.role !== 'Admin' && (m.role === 'Owner' || m.scopes.includes(TEAM_SCOPE[r.team]));
  return m.grants.includes(r.id);
}
const initials = (n: string) => n.split(' ').map((x) => x[0]).join('').slice(0, 2);
const ROLE_HUE: Record<Role, string> = { Owner: '#4338CA', Admin: '#7C3AED', Lead: '#0E9F8E', Member: '#2F6FEB', Guest: '#C77A12' };
const RoleBadge = ({ r }: { r: Role }) => <span className="rb" style={{ ['--h' as any]: ROLE_HUE[r] }}>{r}</span>;

function Members({ log, notify }: any) {
  const [tab, setTab] = useState<'overview' | 'tree' | 'list'>('overview');
  const [members, setMembers] = useState<Member[]>(SEED_MEMBERS);
  const [sel, setSel] = useState('arjun');
  const [inviting, setInviting] = useState(false);
  const [email, setEmail] = useState(''); const [role, setRole] = useState<Role>('Member'); const [err, setErr] = useState('');
  const setRoleFor = (id: string, v: Role) => { const m = members.find((x) => x.id === id)!; if (m.role === v) return; setMembers(members.map((x) => x.id === id ? { ...x, role: v } : x)); log('Changed role', `${m.name} · ${m.role} → ${v}`); notify(`${m.name} is now ${v}. Logged to audit.`); };
  const patch = (id: string, p: Partial<Member>, what: string, detail: string, msg: string) => { setMembers(members.map((x) => x.id === id ? { ...x, ...p } : x)); log(what, detail); notify(msg); };
  return (
    <>
      <Header title="Members & roles" sub={`${members.length} members · ${AGENTS.length} agents · provisioned by Okta SCIM`} right={<button className="btn btn-primary" onClick={() => setInviting(true)}>Invite people</button>} />
      <div className="mtabs" role="tablist" aria-label="Members views">
        {([['overview', 'Overview'], ['tree', 'Org tree'], ['list', 'Members']] as const).map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}>{l}</button>)}
      </div>
      {tab === 'overview' && <RbacOverview members={members} patch={patch} openMember={(id: string) => { setSel(id); setTab('tree'); }} />}
      {tab === 'tree' && <OrgTree members={members} sel={sel} setSel={setSel} setRoleFor={setRoleFor} patch={patch} />}
      {tab === 'list' && (
        <div className="table-wrap"><table className="table"><thead><tr><th>Member</th><th className="hide-sm">Scopes</th><th className="hide-sm">Last active</th><th>Role</th></tr></thead><tbody>
          {members.map((m) => <tr key={m.id}><td><div style={{ fontWeight: 600 }}>{m.name}</div><div className="caption">{m.email}</div></td><td className="hide-sm muted">{m.role === 'Owner' ? 'All scopes' : m.scopes.join(', ')}</td><td className="hide-sm muted">{m.expires ? `Expires ${m.expires}` : m.last}</td><td>
            <label className="sr-only" htmlFor={`role-${m.id}`}>Role for {m.name}</label>
            <select id={`role-${m.id}`} className="select" style={{ width: 150 }} value={m.role} disabled={m.role === 'Owner'} onChange={(e) => setRoleFor(m.id, e.target.value as Role)}>{ROLES.map((x) => <option key={x}>{x}</option>)}</select>
          </td></tr>)}
        </tbody></table></div>
      )}
      {inviting && <>
        <div className="drawer-scrim" onClick={() => setInviting(false)} />
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="inv-t" onClick={(e) => e.target === e.currentTarget && setInviting(false)}>
          <form className="card card-lg stack gap-16" onSubmit={(e) => { e.preventDefault(); if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { setErr('Enter a valid email.'); return; } const id = email.split('@')[0]; setMembers([...members, { id, name: id, email, role, scopes: role === 'Guest' ? ['Launch'] : [], last: 'Invite sent', grants: [], expires: role === 'Guest' ? 'in 30 days' : undefined }]); log('Invited user', `${email} · ${role}`); notify(`Invite sent to ${email}`); setInviting(false); setEmail(''); setErr(''); }}>
            <h2 id="inv-t" className="h3">Invite people</h2>
            <div className="field"><label htmlFor="inv-e">Email</label><input id="inv-e" className="input" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!err} placeholder="name@acme.com" /><span className={`help ${err ? 'err' : ''}`}>{err || 'Guests only see what you share and expire after 30 days.'}</span></div>
            <div className="field"><label htmlFor="inv-r">Role</label><select id="inv-r" className="select" value={role} onChange={(e) => setRole(e.target.value as Role)}>{ROLES.filter((r) => r !== 'Owner').map((r) => <option key={r}>{r}</option>)}</select></div>
            <div className="row gap-8" style={{ justifyContent: 'flex-end' }}><button type="button" className="btn btn-ghost" onClick={() => setInviting(false)}>Cancel</button><button className="btn btn-primary">Send invite</button></div>
          </form>
        </div>
      </>}
    </>
  );
}

function RbacOverview({ members, patch, openMember }: any) {
  const [hl, setHl] = useState<Role | null>(null);
  const byRole = ROLES.map((r) => [r, members.filter((m: Member) => m.role === r).length] as const);
  const total = members.length;
  const grants = members.flatMap((m: Member) => m.grants.map((g) => [m, g] as const));
  const levelReach = LEVELS.map((l) => [l, members.filter((m: Member) => RECORDS.filter((r) => r.cls === l).some((r) => sees(m, r))).length] as const);
  const issues: { id: string; text: string; sub: string; action: string; run: () => void }[] = [];
  members.forEach((m: Member) => {
    if (m.role === 'Guest' && m.expires && !m.extended) issues.push({ id: m.id + 'x', text: `${m.name}'s guest access expires ${m.expires}`, sub: `Guest · ${m.scopes.join(', ')}`, action: 'Extend 30 days', run: () => patch(m.id, { expires: 'Dec 12', extended: true }, 'Extended guest access', `${m.name} · until Dec 12`, `${m.name} can access shared spaces until Dec 12.`) });
    if (m.idle && m.scopes.length) issues.push({ id: m.id + 'i', text: `${m.name} inactive for 34 days`, sub: `Still has Restricted access to ${m.scopes.join(', ')}`, action: 'Remove from scopes', run: () => patch(m.id, { scopes: [], idle: false }, 'Removed from scopes', `${m.name} · ${m.scopes.join(', ')}`, `${m.name} removed from ${m.scopes.join(' and ')}.`) });
  });
  grants.forEach(([m, g]: any) => issues.push({ id: m.id + g, text: `${m.name} holds a Confidential grant`, sub: RECORDS.find((r) => r.id === g)?.title || g, action: 'Revoke', run: () => patch(m.id, { grants: m.grants.filter((x: string) => x !== g) }, 'Revoked confidential grant', `${m.name} · ${g}`, `Grant revoked for ${m.name}.`) }));
  return (
    <div className="stack gap-20">
      <div className="grid g4">
        {[['People', total, `${members.filter((m: Member) => m.role !== 'Guest').length} employees, ${members.filter((m: Member) => m.role === 'Guest').length} guest`], ['Scopes', SCOPES.length, 'Teams and spaces with their own access'], ['Agents', AGENTS.length, 'Act with a person’s permissions'], ['Confidential grants', grants.length, 'Every access is logged']].map(([k, v, d]) => (
          <div className="card stat" key={k as string}><span className="caption">{k}</span><b>{v}</b><span className="caption">{d}</span></div>
        ))}
      </div>
      <div className="rbac-grid">
        <div className="card stack gap-16">
          <div className="row between"><strong>Role distribution</strong><span className="caption">{total} people</span></div>
          <div className="rolebar" role="img" aria-label={byRole.map(([r, n]) => `${r} ${n}`).join(', ')}>
            {byRole.filter(([, n]) => n).map(([r, n]) => <span key={r} style={{ flex: n, background: ROLE_HUE[r], opacity: hl && hl !== r ? .3 : 1 }} onMouseEnter={() => setHl(r)} onMouseLeave={() => setHl(null)} />)}
          </div>
          <div className="role-legend">{byRole.map(([r, n]) => <button key={r} className={hl === r ? 'on' : ''} onMouseEnter={() => setHl(r)} onMouseLeave={() => setHl(null)} onFocus={() => setHl(r)} onBlur={() => setHl(null)}><i style={{ background: ROLE_HUE[r] }} />{r}<b>{n}</b></button>)}</div>
          <div className="stack gap-8" style={{ marginTop: 4 }}>
            <strong className="small" style={{ color: 'var(--text)' }}>Who can read each level</strong>
            {levelReach.map(([l, n]) => (
              <div key={l} className="reach"><Cls l={l} /><span className="reach-bar"><span style={{ width: `${(n / total) * 100}%` }} /></span><span className="caption">{n} of {total}</span></div>
            ))}
          </div>
        </div>
        <div className="card stack gap-12" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="row between" style={{ padding: '16px 18px 0' }}><strong>Permission matrix</strong><span className="caption">Point at a role to highlight it</span></div>
          <div className="table-wrap" style={{ border: 0, borderRadius: 0 }}><table className="table matrix"><thead><tr><th>Capability</th>{ROLES.map((r) => <th key={r} className={hl === r ? 'hl' : ''} onMouseEnter={() => setHl(r)} onMouseLeave={() => setHl(null)}>{r}</th>)}</tr></thead><tbody>
            {CAPS.map(([c]) => <tr key={c}><td>{c}</td>{ROLES.map((r) => <td key={r} className={`${hl === r ? 'hl' : ''} ${can(r, c) ? 'yes' : 'no'}`} aria-label={can(r, c) ? 'Allowed' : 'Not allowed'}>{can(r, c) ? '✓' : '·'}</td>)}</tr>)}
          </tbody></table></div>
        </div>
      </div>
      <div className="rbac-grid">
        <div className="card stack gap-12">
          <div className="row between"><strong>Needs review</strong><span className="caption">{issues.length} open</span></div>
          {issues.length === 0 && <p className="small">All clear. Nothing needs review.</p>}
          {issues.map((x) => <div key={x.id} className="issue"><div><div className="small" style={{ color: 'var(--text)', fontWeight: 600 }}>{x.text}</div><div className="caption">{x.sub}</div></div><button className="btn btn-secondary" onClick={x.run}>{x.action}</button></div>)}
        </div>
        <div className="card stack gap-12">
          <div className="row between"><strong>Agents and who they act for</strong><span className="caption">Same permissions as the person</span></div>
          {AGENTS.map((a) => { const m = members.find((x: Member) => x.id === a.actsFor)!; const n = RECORDS.filter((r) => sees(m, r)).length; return (
            <button key={a.id} className="agent-row" onClick={() => openMember(m.id)}>
              <span className="av ag"><IconAgent size={16} /></span>
              <span style={{ flex: 1, textAlign: 'left' }}><strong className="small" style={{ color: 'var(--text)' }}>{a.id}</strong><span className="caption" style={{ display: 'block' }}>Acts for {m.name} · <RoleBadge r={m.role} /></span></span>
              <span className="caption">{n} of {RECORDS.length} decisions</span>
            </button>
          ); })}
        </div>
      </div>
    </div>
  );
}

function OrgTree({ members, sel, setSel, setRoleFor, patch }: any) {
  const [openS, setOpenS] = useState<Record<string, boolean>>(() => Object.fromEntries(SCOPES.map((s) => [s, true])));
  const [q, setQ] = useState('');
  const owner = members.find((m: Member) => m.role === 'Owner');
  const guests = members.filter((m: Member) => m.role === 'Guest');
  const match = (m: Member) => !q || (m.name + m.email + m.role).toLowerCase().includes(q.toLowerCase());
  const m: Member = members.find((x: Member) => x.id === sel) || owner;
  const visible = RECORDS.filter((r) => sees(m, r));
  const agent = AGENTS.find((a) => a.actsFor === m.id);
  const Person = ({ p, depth }: { p: Member; depth: number }) => (
    <li role="treeitem" aria-selected={p.id === sel}>
      <button className={`tnode person ${p.id === sel ? 'on' : ''}`} style={{ paddingLeft: 12 + depth * 22 }} onClick={() => setSel(p.id)}>
        <span className="tline" aria-hidden="true" />
        <span className="av" style={{ ['--h' as any]: ROLE_HUE[p.role] }}>{initials(p.name)}</span>
        <span className="tname">{p.name}{p.idle && <span className="tdot" title="Inactive" />}</span>
        <RoleBadge r={p.role} />
      </button>
    </li>
  );
  return (
    <div className="tree-wrap">
      <div className="card tree-card">
        <div className="tree-tools"><input className="input" placeholder="Filter people" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Filter people" /><button className="btn btn-ghost" onClick={() => setOpenS(Object.fromEntries(SCOPES.map((s) => [s, !Object.values(openS).every(Boolean)])))}>{Object.values(openS).every(Boolean) ? 'Collapse all' : 'Expand all'}</button></div>
        <ul className="tree" role="tree" aria-label="Acme organization">
          <li role="treeitem" aria-expanded="true">
            <div className="tnode org"><img src={asset('/mark.svg')} alt="" width={20} height={20} /><strong>Acme</strong><span className="caption">{members.length} people</span></div>
            <ul role="group">
              {SCOPES.map((s) => {
                const ppl = members.filter((p: Member) => p.role !== 'Guest' && p.scopes.includes(s)).filter(match).sort((a: Member, b: Member) => ROLES.indexOf(a.role) - ROLES.indexOf(b.role));
                const lead = ppl.find((p: Member) => p.role === 'Owner' || p.role === 'Lead' || p.role === 'Admin');
                if (q && !ppl.length) return null;
                return (
                  <li key={s} role="treeitem" aria-expanded={!!openS[s]}>
                    <button className="tnode scope" style={{ paddingLeft: 34 }} onClick={() => setOpenS({ ...openS, [s]: !openS[s] })}>
                      <span className={`chev ${openS[s] ? 'open' : ''}`} aria-hidden="true">›</span>
                      <span className="scope-ic" aria-hidden="true">{s[0]}</span>
                      <strong>{s}</strong><span className="caption">{ppl.length} {ppl.length === 1 ? 'person' : 'people'}{lead ? ` · led by ${lead.name.split(' ')[0]}` : ''}</span>
                    </button>
                    {openS[s] && <ul role="group" className="tgroup">{ppl.map((p: Member) => <Person key={p.id + s} p={p} depth={2} />)}</ul>}
                  </li>
                );
              })}
              {guests.filter(match).length > 0 && (
                <li role="treeitem" aria-expanded="true">
                  <div className="tnode scope" style={{ paddingLeft: 34 }}><span className="chev open" aria-hidden="true">›</span><span className="scope-ic g" aria-hidden="true">G</span><strong>Guests</strong><span className="caption">shared spaces only</span></div>
                  <ul role="group" className="tgroup">{guests.filter(match).map((p: Member) => <Person key={p.id} p={p} depth={2} />)}</ul>
                </li>
              )}
            </ul>
          </li>
        </ul>
      </div>
      <div className="card profile panel-in" key={m.id}>
        <div className="row gap-12"><span className="av lg" style={{ ['--h' as any]: ROLE_HUE[m.role] }}>{initials(m.name)}</span><div style={{ flex: 1, minWidth: 0 }}><strong style={{ fontSize: 17 }}>{m.name}</strong><div className="caption">{m.email} · {m.expires ? `expires ${m.expires}` : `active ${m.last.toLowerCase()}`}</div></div><RoleBadge r={m.role} /></div>
        <div className="field"><label htmlFor="pr-role">Role</label><select id="pr-role" className="select" value={m.role} disabled={m.role === 'Owner'} onChange={(e) => setRoleFor(m.id, e.target.value as Role)}>{ROLES.map((x) => <option key={x}>{x}</option>)}</select></div>
        <div className="stack gap-8"><span className="caption">Scopes</span><div className="row gap-8 wrap">{(m.role === 'Owner' ? ['All scopes'] : m.scopes.length ? m.scopes : ['None']).map((s) => <span key={s} className="chip" style={{ cursor: 'default' }}>{s}</span>)}</div></div>
        <div className="stack gap-8">
          <div className="row between"><span className="caption">What they can read</span><span className="caption"><b style={{ color: 'var(--text)' }}>{visible.length}</b> of {RECORDS.length} decisions</span></div>
          {LEVELS.map((l) => { const all = RECORDS.filter((r) => r.cls === l); const n = all.filter((r) => sees(m, r)).length; return (
            <div key={l} className="reach"><Cls l={l} /><span className="reach-bar"><span style={{ width: all.length ? `${(n / all.length) * 100}%` : 0 }} /></span><span className="caption">{n}/{all.length}</span></div>
          ); })}
        </div>
        <div className="stack gap-8"><span className="caption">Capabilities</span><ul className="caps">{CAPS.map(([c]) => <li key={c} className={can(m.role, c) ? 'y' : 'n'}><span aria-hidden="true">{can(m.role, c) ? '✓' : '–'}</span>{c}</li>)}</ul></div>
        {m.grants.length > 0 && <div className="stack gap-8"><span className="caption">Confidential grants</span>{m.grants.map((g) => <div key={g} className="issue"><span className="small" style={{ color: 'var(--text)' }}>{RECORDS.find((r) => r.id === g)?.title}</span><button className="btn btn-ghost" onClick={() => patch(m.id, { grants: m.grants.filter((x) => x !== g) }, 'Revoked confidential grant', `${m.name} · ${g}`, `Grant revoked for ${m.name}.`)}>Revoke</button></div>)}</div>}
        {agent && <div className="agent-note"><IconAgent size={16} /><span className="small"><b>{agent.id}</b> acts for {m.name.split(' ')[0]} and sees exactly these {visible.length} decisions.</span></div>}
      </div>
    </div>
  );
}

function Toggle({ id, label, checked, onChange }: any) {
  return <label className="switch" htmlFor={id}><input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} /><span className="track" /><span>{label}</span></label>;
}

function Security({ log, notify }: any) {
  const [req, setReq] = useState(true); const [sess, setSess] = useState(true); const [ip, setIp] = useState(false); const [rot, setRot] = useState('Oct 2 by Maya Chen');
  const tog = (name: string, set: any) => (v: boolean) => { set(v); log('Updated security setting', `${name}: ${v ? 'on' : 'off'}`); notify(`${name} ${v ? 'enabled' : 'disabled'}. Logged to audit.`); };
  return (
    <>
      <Header title="Security & SSO" sub="Enterprise plan · every change is recorded in the audit log" />
      <div className="grid g2" style={{ alignItems: 'start' }}>
        <div className="card stack gap-16">
          <div className="row between"><h2 className="h4">SAML single sign-on</h2><span className="status status-ok">Active</span></div>
          {[['Identity provider', 'Okta'], ['SSO URL', 'https://acme.okta.com/app/locus/sso/saml'], ['Certificate', 'okta-acme-2026.pem · expires Mar 2027']].map(([a, b]) => <div key={a} className="field"><label>{a}</label><input className="input" readOnly value={b} /></div>)}
          <Toggle id="t1" label="Require SSO for everyone except Owners" checked={req} onChange={tog('Require SSO', setReq)} />
          <button className="btn btn-secondary" style={{ alignSelf: 'flex-start' }} onClick={() => notify('Test passed: SAML assertion valid.')}>Test connection</button>
        </div>
        <div className="stack gap-16">
          <div className="card stack gap-12"><div className="row between"><h2 className="h4">SCIM provisioning</h2><span className="status status-ok">Syncing</span></div><p className="small">Okta · 42 users, 6 groups mapped to scopes</p><div className="row between gap-12"><span className="small">Bearer token · rotated {rot}</span><button className="btn btn-secondary" onClick={() => { setRot('just now by Priya Shah'); log('Rotated SCIM token', 'Okta directory'); notify('New SCIM token generated'); }}>Rotate</button></div></div>
          <div className="card stack gap-12"><h2 className="h4">Verified domains</h2><div className="row between"><span style={{ fontWeight: 600 }}>acme.com</span><span className="status status-ok">Verified</span></div><div className="row between"><span style={{ fontWeight: 600 }}>acme.co.uk</span><span className="status status-warn">Pending DNS</span></div></div>
          <div className="card stack gap-12"><h2 className="h4">Sessions</h2><Toggle id="t2" label="Sign out after 12 hours of inactivity" checked={sess} onChange={tog('Session timeout', setSess)} /><Toggle id="t3" label="Restrict access to company IP ranges" checked={ip} onChange={tog('IP allowlist', setIp)} /></div>
        </div>
      </div>
    </>
  );
}

function Policies({ log, notify }: any) {
  const [rules, setRules] = useState<[string, string, Level][]>([['#leadership, #legal', 'Slack channels', 'Confidential'], ['Notion · Pricing', 'Workspace', 'Restricted'], ['Contains “salary”, “offer”, “termination”', 'Keyword match', 'Confidential'], ['Everything else', 'Default level', 'Internal']]);
  const [ret, setRet] = useState('30 days');
  const [recRet, setRecRet] = useState('Until deleted');
  const [holds, setHolds] = useState([{ name: 'Northwind contract review', scope: '#deal-desk, Gmail · Legal', count: 18, on: true }, { name: 'Q3 pricing change', scope: '#pricing, Notion · Pricing', count: 7, on: false }]);
  return (
    <>
      <Header title="Classification & retention" sub="Rules run before anything reaches search, Pulse or an agent" />
      <div className="grid g4">{[['Public', 'Everyone and approved Guests'], ['Internal', 'All Members (default)'], ['Restricted', 'Scope members only'], ['Confidential', 'Explicit grants, all access logged']].map(([l, d]) => <div className="card stack gap-8" key={l}><Cls l={l as Level} /><span className="small">{d}</span></div>)}</div>
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '14px 20px' }}><h2 className="h4">Auto-classification rules</h2></div>
        {rules.map(([a, b, l], i) => <div key={a} className="row between wrap gap-12" style={{ padding: '12px 20px', borderTop: '1px solid var(--border)' }}><div><div style={{ fontWeight: 600 }}>{a}</div><div className="caption">{b}</div></div>
          <select aria-label={`Level for ${a}`} className="select" style={{ width: 170 }} value={l} onChange={(e) => { const v = e.target.value as Level; setRules(rules.map((r, j) => j === i ? [r[0], r[1], v] : r)); log('Updated rule', `${a} → ${v}`); notify(`Rule updated: ${a} → ${v}`); }}>{LEVELS.map((x) => <option key={x}>{x}</option>)}</select></div>)}
      </div>
      <div className="card stack gap-12"><h2 className="h4">Retention</h2>
        <div className="row between wrap gap-12"><div><div style={{ fontWeight: 600 }}>Raw messages</div><div className="caption">Purged after the retention period</div></div><select aria-label="Raw message retention" className="select" style={{ width: 170 }} value={ret} onChange={(e) => { setRet(e.target.value); log('Changed retention', `Raw messages → ${e.target.value}`); notify(`Retention set to ${e.target.value}`); }}>{['7 days', '14 days', '30 days'].map((x) => <option key={x}>{x}</option>)}</select></div>
        <div className="row between wrap gap-12"><div><div style={{ fontWeight: 600 }}>Decision records</div><div className="caption">Structured decisions, owners and source links</div></div><select aria-label="Decision record retention" className="select" style={{ width: 170 }} value={recRet} onChange={(e) => { setRecRet(e.target.value); log('Changed retention', `Decision records → ${e.target.value}`); notify(`Decision records kept ${e.target.value.toLowerCase()}`); }}>{['Until deleted', '3 years', '1 year'].map((x) => <option key={x}>{x}</option>)}</select></div>
        <div className="row between wrap gap-12"><div><div style={{ fontWeight: 600 }}>Personal sources</div><div className="caption">Visible only to their owner, including from Admins</div></div><span className="status status-ok">Always on</span></div>
      </div>
      <div className="card stack gap-12">
        <div className="row between wrap gap-8"><h2 className="h4">Legal hold</h2><span className="caption">Held records are exempt from retention and deletion</span></div>
        {holds.map((h, i) => (
          <div key={h.name} className="row between wrap gap-12" style={{ paddingTop: 12, borderTop: '1px solid var(--border)' }}>
            <div><div style={{ fontWeight: 600 }}>{h.name}</div><div className="caption">{h.scope} · {h.count} records</div></div>
            <button className={`btn ${h.on ? 'btn-secondary' : 'btn-primary'}`} onClick={() => { setHolds(holds.map((x, j) => j === i ? { ...x, on: !x.on } : x)); log(h.on ? 'Released legal hold' : 'Placed legal hold', `${h.name} · ${h.count} records`); notify(h.on ? `Hold released: ${h.name}` : `Hold placed: ${h.count} records frozen`); }}>{h.on ? 'Release hold' : 'Place hold'}</button>
          </div>
        ))}
      </div>
      <div className="card row between wrap gap-12">
        <div><h2 className="h4">Export workspace</h2><div className="caption">Every decision record you can see, with owner, classification and source, as JSON</div></div>
        <button className="btn btn-secondary" onClick={() => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(RECORDS, null, 2)], { type: 'application/json' })); a.download = 'locus-ai-export.json'; a.click(); log('Exported workspace', `${RECORDS.length} records`); notify(`Exported ${RECORDS.length} records`); }}>Export JSON</button>
      </div>
    </>
  );
}

function Audit({ audit }: { audit: [string, string, string, string][] }) {
  const [f, setF] = useState('All');
  const groups: Record<string, RegExp> = { All: /./, Access: /access/i, Roles: /role|invite|provision/i, Sources: /source|reconnect/i, Policies: /rule|retention|classification|security|scim/i };
  const rows = audit.filter((r) => groups[f].test(r[2]));
  const exportCsv = () => { const csv = ['time,actor,event,object', ...rows.map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(','))].join('\n'); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'locus-ai-audit-log.csv'; a.click(); };
  return (
    <>
      <Header title="Audit log" sub="Every admin action and confidential access. Changes you make in this demo appear here." right={<button className="btn btn-secondary" onClick={exportCsv}>Export CSV</button>} />
      <div className="row gap-8 wrap">{Object.keys(groups).map((g) => <button key={g} className="chip" aria-pressed={f === g} onClick={() => setF(g)}>{g}</button>)}</div>
      <div className="table-wrap"><table className="table"><thead><tr><th>Time</th><th>Actor</th><th>Event</th><th className="hide-sm">Object</th></tr></thead><tbody>
        {rows.map((r, i) => <tr key={i} className={i === 0 ? 'panel-in' : ''}><td className="muted" style={{ whiteSpace: 'nowrap' }}>{r[0]}</td><td style={{ fontWeight: 600 }}>{r[1]}</td><td>{r[2]}</td><td className="hide-sm muted">{r[3]}</td></tr>)}
      </tbody></table></div>
    </>
  );
}


/* ===================== Token meter ===================== */
type ModelDef = { id: string; name: string; provider: string; tier: 'Large' | 'Medium' | 'Small' };
const MODELS: ModelDef[] = [
  { id: 'claude-opus', name: 'Claude Opus', provider: 'Anthropic', tier: 'Large' },
  { id: 'claude-sonnet', name: 'Claude Sonnet', provider: 'Anthropic', tier: 'Medium' },
  { id: 'claude-haiku', name: 'Claude Haiku', provider: 'Anthropic', tier: 'Small' },
  { id: 'gpt-flagship', name: 'GPT flagship', provider: 'OpenAI', tier: 'Large' },
  { id: 'gpt-mini', name: 'GPT mini', provider: 'OpenAI', tier: 'Small' },
  { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', tier: 'Large' },
  { id: 'gemini-flash', name: 'Gemini Flash', provider: 'Google', tier: 'Small' },
  { id: 'llama', name: 'Llama, self-hosted', provider: 'Self-hosted', tier: 'Medium' },
];
const PROVIDERS = ['Anthropic', 'OpenAI', 'Google', 'Self-hosted'];
const STAGES = [
  { id: 'triage', name: 'Triage gate', desc: 'Skips noise before extraction', mtd: 14.2, team: 'all' },
  { id: 'extract', name: 'Decision extraction', desc: 'Owner, rationale, source, class', mtd: 9.8 },
  { id: 'search', name: 'Search answers', desc: 'Answers people read', mtd: 4.6 },
  { id: 'agents', name: 'Agent calls (MCP)', desc: 'Context returned to agents', mtd: 2.1 },
  { id: 'pulse', name: 'Team Pulse digests', desc: 'Weekly summaries per team', mtd: 0.7 },
];
const STAGE_HUE: Record<string, string> = { triage: '#9F95F0', extract: '#6D5AE6', search: '#0E9F8E', agents: '#2F6FEB', pulse: '#C77A12' };
const DAY = 16, DAYS = 31;
type UsageCfg = { route: Record<string, string>; budget: number; alert: number; cap: boolean; providers: Record<string, boolean>; rates: Record<string, number> };
const DEFAULT_USAGE: UsageCfg = {
  route: { triage: 'claude-haiku', extract: 'claude-sonnet', search: 'claude-sonnet', agents: 'claude-sonnet', pulse: 'claude-opus' },
  budget: 130, alert: 80, cap: false,
  providers: { Anthropic: true, OpenAI: false, Google: false, 'Self-hosted': false },
  rates: { 'claude-opus': 15, 'claude-sonnet': 3, 'claude-haiku': 0.8, 'gpt-flagship': 10, 'gpt-mini': 0.6, 'gemini-pro': 7, 'gemini-flash': 0.5, llama: 0.3 },
};
const money = (n: number) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: n < 100 ? 2 : 0, maximumFractionDigits: n < 100 ? 2 : 0 });
const model = (id: string) => MODELS.find((m) => m.id === id)!;
function calc(cfg: UsageCfg) {
  const rows = STAGES.map((st) => { const m = cfg.route[st.id]; const spend = st.mtd * (cfg.rates[m] ?? 0); return { ...st, model: m, spend }; });
  const spend = rows.reduce((a, r) => a + r.spend, 0);
  const tokens = rows.reduce((a, r) => a + r.mtd, 0);
  const proj = (spend / DAY) * DAYS;
  const used = spend / cfg.budget, projPct = proj / cfg.budget;
  const state = projPct > 1 ? 'over' : projPct * 100 >= cfg.alert ? 'warn' : 'ok';
  return { rows, spend, tokens, proj, projTokens: (tokens / DAY) * DAYS, used, projPct, state };
}
function suggest(cfg: UsageCfg) {
  const c = calc(cfg);
  const enabled = MODELS.filter((m) => cfg.providers[m.provider]);
  let best: { stage: string; from: string; to: string; save: number } | null = null;
  c.rows.forEach((r) => {
    const cur = cfg.rates[r.model];
    const cheaper = enabled.filter((m) => cfg.rates[m.id] < cur && (r.id === 'triage' || m.tier !== 'Small')).sort((a, b) => cfg.rates[b.id] - cfg.rates[a.id])[0];
    if (!cheaper) return;
    const save = (r.mtd * (cur - cfg.rates[cheaper.id]) / DAY) * DAYS;
    if (!best || save > best.save) best = { stage: r.id, from: r.model, to: cheaper.id, save };
  });
  return best as { stage: string; from: string; to: string; save: number } | null;
}

function Gauge({ cfg, size = 220 }: { cfg: UsageCfg; size?: number }) {
  const c = calc(cfg);
  const r = 80, cx = 100, cy = 96, L = Math.PI * r;
  const arc = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  const u = Math.min(c.used, 1), p = Math.min(c.projPct, 1);
  const col = c.state === 'over' ? 'var(--danger)' : c.state === 'warn' ? 'var(--warning)' : 'var(--brand)';
  const a = (cfg.alert / 100) * Math.PI;
  const ax = cx - r * Math.cos(a), ay = cy - r * Math.sin(a);
  return (
    <svg viewBox="0 0 200 118" width={size} role="img" aria-label={`${money(c.spend)} used of ${money(cfg.budget)} budget, projected ${money(c.proj)}`} className="gauge">
      <path d={arc} fill="none" stroke="var(--bg-subtle)" strokeWidth="14" strokeLinecap="round" />
      <path d={arc} fill="none" stroke={col} strokeOpacity=".28" strokeWidth="14" strokeLinecap="round" strokeDasharray={`${p * L} ${L}`} style={{ transition: 'stroke-dasharray .7s cubic-bezier(.2,.8,.2,1)' }} />
      <path d={arc} fill="none" stroke={col} strokeWidth="14" strokeLinecap="round" strokeDasharray={`${u * L} ${L}`} style={{ transition: 'stroke-dasharray .7s cubic-bezier(.2,.8,.2,1), stroke .3s' }} />
      <line x1={ax} y1={ay} x2={cx - (r + 12) * Math.cos(a)} y2={cy - (r + 12) * Math.sin(a)} stroke="var(--text-3)" strokeWidth="1.5" />
      <text x={cx} y={cy - 22} textAnchor="middle" fontSize="22" fontWeight="700" fill="var(--text)">{money(c.spend)}</text>
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="9.5" fill="var(--text-2)">of {money(cfg.budget)} this month</text>
      <text x={cx - r} y={cy + 16} textAnchor="middle" fontSize="8" fill="var(--text-3)">$0</text>
      <text x={cx + r} y={cy + 16} textAnchor="middle" fontSize="8" fill="var(--text-3)">{money(cfg.budget)}</text>
    </svg>
  );
}

function TokenMeterCard({ cfg, go }: { cfg: UsageCfg; go: (s: Screen) => void }) {
  const c = calc(cfg);
  const byModel = Object.entries(c.rows.reduce((a: Record<string, number>, r) => { a[r.model] = (a[r.model] || 0) + r.mtd; return a; }, {}));
  return (
    <div className="card tm-card">
      <Gauge cfg={cfg} size={190} />
      <div className="stack gap-8" style={{ flex: 1, minWidth: 0 }}>
        <div className="row between wrap gap-8"><strong>Token meter</strong><span className={`tm-badge ${c.state}`}>{c.state === 'over' ? 'Projected over budget' : c.state === 'warn' ? `Above ${cfg.alert}% alert` : 'On track'}</span></div>
        <p className="small" style={{ margin: 0 }}>{c.tokens.toFixed(1)}M tokens so far, day {DAY} of {DAYS}. Projected <b style={{ color: 'var(--text)' }}>{money(c.proj)}</b> by Oct 31.</p>
        <div className="tm-split">{byModel.map(([m, t]) => <span key={m} style={{ flex: t, background: m.startsWith('claude-opus') ? '#C77A12' : m.includes('haiku') || m.includes('mini') || m.includes('flash') ? '#9F95F0' : '#6D5AE6' }} title={`${model(m).name}: ${t.toFixed(1)}M`} />)}</div>
        <div className="row gap-12 wrap caption">{byModel.map(([m, t]) => <span key={m}>{model(m).name} {Math.round((t / c.tokens) * 100)}%</span>)}</div>
        <div><button className="btn btn-secondary" onClick={() => go('usage')}>Manage models and budget</button></div>
      </div>
    </div>
  );
}

function Usage({ cfg, setCfg, log, notify }: { cfg: UsageCfg; setCfg: (c: UsageCfg) => void; log: (a: string, b: string) => void; notify: (m: string) => void }) {
  const c = calc(cfg);
  const sug = suggest(cfg);
  const enabled = MODELS.filter((m) => cfg.providers[m.provider]);
  const setRoute = (stage: string, m: string) => { const st = STAGES.find((x) => x.id === stage)!; setCfg({ ...cfg, route: { ...cfg.route, [stage]: m } }); log('Changed model routing', `${st.name} → ${model(m).name}`); notify(`${st.name} now runs on ${model(m).name}.`); };
  const toggleProvider = (p: string) => {
    const next = { ...cfg.providers, [p]: !cfg.providers[p] };
    if (!Object.values(next).some(Boolean)) { notify('Keep at least one provider enabled.'); return; }
    const fallback = MODELS.find((m) => next[m.provider])!.id;
    const route = Object.fromEntries(Object.entries(cfg.route).map(([k, v]) => [k, next[model(v).provider] ? v : fallback]));
    setCfg({ ...cfg, providers: next, route }); log(next[p] ? 'Enabled provider' : 'Disabled provider', p); notify(`${p} ${next[p] ? 'enabled' : 'disabled'}.`);
  };
  // daily series: actual days 1..DAY, projected after
  const weights = Array.from({ length: DAYS }, (_, i) => { const dow = (i + 3) % 7; return dow === 5 || dow === 6 ? 0.45 : 1 + ((i * 37) % 7) / 20; });
  const wSum = weights.slice(0, DAY).reduce((a, b) => a + b, 0);
  const daily = weights.map((w) => (c.tokens * w) / wSum);
  const maxD = Math.max(...daily);
  const teams: [string, number][] = [['Platform', 34], ['Growth', 22], ['Launch', 18], ['Infra', 11], ['Security', 8], ['Legal', 7]];
  return (
    <>
      <Header title="Models & usage" sub={`October 1–31 · day ${DAY} of ${DAYS} · costs use the rates below`} right={<span className={`tm-badge ${c.state}`}>{c.state === 'over' ? `Projected ${money(c.proj - cfg.budget)} over budget` : c.state === 'warn' ? `Projected ${Math.round(c.projPct * 100)}% of budget` : 'On track'}</span>} />
      <div className="usage-top">
        <div className="card usage-gauge">
          <Gauge cfg={cfg} size={260} />
          <div className="usage-kpis">
            {[['Spend so far', money(c.spend)], ['Projected by Oct 31', money(c.proj)], ['Tokens so far', `${c.tokens.toFixed(1)}M`], ['Projected tokens', `${c.projTokens.toFixed(1)}M`]].map(([k, v]) => <div key={k}><span className="caption">{k}</span><b>{v}</b></div>)}
          </div>
          <div className="bymodel">
            <span className="caption">Spend by model</span>
            {Object.entries(c.rows.reduce((a: Record<string, { t: number; s: number }>, r) => { const x = a[r.model] || { t: 0, s: 0 }; a[r.model] = { t: x.t + r.mtd, s: x.s + r.spend }; return a; }, {})).sort((a, b) => b[1].s - a[1].s).map(([m, v]) => (
              <div key={m} className="bm-row"><span className="small" style={{ color: 'var(--text)' }}>{model(m).name}<span className="caption"> · {model(m).provider}</span></span><span className="reach-bar"><span style={{ width: `${c.spend ? (v.s / c.spend) * 100 : 0}%` }} /></span><span className="caption num">{v.t.toFixed(1)}M · {money(v.s)}</span></div>
            ))}
          </div>
        </div>
        <div className="card stack gap-16">
          <strong>Budget and alerts</strong>
          <div className="field"><label htmlFor="bud">Monthly budget (USD)</label><input id="bud" className="input" type="number" min={10} step={10} value={cfg.budget} onChange={(e) => setCfg({ ...cfg, budget: Math.max(10, Number(e.target.value) || 10) })} onBlur={() => log('Updated token budget', money(cfg.budget))} /></div>
          <label className="calc-field"><span className="calc-label"><span>Alert admins when projected spend reaches</span><output>{cfg.alert}%</output></span><input type="range" min={50} max={100} step={5} value={cfg.alert} onChange={(e) => setCfg({ ...cfg, alert: Number(e.target.value) })} style={{ ['--p' as any]: `${((cfg.alert - 50) / 50) * 100}%` }} /></label>
          <label className="row gap-12" style={{ cursor: 'pointer' }}><input type="checkbox" checked={cfg.cap} onChange={(e) => { setCfg({ ...cfg, cap: e.target.checked }); log(e.target.checked ? 'Enabled budget cap' : 'Disabled budget cap', 'Pause digests at 100%'); }} /><span className="small">At 100% of budget, pause Team Pulse digests and keep capture, search and agent calls running.</span></label>
          {sug && c.state !== 'ok' && (
            <div className="sug">
              <span className="small" style={{ color: 'var(--text)' }}>Move <b>{STAGES.find((x) => x.id === sug.stage)!.name}</b> from {model(sug.from).name} to <b>{model(sug.to).name}</b> to save about <b>{money(sug.save)}</b> this month.</span>
              <button className="btn btn-primary" onClick={() => setRoute(sug.stage, sug.to)}>Apply</button>
            </div>
          )}
        </div>
      </div>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="row between wrap gap-8" style={{ padding: '16px 18px' }}><strong>Model routing</strong><span className="caption">Choose which model runs each stage. Only enabled providers are listed.</span></div>
        <div className="table-wrap" style={{ border: 0, borderRadius: 0 }}><table className="table routing"><thead><tr><th>Stage</th><th>Model</th><th>Tokens so far</th><th>Spend so far</th><th className="hide-sm">Share of spend</th></tr></thead><tbody>
          {c.rows.map((r) => (
            <tr key={r.id}>
              <td><div className="row gap-8"><i className="sw" style={{ background: STAGE_HUE[r.id] }} /><div><div style={{ fontWeight: 600 }}>{r.name}</div><div className="caption">{r.desc}</div></div></div></td>
              <td><label className="sr-only" htmlFor={`m-${r.id}`}>Model for {r.name}</label><select id={`m-${r.id}`} className="select" style={{ minWidth: 190 }} value={r.model} onChange={(e) => setRoute(r.id, e.target.value)}>{PROVIDERS.filter((p) => cfg.providers[p]).map((p) => <optgroup key={p} label={p}>{enabled.filter((m) => m.provider === p).map((m) => <option key={m.id} value={m.id}>{m.name} · {m.tier}</option>)}</optgroup>)}</select></td>
              <td className="num">{r.mtd.toFixed(1)}M</td>
              <td className="num">{money(r.spend)}</td>
              <td className="hide-sm"><span className="reach-bar" style={{ display: 'block', width: 160 }}><span style={{ width: `${c.spend ? (r.spend / c.spend) * 100 : 0}%`, background: STAGE_HUE[r.id] }} /></span></td>
            </tr>
          ))}
        </tbody></table></div>
      </div>
      <div className="usage-grid">
        <div className="card stack gap-12">
          <div className="row between wrap gap-8"><strong>Daily tokens</strong><span className="caption">Solid: actual · faded: projected</span></div>
          <div className="daily" role="img" aria-label={`Daily tokens for October, ${c.tokens.toFixed(1)} million so far`}>
            {daily.map((d, i) => (
              <span key={i} className={`dbar ${i >= DAY ? 'proj' : ''}`} style={{ height: `${(d / maxD) * 100}%` }} title={`Oct ${i + 1}: ${d.toFixed(2)}M tokens`}>
                {i < DAY && STAGES.map((st) => <i key={st.id} style={{ flex: st.mtd, background: STAGE_HUE[st.id] }} />)}
              </span>
            ))}
          </div>
          <div className="row gap-12 wrap caption">{STAGES.map((st) => <span key={st.id} className="row gap-4"><i className="sw" style={{ background: STAGE_HUE[st.id] }} />{st.name}</span>)}</div>
        </div>
        <div className="card stack gap-12">
          <strong>Providers and rates</strong>
          <p className="caption" style={{ margin: 0 }}>Example rates in USD per million tokens. Replace them with your contracted prices.</p>
          {PROVIDERS.map((p) => (
            <div key={p} className="prov">
              <label className="row gap-8" style={{ cursor: 'pointer' }}><input type="checkbox" checked={!!cfg.providers[p]} onChange={() => toggleProvider(p)} /><strong className="small" style={{ color: 'var(--text)' }}>{p}</strong><span className="caption" style={{ marginLeft: 'auto' }}>{cfg.providers[p] ? (p === 'Self-hosted' ? 'Your endpoint' : p === 'Anthropic' ? 'Locus AI key' : 'Your API key') : 'Off'}</span></label>
              {cfg.providers[p] && MODELS.filter((m) => m.provider === p).map((m) => (
                <div key={m.id} className="rate"><span className="small">{m.name}</span><span className="caption">{m.tier}</span><label className="sr-only" htmlFor={`r-${m.id}`}>Rate for {m.name}</label><input id={`r-${m.id}`} className="input" type="number" min={0} step={0.1} value={cfg.rates[m.id]} onChange={(e) => setCfg({ ...cfg, rates: { ...cfg.rates, [m.id]: Math.max(0, Number(e.target.value) || 0) } })} /></div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="card stack gap-12">
        <div className="row between wrap gap-8"><strong>Usage by team</strong><span className="caption">Share of tokens this month</span></div>
        {teams.map(([t, pc]) => <div key={t} className="reach" style={{ gridTemplateColumns: '100px minmax(0,1fr) 90px' }}><span className="small" style={{ color: 'var(--text)' }}>{t}</span><span className="reach-bar"><span style={{ width: `${pc}%` }} /></span><span className="caption">{((c.tokens * pc) / 100).toFixed(1)}M · {pc}%</span></div>)}
      </div>
    </>
  );
}


/* ===================== Adoption & ROI ===================== */
const WEEKS = ['Aug 25', 'Sep 1', 'Sep 8', 'Sep 15', 'Sep 22', 'Sep 29', 'Oct 6', 'Oct 13'];
const PEOPLE_Q = [38, 61, 84, 97, 118, 126, 141, 152];
const AGENT_Q = [0, 12, 40, 96, 180, 244, 310, 362];
const TEAM_ADOPT: [string, number, number, number, number, number][] = [
  // team, active, total, searches/wk, agent queries/wk, decisions captured (30d)
  ['Platform', 16, 18, 46, 148, 96], ['Growth', 11, 14, 38, 92, 71], ['Launch', 9, 12, 29, 64, 58], ['Support', 14, 22, 22, 41, 33], ['Legal', 3, 6, 9, 0, 21], ['Security', 4, 6, 8, 17, 14],
];

function Adoption() {
  const [mins, setMins] = useState(4);
  const [rate, setRate] = useState(75);
  const [cost, setCost] = useState(3000);
  const [half, setHalf] = useState(true);
  const [hl, setHl] = useState<number | null>(null);
  const pMonth = PEOPLE_Q.slice(-4).reduce((a, b) => a + b, 0), aMonth = AGENT_Q.slice(-4).reduce((a, b) => a + b, 0);
  const qMonth = pMonth + aMonth;
  const hours = ((pMonth + aMonth * (half ? 0.5 : 1)) * mins) / 60;
  const value = hours * rate;
  const roi = value / Math.max(cost, 1);
  const active = TEAM_ADOPT.reduce((a, t) => a + t[1], 0), total = TEAM_ADOPT.reduce((a, t) => a + t[2], 0);
  const maxW = Math.max(...PEOPLE_Q.map((p, i) => p + AGENT_Q[i]));
  const exportCsv = () => { const csv = ['team,active,total,searches_per_week,agent_queries_per_week,decisions_30d', ...TEAM_ADOPT.map((t) => t.join(','))].join('\n'); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'locus-ai-adoption.csv'; a.click(); };
  return (
    <>
      <Header title="Adoption & ROI" sub="Last 8 weeks · sample data for Acme" right={<button className="btn btn-secondary" onClick={exportCsv}>Export CSV</button>} />
      <div className="grid g4">
        {[['Weekly active people', `${active} of ${total}`, `${Math.round((active / total) * 100)}% of invited people`], ['Agents querying', '4', 'support, release, review, onboarding'], ['Questions answered', qMonth.toLocaleString(), 'last 4 weeks, people and agents'], ['Plans changed before action', '23', 'Decision Guard conflicts, last 30 days']].map(([k, v, d]) => (
          <div className="card stat" key={k}><span className="caption">{k}</span><b>{v}</b><span className="caption">{d}</span></div>
        ))}
      </div>
      <div className="adopt-grid">
        <div className="card stack gap-12">
          <div className="row between wrap gap-8"><strong>Questions per week</strong><span className="row gap-12 caption"><span><i className="lg-dot" style={{ background: 'var(--brand)' }} />People</span><span><i className="lg-dot" style={{ background: '#C7BFFA' }} />Agents</span></span></div>
          <div className="adopt-chart" role="img" aria-label={WEEKS.map((w, i) => `${w}: ${PEOPLE_Q[i]} people, ${AGENT_Q[i]} agents`).join('; ')}>
            {WEEKS.map((w, i) => (
              <div key={w} className={`adopt-col ${hl === i ? 'on' : ''}`} onMouseEnter={() => setHl(i)} onMouseLeave={() => setHl(null)}>
                <div className="adopt-stack" style={{ height: `${((PEOPLE_Q[i] + AGENT_Q[i]) / maxW) * 100}%` }}>
                  <span style={{ flex: AGENT_Q[i], background: '#C7BFFA' }} />
                  <span style={{ flex: PEOPLE_Q[i], background: 'var(--brand)' }} />
                </div>
                <span className="adopt-x">{w}</span>
                {hl === i && <span className="adopt-tip">{PEOPLE_Q[i]} people · {AGENT_Q[i]} agents</span>}
              </div>
            ))}
          </div>
          <p className="caption" style={{ margin: 0 }}>Agent queries overtook people in week 5, after the support agent was connected over MCP.</p>
        </div>
        <div className="card stack gap-12">
          <div className="row between wrap gap-8"><strong>ROI estimate</strong><span className="tm-badge warn">Your inputs, not a measured result</span></div>
          <label className="roi-in"><span>Minutes saved per answered question</span><input type="range" min={2} max={30} value={mins} onChange={(e) => setMins(+e.target.value)} /><b>{mins} min</b></label>
          <label className="roi-in"><span>Loaded hourly cost</span><input type="range" min={30} max={200} step={5} value={rate} onChange={(e) => setRate(+e.target.value)} /><b>${rate}</b></label>
          <label className="roi-in"><span>Locus AI cost per month</span><input type="range" min={500} max={10000} step={250} value={cost} onChange={(e) => setCost(+e.target.value)} /><b>${cost.toLocaleString()}</b></label>
          <div className="roi-out">
            <div><span className="caption">Hours saved / month</span><b>{Math.round(hours).toLocaleString()}</b></div>
            <div><span className="caption">Value / month</span><b>${Math.round(value).toLocaleString()}</b></div>
            <div><span className="caption">Return on cost</span><b className={roi >= 1 ? 'pos' : 'neg'}>{roi.toFixed(1)}×</b></div>
          </div>
          <label className="row gap-8 small" style={{ alignItems: 'center' }}><input type="checkbox" checked={half} onChange={(e) => setHalf(e.target.checked)} style={{ accentColor: 'var(--brand)' }} />Count agent questions at half value</label>
          <p className="caption" style={{ margin: 0 }}>Based on {pMonth.toLocaleString()} questions from people and {aMonth.toLocaleString()} from agents in the last 4 weeks. Start conservative and replace these inputs with numbers from your own pilot.</p>
        </div>
      </div>
      <div className="table-wrap"><table className="table"><thead><tr><th>Team</th><th>Active</th><th className="hide-sm">Searches / wk</th><th className="hide-sm">Agent queries / wk</th><th>Decisions (30d)</th></tr></thead><tbody>
        {TEAM_ADOPT.map(([t, a, n, s, q, d]) => (
          <tr key={t}><td style={{ fontWeight: 600 }}>{t}</td><td><div className="row gap-8" style={{ alignItems: 'center' }}><div className="bar-track" style={{ maxWidth: 90, height: 8 }}><div className="bar-fill" style={{ width: `${(a / n) * 100}%`, height: 8, background: a / n < 0.6 ? 'var(--warning)' : undefined }} /></div><span className="caption">{a}/{n}</span></div></td><td className="hide-sm">{s}</td><td className="hide-sm">{q}</td><td>{d}</td></tr>
        ))}
      </tbody></table></div>
    </>
  );
}
