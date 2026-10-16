import Link from 'next/link';
import { Faq, ProductTabs, Reveal } from '@/components/Interactive';
import { CtaBand, Cls, SectionHead, Tag } from '@/components/Sections';
import { IconArrow, IconLink, IconLock, IconShield, IconTrash, IconUser, IconUsers } from '@/components/Icons';
import { INTEGRATIONS, SECURITY, STATS, STATS_SOURCE } from '@/lib/content';

const secIcons = [IconLock, IconTrash, IconUsers, IconShield, IconUser, IconLink];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="dark hero" style={{ marginTop: -72, paddingTop: 144 }}>
        <div className="container hero-copy hero-in">
          <Link href="/product#mcp" className="pill" style={{ textDecoration: 'none' }}><b>NEW</b>Locus AI is now an MCP server for every agent in your stack <IconArrow size={14} /></Link>
          <h1 className="display">Your AI can reason.<br /><span className="accent">Locus AI makes it remember.</span></h1>
          <p className="lead" style={{ maxWidth: 700 }}>Organizational memory infrastructure for enterprise AI. Locus AI captures every decision your team makes across Slack, Gmail, Notion, Jira and six more tools, and serves it back with sources and permissions to the people and agents who act next.</p>
          <div className="row gap-12 wrap" style={{ justifyContent: 'center' }}>
            <Link href="/contact" className="btn btn-primary btn-lg">Book a demo</Link>
            <Link href="/demo" className="btn btn-secondary btn-lg">Try the live demo <IconArrow size={16} /></Link>
          </div>
          <p className="trust">Read-only access · Raw content purged after 30 days · Every answer cited</p>
        </div>
        <div className="mock-wrap hero-in" aria-label="Product preview">
          <div className="mock">
            <div className="mock-bar"><i /><i /><i /><span className="mono caption" style={{ marginLeft: 10 }}>app.locus.ai / search</span></div>
            <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr) minmax(0,300px)', gap: 20, padding: 24 }}>
              <div className="stack gap-16">
                <div className="row gap-12" style={{ padding: '14px 16px', borderRadius: 12, border: '1.5px solid #CFC7FB', boxShadow: '0 0 0 4px #F1EEFF', fontWeight: 500 }}>Why did we move the Q3 launch to July 29?</div>
                <div className="stack gap-12" style={{ padding: 18, borderRadius: 12, background: 'var(--bg-page)', border: '1px solid var(--border)' }}>
                  <div className="row gap-8 wrap"><Tag t="Decision" /><Cls l="Internal" /><span className="caption">High confidence · 3 sources agree</span></div>
                  <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.65 }}>On June 12 the launch team moved the Q3 release from July 15 to <b>July 29</b> to finish the security review and ship SSO in the same release. Priya owns the new date. <span style={{ color: 'var(--link)', fontWeight: 600 }}>[1] [2]</span></p>
                  <div className="row gap-8 wrap">
                    {['1  Slack · #launch-planning · Jun 12', '2  Notion · Q3 Roadmap · Jun 13'].map((c) => <span key={c} className="caption" style={{ padding: '6px 10px', borderRadius: 8, background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>{c}</span>)}
                  </div>
                </div>
                <div className="stack gap-8 hide-sm" style={{ padding: '14px 18px', borderRadius: 12, border: '1px solid var(--border)' }}>
                  <span className="overline" style={{ color: 'var(--text-3)' }}>Decision lineage</span>
                  <div className="row between small"><span style={{ textDecoration: 'line-through' }}>○ Launch on July 15</span><span>May 28 · superseded</span></div>
                  <div className="row between small" style={{ color: 'var(--text)', fontWeight: 600 }}><span>● Launch on July 29 with SSO</span><span style={{ color: 'var(--success)' }}>Jun 12 · active</span></div>
                </div>
              </div>
              <div className="stack gap-12 hide-sm">
                <div className="code" style={{ fontSize: 12.5, padding: 16, borderRadius: 12 }}><span className="c">● release-agent via MCP</span>{'\n'}<span className="k">search_decisions</span>({'\n'}  query: <span className="s">&quot;Q3 launch date&quot;</span>{'\n'}){'\n'}<span className="c">→ 1 active decision, 2 sources</span></div>
                <div className="stack gap-8" style={{ padding: 16, borderRadius: 12, border: '1px solid var(--border)' }}>
                  <span className="overline" style={{ color: 'var(--text-3)' }}>Captured today</span>
                  {[['Adopt pgvector for retrieval', 'Decision'], ['Legal sign-off on DPA', 'Blocker'], ['Draft SSO rollout plan', 'Action']].map(([a, t]) => <div key={a} className="row between gap-8 small" style={{ color: 'var(--text)' }}><span>{a}</span><Tag t={t as any} /></div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTEGRATIONS STRIP */}
      <section style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="container row between wrap gap-20" style={{ padding: '26px 0' }}>
          <p className="small">10 integrations live, each with read-only scopes you choose</p>
          <div className="row wrap gap-24" style={{ fontWeight: 600, color: 'var(--text-2)' }}>{INTEGRATIONS.map((i) => <span key={i.name}>{i.name}</span>)}</div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="section">
        <div className="container">
          <SectionHead overline="The problem" title="Decisions get buried across your stack." lead="Teams decide in Slack threads, email chains and Jira comments. When it matters, nobody can find what was decided, by whom, or why. It isn’t an intelligence problem. It’s a memory problem." />
          <div className="grid g3">
            {STATS.map((s, i) => (
              <Reveal key={s.n} className="stack gap-8" >
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 28 }}>
                  <div className="display" style={{ color: i === 2 ? 'var(--brand)' : undefined }}>{s.n}</div>
                  <p className="body" style={{ marginTop: 10, maxWidth: 320 }}>{s.t}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="caption" style={{ marginTop: 28 }}>{STATS_SOURCE}</p>
        </div>
      </section>

      {/* STACK */}
      <section className="section alt">
        <div className="container">
          <SectionHead overline="The missing layer" title="LLMs reason. RAG retrieves. Agents execute. Locus AI remembers." />
          <div className="grid g4">
            {[['01 · LLMs', 'reason.'], ['02 · RAG', 'retrieves.'], ['03 · Agents', 'execute.'], ['04 · Locus AI', 'remembers.']].map(([a, b], i) => (
              <Reveal key={a}>
                <div className="card" style={{ padding: 28, minHeight: 150, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: i === 3 ? 'var(--brand)' : undefined, color: i === 3 ? '#fff' : undefined, border: i === 3 ? 0 : undefined, boxShadow: i === 3 ? 'var(--shadow-brand)' : undefined }}>
                  <span className="mono caption" style={{ color: i === 3 ? '#E4DFFF' : undefined }}>{a}</span>
                  <span className="h2">{b}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT */}
      <section className="section">
        <div className="container">
          <SectionHead overline="The platform" title="One memory. Four ways to use it." lead="Locus AI runs in the background from day one. No tagging, no templates, no new habit to build." />
          <ProductTabs />
        </div>
      </section>

      {/* HOW */}
      <section className="section alt">
        <div className="container">
          <SectionHead overline="How it works" title="Connect once. Remember forever." />
          <div className="grid g3">
            {[['01 / Connect', 'Authorize your tools', 'One-click OAuth with read-only scopes. Pick the channels, labels and spaces Locus AI can read.'], ['02 / Capture', 'Decisions extract themselves', 'A fast triage model skips the noise. A second model pulls out the decision, owner, rationale and source, then classifies it.'], ['03 / Recall', 'Ask from anywhere', 'Search in the app, scan Memory Explorer, read Team Pulse, or let an agent ask over MCP. Same permissions everywhere.']].map(([a, b, c]) => (
              <Reveal key={a}><div className="card card-lg card-hover stack gap-12" style={{ height: '100%' }}><span className="mono small" style={{ color: 'var(--link)' }}>{a}</span><h3 className="h3">{b}</h3><p className="body">{c}</p></div></Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* AGENTS */}
      <section className="section dark">
        <div className="container grid g2" style={{ alignItems: 'center', gap: 56 }}>
          <Reveal className="stack gap-20">
            <p className="overline">Built for agents</p>
            <h2 className="h1">The agents you’re about to deploy have no idea what your team decided.</h2>
            <p className="lead">Locus AI is the shared memory layer every agent queries before acting, with the same permissions as the person it acts for.</p>
            <div className="row gap-12 wrap"><Link href="/product#mcp" className="btn btn-primary">See the MCP tools</Link><Link href="/contact" className="btn btn-secondary">Talk to us</Link></div>
          </Reveal>
          <Reveal>
            <div className="code"><span className="c">{'// any MCP client: Claude, Cursor, your own agents'}</span>{'\n'}<span className="k">search_decisions</span>({'{'} query: <span className="s">&quot;vector database&quot;</span> {'}'}){'\n\n'}<span className="c">{'// returns'}</span>{'\n{\n  '}<span className="p">&quot;decision&quot;</span>: <span className="s">&quot;Adopt Postgres + pgvector&quot;</span>,{'\n  '}<span className="p">&quot;status&quot;</span>: <span className="s">&quot;active&quot;</span>,{'\n  '}<span className="p">&quot;classification&quot;</span>: <span className="s">&quot;internal&quot;</span>,{'\n  '}<span className="p">&quot;owner&quot;</span>: <span className="s">&quot;Platform team&quot;</span>,{'\n  '}<span className="p">&quot;sources&quot;</span>: [<span className="s">&quot;slack/#platform&quot;</span>, <span className="s">&quot;notion/ADR-014&quot;</span>]{'\n}'}</div>
          </Reveal>
        </div>
      </section>

      {/* SECURITY */}
      <section className="section">
        <div className="container">
          <SectionHead overline="Security & governance" title="Enterprise controls, built in from day one." lead="Locus AI checks role, scope and classification before any answer reaches a person or an agent." />
          <div className="grid g3">
            {SECURITY.map((s, i) => { const I = secIcons[i]; return (
              <Reveal key={s.title}><div className="card card-hover stack gap-12" style={{ height: '100%' }}><span className="icon-chip"><I size={20} /></span><h3 className="h4">{s.title}</h3><p className="small">{s.body}</p></div></Reveal>
            ); })}
          </div>
          <div className="row gap-8 wrap" style={{ marginTop: 24 }}>{['Public', 'Internal', 'Restricted', 'Confidential'].map((l) => <Cls key={l} l={l} />)}<Link href="/security" className="small" style={{ fontWeight: 600, marginLeft: 8 }}>How classification works →</Link></div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section alt">
        <div className="container">
          <SectionHead centered overline="FAQ" title="Questions security teams ask first." />
          <Faq />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
