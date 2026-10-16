import Link from 'next/link';
import { Faq, Reveal } from '@/components/Interactive';
import { CtaBand, Cls, SectionHead } from '@/components/Sections';
import { AgentRail, AskAI, CountUp, HeroPreview, Lifecycle } from '@/components/Home';
import { IntegrationMark, IntegrationTile } from '@/components/IntegrationTile';
import { IconAgent, IconArrow, IconLink, IconLock, IconPulse, IconRadar, IconSearch, IconShield, IconTrash, IconUser, IconUsers } from '@/components/Icons';
import { INTEGRATIONS, INTEGRATION_CATS, SECURITY, STATS, STATS_SOURCE } from '@/lib/content';

const secIcons = [IconLock, IconTrash, IconUsers, IconShield, IconUser, IconLink];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="dark hero" style={{ marginTop: -72, paddingTop: 136 }}>
        <div className="container hero-copy hero-in">
          <p className="eyebrow">Memory infrastructure for people and AI agents</p>
          <h1 className="display">Your AI can reason.<br /><span className="accent">Locus AI makes it remember.</span></h1>
          <p className="lead" style={{ maxWidth: 680 }}>Locus AI captures every decision your team makes across Slack, Gmail, Notion, Jira and six more tools, then serves it back with sources and permissions to the people and agents who act next.</p>
          <div className="row gap-12 wrap" style={{ justifyContent: 'center' }}>
            <Link href="/contact" className="btn btn-primary btn-lg">Book a demo</Link>
            <Link href="/demo" className="btn btn-secondary btn-lg">Try the live demo <IconArrow size={16} /></Link>
          </div>
          <p className="trust">Read-only access · Raw content purged after 30 days · Every answer cited</p>
        </div>
        <div className="hero-in" aria-label="Product preview"><HeroPreview /></div>
      </section>

      {/* CONNECTED TOOLS */}
      <section className="tools-strip">
        <div className="container row between wrap gap-20">
          <p className="small" style={{ maxWidth: 260 }}>Captures decisions from the tools your team already uses</p>
          <div className="row wrap gap-12">
            {INTEGRATIONS.map((i) => (
              <span key={i.slug} className="tool-chip"><IntegrationMark name={i.name} slug={i.slug} cat={i.cat} size={26} />{i.name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="section">
        <div className="container">
          <SectionHead overline="The problem" title="Your AI keeps getting smarter. Your organization keeps forgetting." lead="Teams decide in Slack threads, email chains and Jira comments. Weeks later, nobody can find what was decided, by whom, or why, and neither can the agents you are deploying. It isn’t an intelligence problem. It’s a memory problem." />
          <div className="grid g3">
            {STATS.map((s, i) => (
              <Reveal key={s.n}>
                <div className={`stat-tile ${i === 2 ? 'brand' : ''}`}>
                  <CountUp value={s.n} className="stat-n" />
                  <p className="body" style={{ margin: 0 }}>{s.t}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="caption" style={{ marginTop: 20 }}>{STATS_SOURCE}</p>
        </div>
      </section>

      {/* STACK */}
      <section className="section alt">
        <div className="container">
          <SectionHead overline="The missing layer" title="LLMs reason. RAG retrieves. Agents execute. Locus AI remembers." lead="Retrieval finds documents. Memory knows which decision is current, who made it, what it replaced and who is allowed to see it." />
          <div className="grid g4">
            {[['01 · LLMs', 'reason.'], ['02 · RAG', 'retrieves.'], ['03 · Agents', 'execute.'], ['04 · Locus AI', 'remembers.']].map(([a, b], i) => (
              <Reveal key={a}>
                <div className={`stack-card ${i === 3 ? 'on' : ''}`}><span className="mono caption">{a}</span><span className="h2">{b}</span></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* LIFECYCLE */}
      <section className="section">
        <div className="container">
          <SectionHead overline="How it works" title="Connect once. Every decision is captured, governed and ready to recall." />
          <Lifecycle />
        </div>
      </section>

      {/* TWO AUDIENCES */}
      <section className="section alt">
        <div className="container">
          <SectionHead overline="One memory, two audiences" title="Built for the people deciding and the agents acting on it." />
          <div className="grid g2">
            <Reveal>
              <div className="aud-card">
                <div className="row gap-12"><span className="icon-chip"><IconUser size={20} /></span><div><p className="overline" style={{ color: 'var(--text-3)' }}>For people</p><h3 className="h3">Answers with receipts</h3></div></div>
                {[[IconSearch, 'Context Search', 'Ask what was decided and get the thread it came from.', '/product#search'], [IconRadar, 'Memory Explorer', 'Every decision, action and blocker, filterable and exportable.', '/product#explorer'], [IconPulse, 'Team Pulse', 'A weekly read on what moved, what’s open and what’s stuck.', '/product#pulse']].map(([I, t, d, h]: any) => (
                  <Link key={t} href={h} className="aud-row"><I size={18} /><span><strong>{t}</strong><span className="small" style={{ display: 'block' }}>{d}</span></span><IconArrow size={16} /></Link>
                ))}
              </div>
            </Reveal>
            <Reveal>
              <div className="aud-card">
                <div className="row gap-12"><span className="icon-chip"><IconAgent size={20} /></span><div><p className="overline" style={{ color: 'var(--text-3)' }}>For agents</p><h3 className="h3">Context before action</h3></div></div>
                {[['search_decisions', 'Find the current decision on any topic, team or date range.'], ['get_decision_context', 'Owner, rationale, lineage and sources for one decision.'], ['log_decision', 'Let an agent record what it decided, with an owner and source.']].map(([t, d]) => (
                  <Link key={t} href="/product#mcp" className="aud-row"><span className="mono small" style={{ color: 'var(--link)', fontWeight: 600 }}>fn</span><span><strong className="mono" style={{ fontSize: 14.5 }}>{t}</strong><span className="small" style={{ display: 'block' }}>{d}</span></span><IconArrow size={16} /></Link>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* AGENTS */}
      <section className="section dark">
        <div className="container stack" style={{ gap: 8 }}>
          <Reveal className="head">
            <p className="overline">Built for agents</p>
            <h2 className="h1">Stop re-explaining context to every agent.</h2>
            <p className="lead">The agents you are deploying have no idea what your team already decided. Locus AI is the shared memory they query first, through MCP, with the same permissions as the person they act for.</p>
          </Reveal>
          <AgentRail />
        </div>
      </section>

      {/* INTEGRATIONS */}
      <section className="section">
        <div className="container">
          <SectionHead overline="Integrations" title="Captures decisions where they actually happen." lead="Ten integrations live, each connected with read-only OAuth and scopes you choose per channel, label, space or project." />
          <div className="int-groups">
            {INTEGRATION_CATS.map((c) => (
              <Reveal key={c.key}>
                <div className="int-group">
                  <div className="int-group-head"><span className="overline">{c.key === 'Engineering' ? 'Code & agents' : c.label}</span><span className="caption">{c.key === 'Engineering' ? 'Where decisions get shipped and used' : c.note}</span></div>
                  <div className="int-grid">
                    {INTEGRATIONS.filter((x) => x.cat === c.key).map((x) => <IntegrationTile key={x.slug} {...x} compact />)}
                    {c.key === 'Engineering' && <div className="int-tile compact"><span className="int-mark" style={{ width: 36, height: 36 }}><IconAgent size={20} /></span><strong className="int-name">Any MCP client</strong></div>}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="row gap-16 wrap" style={{ marginTop: 28 }}>
            <Link href="/integrations" className="btn btn-secondary">See all integrations</Link>
            <Link href="/contact?topic=integration" className="btn btn-ghost">Request an integration <IconArrow size={16} /></Link>
          </div>
        </div>
      </section>

      {/* SECURITY */}
      <section className="section dark">
        <div className="container">
          <div className="grid g2" style={{ alignItems: 'start', gap: 48 }}>
            <Reveal className="stack gap-20">
              <p className="overline">Security & governance</p>
              <h2 className="h1">Shared memory, with real boundaries.</h2>
              <p className="lead">Locus AI checks role, scope and classification before any answer reaches a person or an agent. Every confidential access is logged.</p>
              <div className="row gap-8 wrap">{['Public', 'Internal', 'Restricted', 'Confidential'].map((l) => <Cls key={l} l={l} />)}</div>
              <div><Link href="/security" className="btn btn-secondary">How security works</Link></div>
            </Reveal>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: 12 }}>
              {SECURITY.map((s, i) => { const I = secIcons[i]; return (
                <Reveal key={s.title}><div className="glass stack gap-8" style={{ height: '100%', padding: 20 }}><span className="icon-chip"><I size={18} /></span><h3 className="h4" style={{ margin: 0 }}>{s.title}</h3><p className="small" style={{ margin: 0 }}>{s.body}</p></div></Reveal>
              ); })}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section alt">
        <div className="container">
          <SectionHead centered overline="FAQ" title="Questions security teams ask first." />
          <Faq />
        </div>
      </section>

      {/* ASK AI */}
      <section className="section-sm">
        <div className="container stack gap-16" style={{ alignItems: 'center', textAlign: 'center' }}>
          <p className="overline">Prefer to ask an AI?</p>
          <p className="body" style={{ maxWidth: 520 }}>Get a summary of Locus AI from the assistant you already use.</p>
          <AskAI />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
