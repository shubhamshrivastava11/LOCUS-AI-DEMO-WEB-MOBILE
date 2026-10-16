import Link from 'next/link';
import { Reveal } from '@/components/Interactive';
import { CtaBand } from '@/components/Sections';
import AnswerInspector from '@/components/AnswerInspector';
import AgentConsole from '@/components/AgentConsole';
import { IntegrationMark } from '@/components/IntegrationTile';
import { IconAgent, IconArrow, IconLink, IconLock, IconShield, IconTrash, IconUsers } from '@/components/Icons';
import { INTEGRATIONS } from '@/lib/content';

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
          <div className="hero2-record"><AgentConsole /></div>
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
            <p className="lead">Pricing, launch dates and architecture choices change every week, mostly in threads and meetings. The pages your agents read don’t change with them. People used to catch the stale answer before it reached a customer. Agents don’t.</p>
          </Reveal>
          <div className="prob-costs">
            {[
              ['Support and sales agents', 'A customer hears a price you retired.', 'The agent quotes the help center. The decision changed in #pricing on Monday.'],
              ['Coding agents', 'A sprint rebuilds a design you rejected.', 'The agent proposes the cache the team ruled out in an ADR. Review catches it a week later.'],
              ['Leaders and new hires', 'A settled call gets argued again.', 'Nobody can find who decided, when, or why, and the person who decided has moved teams.'],
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
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section prism-section">
        <div className="container">
          <Reveal className="head">
            <p className="overline">How it works</p>
            <h2 className="h1">Every answer shows its work.</h2>
            <p className="lead">Locus AI searches each connected tool with the asker’s access, answers only what a source backs, and links every sentence to where it came from. Select a sentence to trace it.</p>
          </Reveal>
          <Reveal delay={80}><AnswerInspector /></Reveal>
          <div className="row gap-16 wrap" style={{ marginTop: 24 }}>
            <Link href="/product" className="btn btn-secondary">Explore the product</Link>
            <Link href="/demo" className="btn btn-ghost">Open the live demo <IconArrow size={16} /></Link>
          </div>
        </div>
      </section>

      {/* INTEGRATIONS */}
      <section className="section">
        <div className="container home-int">
          <Reveal className="stack gap-16">
            <p className="overline">Integrations</p>
            <h2 className="h1">Works where your team already decides.</h2>
            <p className="lead">Ten connectors in pilot, each read-only and scoped to the channels, labels and spaces you pick. Meeting transcripts, Google Drive and Microsoft 365 are next.</p>
            <div className="row gap-16 wrap">
              <Link href="/integrations" className="btn btn-secondary">See all integrations</Link>
              <Link href="/contact?topic=integration" className="btn btn-ghost">Request one <IconArrow size={16} /></Link>
            </div>
          </Reveal>
          <Reveal delay={80} className="stack gap-16">
            <div className="hi-grid">
              {INTEGRATIONS.map((i) => (
                <div key={i.slug} className="hi-tile"><IntegrationMark name={i.name} slug={i.slug} cat={i.cat} size={36} /><span>{i.name}</span></div>
              ))}
            </div>
            <div className="hi-agents"><span className="hi-k">Agents connect over MCP</span>{['Claude', 'Cursor', 'Your own agents'].map((a) => <span key={a} className="hi-chip">{a}</span>)}</div>
          </Reveal>
        </div>
      </section>

      {/* SECURITY */}
      <section className="section alt">
        <div className="container home-sec">
          <Reveal className="stack gap-16">
            <p className="overline">Security</p>
            <h2 className="h1">Built to pass your security review.</h2>
            <p className="lead">Every control we’re asked about, with its real status, is published in the Trust center. Nothing is marked in place unless it works today.</p>
            <div className="row gap-16 wrap">
              <Link href="/trust" className="btn btn-primary">Open the Trust center</Link>
              <Link href="/security" className="btn btn-ghost">How access works <IconArrow size={16} /></Link>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <ul className="sec-list">
              {[
                [IconAgent, 'Agents never see more than their user', 'Every MCP call runs with the permissions of the person the agent acts for.'],
                [IconShield, 'Access is checked before every answer', 'Role, scope and four classification levels. Spaces you can’t open are skipped.'],
                [IconLock, 'Minimal data, by design', 'Read-only scopes. Raw content is purged after 30 days. Only structured decisions persist.'],
              ].map(([I, t, d]: any) => (
                <li key={t}><span className="sec-ic"><I size={18} /></span><div><strong>{t}</strong><span>{d}</span></div></li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <CtaBand partner title="Give your agents a memory they can be held to." lead="We’re onboarding a small group of design partners now, with early access to Decision Guard and the other Enterprise features." />
    </>
  );
}
