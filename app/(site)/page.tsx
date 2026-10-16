import Link from 'next/link';
import { Faq, Reveal } from '@/components/Interactive';
import { CtaBand, Cls, SectionHead } from '@/components/Sections';
import { AgentRail, CountUp, HeroPreview, Lifecycle } from '@/components/Home';
import MemoryLoom from '@/components/MemoryLoom';
import HeroStory from '@/components/HeroStory';
import IntegrationMarquee from '@/components/IntegrationMarquee';
import { CostCalculator, PermissionSimulator } from '@/components/Simulators';
import Scenario from '@/components/Scenario';
import { logoFor } from '@/components/IntegrationTile';
import { IntegrationMark, IntegrationTile } from '@/components/IntegrationTile';
import { IconAgent, IconArrow, IconLink, IconLock, IconPulse, IconRadar, IconSearch, IconShield, IconTrash, IconUser, IconUsers } from '@/components/Icons';
import { ENTERPRISE, INTEGRATIONS, INTEGRATION_CATS, SECURITY, STATS, STATS_SOURCE } from '@/lib/content';

const secIcons = [IconLock, IconTrash, IconUsers, IconShield, IconUser, IconLink];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="hero2" style={{ marginTop: -73 }}>
        <span className="hero2-pulse" aria-hidden="true" />
        <div className="container hero2-grid">
          <div className="hero2-copy">
            <p className="hero2-kicker hero-in">Organizational memory for enterprise AI</p>
            <h1 className="display2 split"><span className="ln"><span>Your AI can reason.</span></span><span className="ln"><span className="second">Locus AI makes it remember.</span></span></h1>
            <p className="hero2-lead hero-in">Every decision your team makes in Slack, Gmail, Notion, Jira and six more tools, kept with its owner, its source and who may see it. Ready for the next person or agent who acts on it.</p>
            <div className="row gap-12 wrap hero-in">
              <Link href="/contact" className="btn btn-primary btn-lg">Book a demo</Link>
              <Link href="/demo" className="btn btn-secondary btn-lg">Try the live demo</Link>
            </div>
            <dl className="hero2-facts hero-in">
              <div><dt>Read-only</dt><dd>Never posts, edits or replies in your tools</dd></div>
              <div><dt>30 days</dt><dd>Until raw content is purged</dd></div>
              <div><dt>Every answer</dt><dd>Linked to the thread it came from</dd></div>
            </dl>
          </div>
          <div className="hero2-record"><HeroStory /></div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="trust-strip" aria-label="Enterprise controls">
        <div className="container trust-grid">
          {[[IconLock, 'Read-only OAuth', 'Never posts or edits'], [IconShield, 'SAML SSO and SCIM', 'On the Enterprise plan'], [IconUsers, 'Permission checks', 'Role, scope and classification'], [IconLink, 'Audit log', 'Every confidential access'], [IconTrash, '30-day purge', 'Raw content deleted']].map(([I, t, d]: any) => (
            <div key={t} className="trust-item"><span className="trust-ic"><I size={18} /></span><span><strong>{t}</strong><span>{d}</span></span></div>
          ))}
        </div>
      </section>

      {/* EXAMPLE SCENARIO */}
      <section className="section scn-section">
        <div className="container">
          <Reveal className="head">
            <p className="overline">Example scenario · B2B software company</p>
            <h2 className="h1">A pricing decision changes on Monday. By Thursday, an AI agent has promised a customer the old one.</h2>
            <p className="lead">Decisions move faster than anyone writes them down. Now AI agents act on the stale version at machine speed. Step through what happens, with and without Locus AI.</p>
          </Reveal>
          <Reveal delay={80}><Scenario /></Reveal>
        </div>
      </section>

      {/* MEMORY LOOM */}
      <section className="section loom-section">
        <div className="container">
          <div className="loom-head">
            <h2 className="h1">Watch a conversation become memory.</h2>
            <p className="lead">Every few seconds a message lands in one of your tools. Locus AI keeps the decision, classifies it and makes it available to people and agents. Point at or tap a tool to replay it.</p>
          </div>
          <MemoryLoom logos={Object.fromEntries(INTEGRATIONS.map((i) => [i.slug, logoFor(i.slug)]))} />
        </div>
      </section>

      {/* PROBLEM */}
      <section className="section">
        <div className="container">
          <SectionHead overline="The problem" title="Your AI keeps getting smarter. Your organization keeps forgetting." lead="Teams decide in Slack threads, email chains and Jira comments. Weeks later, nobody can find what was decided, by whom, or why, and neither can the agents you are deploying. It isn’t an intelligence problem. It’s a memory problem." />
          <div className="grid g3">
            {STATS.map((s, i) => (
              <Reveal key={s.n} delay={i * 90}>
                <div className={`stat-tile ${i === 2 ? 'brand' : ''}`}>
                  <CountUp value={s.n} className="stat-n" />
                  <p className="body" style={{ margin: 0 }}>{s.t}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="caption" style={{ marginTop: 20 }}>{STATS_SOURCE}</p>
          <div className="calc-wrap">
            <Reveal className="stack gap-12">
              <h3 className="h2">What does forgetting cost your team?</h3>
              <p className="body" style={{ maxWidth: 520 }}>Move the sliders to match your organization. Everything here is calculated from your own estimates.</p>
            </Reveal>
            <Reveal delay={100}><CostCalculator /></Reveal>
          </div>
        </div>
      </section>

      {/* STACK */}
      <section className="section alt">
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
          <SectionHead overline="One memory, two audiences" title="Built for the people deciding and the agents acting on it." lead="Same decision, same permissions. Switch between what a person sees and what an agent gets." />
          <div className="preview-light"><HeroPreview /></div>
          <div className="grid g2" style={{ marginTop: 40 }}>
            <Reveal>
              <div className="aud-card lit">
                <div className="row gap-12"><span className="icon-chip"><IconUser size={20} /></span><div><p className="overline" style={{ color: 'var(--text-3)' }}>For people</p><h3 className="h3">Answers with receipts</h3></div></div>
                {[[IconSearch, 'Context Search', 'Ask what was decided and get the thread it came from.', '/product#search'], [IconRadar, 'Memory Explorer', 'Every decision, action and blocker, filterable and exportable.', '/product#explorer'], [IconPulse, 'Team Pulse', 'A weekly read on what moved, what’s open and what’s stuck.', '/product#pulse']].map(([I, t, d, h]: any) => (
                  <Link key={t} href={h} className="aud-row"><I size={18} /><span><strong>{t}</strong><span className="small" style={{ display: 'block' }}>{d}</span></span><IconArrow size={16} /></Link>
                ))}
              </div>
            </Reveal>
            <Reveal>
              <div className="aud-card lit">
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

      {/* ENTERPRISE */}
      <section className="section">
        <div className="container">
          <Reveal className="head">
            <span className="ea-tag">Enterprise · Early access</span>
            <h2 className="h1">Memory that keeps every agent consistent with what you decided.</h2>
            <p className="lead">Search answers questions. These features stop people and agents from acting against decisions your organization already made.</p>
          </Reveal>
          <div className="ent-teaser">
            {ENTERPRISE.map((f, i) => (
              <Reveal key={f.key} delay={i * 80}>
                <Link href={`/enterprise#${f.key}`} className={`ent-card lit ${i === 0 ? 'first' : ''}`}>
                  <span className="ent-n">{i + 1}</span>
                  <strong>{f.name}</strong>
                  <span className="small">{f.line}</span>
                </Link>
              </Reveal>
            ))}
          </div>
          <div style={{ marginTop: 24 }}><Link href="/enterprise" className="btn btn-primary">Try Decision Guard <IconArrow size={16} /></Link></div>
        </div>
      </section>

      {/* INTEGRATIONS */}
      <section className="section">
        <div className="container">
          <SectionHead overline="Integrations" title="Captures decisions where they actually happen." lead="Ten integrations live, each connected with read-only OAuth and scopes you choose per channel, label, space or project." />
          <Reveal><IntegrationMarquee /></Reveal>
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
              <p className="lead">Locus AI checks role, scope and classification before any answer reaches a person or an agent. Pick a person on the right and see exactly what they, or an agent acting for them, can see.</p>
              <div className="row gap-8 wrap">{['Public', 'Internal', 'Restricted', 'Confidential'].map((l) => <Cls key={l} l={l} />)}</div>
              <div><Link href="/security" className="btn btn-secondary">How security works</Link></div>
            </Reveal>
            <Reveal delay={100}><PermissionSimulator /></Reveal>
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

      <CtaBand />
    </>
  );
}
