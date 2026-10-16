'use client';
import { asset } from '@/lib/base';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IconAgent, IconFile, IconHome, IconList, IconLock, IconMoon, IconPulse, IconRadar, IconSearch, IconSettings, IconShield, IconSun, IconUsers } from '@/components/Icons';

type Screen = 'home' | 'search' | 'explorer' | 'pulse' | 'agents' | 'members' | 'security' | 'policies' | 'audit';
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
  const admin: [Screen, string, any][] = [['members', 'Members & roles', IconUsers], ['security', 'Security & SSO', IconShield], ['policies', 'Policies', IconLock], ['audit', 'Audit log', IconList]];

  return (
    <>
      <div className="demo-banner"><span>Interactive demo with sample data for a fictional company, Acme.</span><Link href="/">Back to website</Link><Link href="/contact">Book a demo</Link></div>
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
          <div className="app-top">
            <form onSubmit={(e) => { e.preventDefault(); const v = (e.currentTarget.elements.namedItem('q') as HTMLInputElement).value.trim(); if (v) ask(v); }} role="search">
              <label htmlFor="global-search" className="sr-only">Search decisions</label>
              <input id="global-search" name="q" className="input" placeholder="Ask about a decision, owner or thread   ⌘K" />
            </form>
            <span className="caption hide-sm" style={{ marginLeft: 'auto' }}>Viewing as Owner · all scopes</span>
            <button className="icon-btn" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? <IconSun /> : <IconMoon />}</button>
          </div>
          <main id="main" className="app-body" key={screen}>
            <div className="panel-in stack gap-20">
              {screen === 'home' && <Home records={records} ask={ask} open={setOpen} gmailOk={gmailOk} reconnect={() => { setGmailOk(true); log('Reconnected source', 'Gmail'); notify('Gmail reconnected. Capturing resumed.'); }} go={setScreen} />}
              {screen === 'search' && <Search query={query} ask={ask} notify={notify} gmailOk={gmailOk} />}
              {screen === 'explorer' && <Explorer records={records} open={setOpen} notify={notify} />}
              {screen === 'pulse' && <Pulse records={records} notify={notify} />}
              {screen === 'agents' && <Agents />}
              {screen === 'members' && <Members log={log} notify={notify} />}
              {screen === 'security' && <Security log={log} notify={notify} />}
              {screen === 'policies' && <Policies log={log} notify={notify} />}
              {screen === 'audit' && <Audit audit={audit} />}
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

function Home({ records, ask, open, gmailOk, reconnect, go }: any) {
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

function Members({ log, notify }: any) {
  const [rows, setRows] = useState([['Priya Shah', 'priya@acme.com', 'All scopes', 'Now', 'Owner'], ['Maya Chen', 'maya@acme.com', 'All scopes', '2h ago', 'Admin'], ['Arjun Mehta', 'arjun@acme.com', 'Platform, Infra', 'Yesterday', 'Lead'], ['Sam Lee', 'sam@acme.com', 'Growth', '3 days ago', 'Member'], ['Jordan Cole', 'contractor@agency.io', '#launch-planning', 'Expires Nov 12', 'Guest']]);
  const [inviting, setInviting] = useState(false);
  const [email, setEmail] = useState(''); const [role, setRole] = useState('Member'); const [err, setErr] = useState('');
  return (
    <>
      <Header title="Members & roles" sub={`${rows.length} members · provisioned by Okta SCIM`} right={<button className="btn btn-primary" onClick={() => setInviting(true)}>Invite people</button>} />
      <div className="table-wrap"><table className="table"><thead><tr><th>Member</th><th className="hide-sm">Scopes</th><th className="hide-sm">Last active</th><th>Role</th></tr></thead><tbody>
        {rows.map((r, i) => <tr key={r[1]}><td><div style={{ fontWeight: 600 }}>{r[0]}</div><div className="caption">{r[1]}</div></td><td className="hide-sm muted">{r[2]}</td><td className="hide-sm muted">{r[3]}</td><td>
          <label className="sr-only" htmlFor={`role-${i}`}>Role for {r[0]}</label>
          <select id={`role-${i}`} className="select" style={{ width: 150 }} value={r[4]} disabled={r[4] === 'Owner'} onChange={(e) => { const v = e.target.value; setRows(rows.map((x, j) => j === i ? [...x.slice(0, 4), v] : x)); log('Changed role', `${r[0]} · ${r[4]} → ${v}`); notify(`${r[0]} is now ${v}. Logged to audit.`); }}>{ROLES.map((x) => <option key={x}>{x}</option>)}</select>
        </td></tr>)}
      </tbody></table></div>
      {inviting && <>
        <div className="drawer-scrim" onClick={() => setInviting(false)} />
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="inv-t" onClick={(e) => e.target === e.currentTarget && setInviting(false)}>
          <form className="card card-lg stack gap-16" onSubmit={(e) => { e.preventDefault(); if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { setErr('Enter a valid email.'); return; } setRows([...rows, [email.split('@')[0], email, role === 'Guest' ? 'Shared spaces only' : 'Pending invite', 'Invite sent', role]]); log('Invited user', `${email} · ${role}`); notify(`Invite sent to ${email}`); setInviting(false); setEmail(''); setErr(''); }}>
            <h2 id="inv-t" className="h3">Invite people</h2>
            <div className="field"><label htmlFor="inv-e">Email</label><input id="inv-e" className="input" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!err} placeholder="name@acme.com" /><span className={`help ${err ? 'err' : ''}`}>{err || 'Guests only see what you share and expire after 30 days.'}</span></div>
            <div className="field"><label htmlFor="inv-r">Role</label><select id="inv-r" className="select" value={role} onChange={(e) => setRole(e.target.value)}>{ROLES.filter((r) => r !== 'Owner').map((r) => <option key={r}>{r}</option>)}</select></div>
            <div className="row gap-8" style={{ justifyContent: 'flex-end' }}><button type="button" className="btn btn-ghost" onClick={() => setInviting(false)}>Cancel</button><button className="btn btn-primary">Send invite</button></div>
          </form>
        </div>
      </>}
    </>
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
        <div className="row between wrap gap-12"><div><div style={{ fontWeight: 600 }}>Raw messages</div><div className="caption">Encrypted at rest, then purged</div></div><select aria-label="Raw message retention" className="select" style={{ width: 170 }} value={ret} onChange={(e) => { setRet(e.target.value); log('Changed retention', `Raw messages → ${e.target.value}`); notify(`Retention set to ${e.target.value}`); }}>{['7 days', '14 days', '30 days'].map((x) => <option key={x}>{x}</option>)}</select></div>
        <div className="row between wrap gap-12"><div><div style={{ fontWeight: 600 }}>Personal sources</div><div className="caption">Visible only to their owner, including from Admins</div></div><span className="status status-ok">Always on</span></div>
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
