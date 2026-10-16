import Link from 'next/link';
import { Faq, Reveal } from '@/components/Interactive';
import { CtaBand, Cls, SectionHead } from '@/components/Sections';
import { AgentRail, CountUp, HeroPreview, Lifecycle } from '@/components/Home';
import Prism from '@/components/Prism';
import HeroStory from '@/components/HeroStory';
import IntegrationExplorer from '@/components/IntegrationExplorer';
import { CostCalculator, PermissionSimulator } from '@/components/Simulators';
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
            <p className="hero2-lead hero-in">Your team decides in Slack. Your agents read old docs. Locus AI captures every decision with its owner, source and access rules, so people and agents act on what’s current.</p>
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

      {/* PROBLEM */}
      <section className="section prob">
        <div className="container">
          <Reveal className="head prob-head">
            <p className="overline">The problem</p>
            <h2 className="h1">Your team changes decisions in Slack. Your AI agents still read last quarter’s docs.</h2>
            <p className="lead">At a growing software company, pricing, launch dates and architecture choices change every week, mostly in threads and meetings. The pages your support, sales and coding agents read don’t change with them. People used to catch the stale answer before it reached a customer. Agents don’t.</p>
          </Reveal>
          <div className="prob-costs">
            {[
              ['Support and sales agents', 'A customer hears a price you retired.', 'The agent quotes the help center. The decision changed in #pricing on Monday. The deal opens with a correction.'],
              ['Coding agents', 'A sprint rebuilds a design you rejected.', 'The agent proposes the cache the team ruled out in an ADR. Review catches it a week later, after the work is done.'],
              ['Leaders and new hires', 'A settled call gets argued again.', 'Nobody can find who decided, when, or why. The meeting happens twice, and the person who decided has moved teams.'],
            ].map(([who, what, how], i) => (
              <Reveal key={who} delay={i * 90}>
                <div className="prob-card">
                  <span className="prob-who">{who}</span>
                  <h3 className="h3">{what}</h3>
                  <p className="small">{how}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="prob-why">
            <p className="prob-why-k">Why the tools you already pay for miss it</p>
            <div className="prob-why-grid">
              <div><strong>Enterprise search</strong><span>Finds every document that mentions pricing. Can’t tell you which decision is current.</span></div>
              <div><strong>Agent memory</strong><span>Remembers one agent’s conversations. Not your organization’s decisions, owners or access rules.</span></div>
              <div><strong>Docs and wikis</strong><span>Only as current as the last person who updated them, which is usually before the decision changed.</span></div>
            </div>
          </div>
          <div className="prob-evidence">
            <p className="prob-why-k">What we heard in customer discovery</p>
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
            <p className="caption" style={{ marginTop: 16 }}>{STATS_SOURCE}</p>
          </div>
          <div className="calc-wrap">
            <Reveal className="stack gap-12">
              <h3 className="h2">What does forgetting cost your team?</h3>
              <p className="body" style={{ maxWidth: 520 }}>Move the sliders to match your organization. Everything here is calculated from your own estimates.</p>
            </Reveal>
            <Reveal delay={100}><CostCalculator /></Reveal>
          </div>
        </div>
      </section>

      {/* PROVENANCE PRISM */}
      <section className="section prism-section">
        <div className="container">
          <Reveal className="head">
            <p className="overline">Provenance and groundedness</p>
            <h2 className="h1">Every tool goes in. One answer comes out, with its receipts.</h2>
            <p className="lead">Pick a question. Locus AI pulls only the sources you’re allowed to see, checks every claim against them, and shows exactly where each one came from. When nothing backs an answer, it says so instead of guessing.</p>
          </Reveal>
          <Reveal delay={80}><Prism /></Reveal>
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
          <SectionHead overline="Integrations" title="Ten tools in. One decision record out." lead="Pick a tool to see exactly what Locus AI reads there, what it never touches, and what a real message becomes once it’s captured." />
          <Reveal><IntegrationExplorer logos={Object.fromEntries(INTEGRATIONS.map((i) => [i.slug, logoFor(i.slug)]))} /></Reveal>
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
