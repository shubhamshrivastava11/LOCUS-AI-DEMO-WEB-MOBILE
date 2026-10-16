import Link from 'next/link';
import type { Metadata } from 'next';
import { Reveal } from '@/components/Interactive';
import { CtaBand, Cls, PageHero, SectionHead, Tag } from '@/components/Sections';
import { PILLARS } from '@/lib/content';
import { AgentRail, HeroPreview, Lifecycle } from '@/components/Home';

export const metadata: Metadata = { title: 'Product', description: 'Context Search, Memory Explorer, Team Pulse and an MCP server, built on one governed organizational memory.' };

function Visual({ k }: { k: string }) {
  if (k === 'search') return (
    <div className="card stack gap-12" style={{ boxShadow: 'var(--shadow-md)' }}>
      <div className="row gap-8 wrap"><Tag t="Decision" /><Cls l="Internal" /><span className="caption">High confidence · active</span></div>
      <p style={{ margin: 0, fontSize: 16 }}>On June 12 the launch team moved the Q3 release to <b>July 29</b> to ship SSO in the same release. <span style={{ color: 'var(--link)' }}>[1] [2]</span></p>
      <hr className="divider" />
      <span className="overline" style={{ color: 'var(--text-3)' }}>Why you can see this</span>
      <p className="small">You are a Member of #launch-planning. 1 Confidential source was excluded from this answer.</p>
    </div>
  );
  if (k === 'explorer') return (
    <div className="table-wrap" style={{ boxShadow: 'var(--shadow-md)' }}><table className="table"><thead><tr><th>Type</th><th>Summary</th><th>Owner</th><th>Class</th></tr></thead><tbody>
      {[['Decision', 'Adopt Postgres + pgvector', 'Platform', 'Internal'], ['Blocker', 'Legal review of EU DPA', 'Legal', 'Confidential'], ['Action', 'Draft SSO rollout plan', 'Priya S.', 'Internal'], ['Superseded', 'Free tier unlimited seats', 'Growth', 'Restricted']].map(([t, s, o, c]) => <tr key={s}><td><Tag t={t as any} /></td><td style={{ fontWeight: 600 }}>{s}</td><td className="muted">{o}</td><td><Cls l={c} /></td></tr>)}
    </tbody></table></div>
  );
  if (k === 'pulse') return (
    <div className="card stack gap-16" style={{ boxShadow: 'var(--shadow-md)' }}>
      <span className="overline" style={{ color: 'var(--text-3)' }}>This week in one read</span>
      {[['Shipped', 'Q3 launch locked for July 29 with SSO.'], ['Changed', 'Free tier capped at 20 seats, replacing the August plan.'], ['Stuck', 'Legal DPA review, 6 days and counting.'], ['Next', 'SSO rollout plan due Friday.']].map(([a, b]) => <div key={a}><div className="mono caption" style={{ color: a === 'Stuck' ? 'var(--warning)' : 'var(--link)' }}>{a.toUpperCase()}</div><div style={{ fontSize: 15 }}>{b}</div></div>)}
    </div>
  );
  return <div className="code"><span className="c">{'// tools exposed by the Locus AI MCP server'}</span>{'\n'}<span className="k">search_decisions</span>(query, team?, since?){'\n'}<span className="k">get_decision_context</span>(decision_id){'\n'}<span className="k">log_decision</span>(summary, owner, source){'\n\n'}<span className="c">{'// every call runs with the caller’s permissions'}</span></div>;
}

export default function Product() {
  return (
    <>
      <PageHero overline="Product" title={<>One governed memory.<br />Four ways to use it.</>} lead="Locus AI turns conversations into structured, cited, permission-aware decisions, then serves them in the app, in weekly digests and to your AI agents.">
        <div className="row gap-12 wrap" style={{ justifyContent: 'center' }}><Link className="btn btn-primary btn-lg" href="/demo">Try the live demo</Link><Link className="btn btn-secondary btn-lg" href="/contact">Book a demo</Link></div>
      </PageHero>
      <section className="section">
        <div className="container">
          <SectionHead overline="The missing layer" title="LLMs reason. RAG retrieves. Agents execute. Locus AI remembers." lead="Retrieval finds documents. Memory knows which decision is current, who made it, what it replaced and who is allowed to see it." />
          <div className="grid g4">
            {[['01 · LLMs', 'reason.'], ['02 · RAG', 'retrieves.'], ['03 · Agents', 'execute.'], ['04 · Locus AI', 'remembers.']].map(([a, b], i) => (
              <Reveal key={a} delay={i * 90}>
                <div className={`stack-card ${i === 3 ? 'on' : ''}`}><span className="mono caption">{a}</span><span className="h2">{b}</span></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="container">
          <SectionHead overline="How it works" title="Connect once. Every decision is captured, governed and ready to recall." />
          <Lifecycle />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHead overline="One memory, two audiences" title="Built for the people deciding and the agents acting on it." lead="Same decision, same permissions. Switch between what a person sees and what an agent gets." />
          <div className="preview-light"><HeroPreview /></div>
        </div>
      </section>
      {PILLARS.map((p, i) => (
        <section key={p.key} id={p.key} className={`section ${i % 2 ? 'alt' : ''}`} style={{ scrollMarginTop: 80 }}>
          <div className="container grid g2" style={{ alignItems: 'center', gap: 56 }}>
            <Reveal className="stack gap-16" >
              <p className="overline">{p.name}</p>
              <h2 className="h1">{p.title}</h2>
              <p className="lead">{p.body}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>{p.bullets.map((b) => <li key={b} className="row gap-8" style={{ fontFamily: p.key === 'mcp' ? 'var(--mono)' : undefined }}><span style={{ color: 'var(--brand)', fontWeight: 700 }}>✓</span>{b}</li>)}</ul>
            </Reveal>
            <Reveal><Visual k={p.key} /></Reveal>
          </div>
        </section>
      ))}
      <section className="section dark">
        <div className="container stack" style={{ gap: 8 }}>
          <Reveal className="head">
            <p className="overline">Built for agents</p>
            <h2 className="h1">Stop re-explaining context to every agent.</h2>
            <p className="lead">Locus AI is the shared memory your agents query first, through MCP, with the same permissions as the person they act for.</p>
          </Reveal>
          <AgentRail />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHead overline="Under the hood" title="From conversation to governed memory." lead="Two-model capture keeps cost down and precision up. Hybrid retrieval ranks the freshest decision first." />
          <Reveal className="row wrap gap-12" >
            {['Slack · Gmail · Notion · Jira · +6', 'Triage model', 'Extraction model', 'Classification + scope', 'Organizational memory', 'Search · Explorer · Pulse · MCP'].map((n, i, a) => (
              <span key={n} className="row gap-12"><span className="card" style={{ padding: '10px 16px', fontWeight: 600, fontSize: 14.5, background: i === 4 ? 'var(--brand)' : i === 5 ? 'var(--bg-inverse)' : undefined, color: i >= 4 ? '#fff' : undefined, border: i >= 4 ? 0 : undefined }}>{n}</span>{i < a.length - 1 && <span aria-hidden="true" className="muted">→</span>}</span>
            ))}
          </Reveal>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
