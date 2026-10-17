import Link from 'next/link';
import { Reveal } from '@/components/Interactive';
import { CtaBand, Cls } from '@/components/Sections';
import LedgerHero from '@/components/LedgerHero';
import AnswerInspector from '@/components/AnswerInspector';
import AgentConsole from '@/components/AgentConsole';
import { IntegrationMark } from '@/components/IntegrationTile';
import { IconArrow } from '@/components/Icons';
import { INTEGRATIONS } from '@/lib/content';

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="ed-hero">
        <div className="container">
          <div className="ed-top">
            <span className="ed-k">Locus AI · Organizational memory for enterprise AI</span>
            <Link href="/enterprise#guard" className="ed-new">New: Decision Guard for agents <IconArrow size={13} /></Link>
          </div>
          <div className="ed-grid">
            <h1 className="ed-title">The system of record for <em>every decision</em> your company makes.</h1>
            <div className="ed-side">
              <p className="ed-lead">Your company decides in Slack, email and meetings. Locus AI turns each decision into a governed record with an owner, a source, access rules and lineage, so people and AI agents act on what’s current.</p>
              <div className="ed-cta">
                <Link href="/contact" className="btn btn-ink btn-lg">Book a demo</Link>
                <Link href="/demo" className="ed-link">Try the live demo <IconArrow size={15} /></Link>
              </div>
            </div>
          </div>
          <p className="ed-strap"><span>LLMs reason.</span><span>RAG retrieves.</span><span>Agents execute.</span><span className="on">Locus AI remembers.</span></p>
          <div className="ed-frame"><LedgerHero /></div>
        </div>
      </section>

      {/* WORKS WITH */}
      <section className="ww">
        <div className="container">
          <p className="ww-k">Captures decisions from the tools your team already uses</p>
          <div className="ww-row">
            {INTEGRATIONS.map((i) => <span key={i.slug} className="ww-item"><IntegrationMark name={i.name} slug={i.slug} cat={i.cat} size={28} />{i.name}</span>)}
          </div>
        </div>
      </section>

      {/* VALUE */}
      <section className="section vp">
        <div className="container">
          <Reveal className="vp-head">
            <h2 className="h1">Search finds documents.<br />Memory knows what was decided.</h2>
          </Reveal>
          <div className="vp-grid">
            {[
              ['Capture', 'Decisions, owners and rationale are pulled from conversations as they happen. No tagging, no templates, nothing new for your team to learn.'],
              ['Keep current', 'When a decision changes, the old one is marked replaced and linked to the new one. People and agents only get what’s current.'],
              ['Govern', 'Role, scope and classification are checked before anything reaches a person or an agent. Every confidential access is logged.'],
            ].map(([t, b], i) => (
              <Reveal key={t} delay={i * 80} className="vp-item">
                <span className="vp-n">0{i + 1}</span>
                <h3 className="h3">{t}</h3>
                <p className="body">{b}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER */}
      <section className="section ba">
        <div className="container ba-grid">
          <Reveal className="stack gap-20">
            <p className="overline">The problem</p>
            <h2 className="h1">Your agents answer from whatever they can find.</h2>
            <p className="lead">Pricing, launch dates and architecture change every week in threads and meetings. The pages your agents read don’t. People used to catch the stale answer before a customer did. Agents don’t.</p>
            <ul className="ba-list">
              <li><b>Support and sales agents</b> quote a price you retired.</li>
              <li><b>Coding agents</b> rebuild a design the team rejected.</li>
              <li><b>New hires and leaders</b> reopen decisions nobody can trace.</li>
            </ul>
            <p className="small">Flip the switch to see the same agent with Locus AI memory.</p>
          </Reveal>
          <Reveal delay={80} className="ba-stage"><AgentConsole /></Reveal>
        </div>
      </section>

      {/* PROVENANCE */}
      <section className="section prism-section">
        <div className="container">
          <Reveal className="head">
            <p className="overline">Provenance</p>
            <h2 className="h1">Every answer shows its work.</h2>
            <p className="lead">Locus AI searches each connected tool with the asker’s access, answers only what a source backs, and links every sentence to where it came from. Select a sentence to trace it.</p>
          </Reveal>
          <Reveal delay={80}><AnswerInspector /></Reveal>
        </div>
      </section>

      {/* BENTO */}
      <section className="section">
        <div className="container">
          <Reveal className="head">
            <p className="overline">Built for enterprise</p>
            <h2 className="h1">Governed memory for people and agents.</h2>
          </Reveal>
          <div className="bento">
            <Reveal className="bx bx-mcp">
              <div className="bx-copy"><h3 className="h4">Any agent, over MCP</h3><p className="small">Claude, Cursor or your own agents query the same memory, with the permissions of the person they act for.</p></div>
              <pre className="bx-code"><span className="c">{'// agent, acting for Sam Lee (Growth)'}</span>{'\n'}<span className="k">search_decisions</span>(<span className="s">&quot;free tier seats&quot;</span>){'\n\n'}<span className="c">{'→'}</span> {'{'}{'\n'}  title: <span className="s">&quot;Cap the free tier at 20 seats&quot;</span>,{'\n'}  owner: <span className="s">&quot;Rosa Diaz&quot;</span>,{'\n'}  status: <span className="s">&quot;active&quot;</span>, replaces: <span className="s">&quot;unlimited seats&quot;</span>,{'\n'}  source: <span className="s">&quot;slack://#pricing/1697…&quot;</span>{'\n'}{'}'}</pre>
            </Reveal>
            <Reveal className="bx bx-perm" delay={60}>
              <div className="bx-copy"><h3 className="h4">Permission-aware by default</h3><p className="small">Four classification levels plus role and scope, checked on every search, digest and agent call.</p></div>
              <div className="bx-perm-t">
                {[['Internal', 'Launch Q3 on July 29', true], ['Restricted', 'Cap the free tier at 20 seats', true], ['Confidential', 'EU DPA review', false]].map(([l, t, ok]: any) => (
                  <div key={t} className={`bx-perm-r ${ok ? '' : 'no'}`}><Cls l={l} /><span>{t}</span><b>{ok ? '✓ Sam can see' : '✕ Needs a grant'}</b></div>
                ))}
              </div>
            </Reveal>
            <Reveal className="bx bx-line" delay={60}>
              <div className="bx-copy"><h3 className="h4">Lineage, not just search</h3><p className="small">Every decision links to what it replaced.</p></div>
              <div className="bx-chain">
                <div className="old"><span>Aug 30</span><s>Free tier: unlimited seats</s></div>
                <div className="arrow" aria-hidden="true" />
                <div className="new"><span>Mon · active</span><b>Cap the free tier at 20 seats</b></div>
              </div>
            </Reveal>
            <Reveal className="bx bx-audit" delay={120}>
              <div className="bx-copy"><h3 className="h4">Audit everything</h3><p className="small">Role changes, grants and confidential access, exportable.</p></div>
              <div className="bx-log">
                {[['09:41', 'Granted Confidential access'], ['09:12', 'SCIM provisioned a member'], ['Yesterday', 'Changed a role']].map(([t, e]) => <div key={e}><span>{t}</span>{e}</div>)}
              </div>
            </Reveal>
            <Reveal className="bx bx-data" delay={180}>
              <div className="bx-copy"><h3 className="h4">Minimal data, by design</h3><p className="small">Read-only scopes. Raw content purged after 30 days. Only structured decisions persist.</p></div>
              <div className="bx-chips">{['Read-only OAuth', 'SSO and SCIM', '30-day purge', 'Audit export'].map((c) => <span key={c}>{c}</span>)}</div>
            </Reveal>
            <Reveal className="bx bx-trust">
              <div className="bx-copy">
                <h3 className="h3">Every control, with its real status.</h3>
                <p className="body">The Trust center lists what’s in place today and what’s on the roadmap, so your security review starts with facts.</p>
              </div>
              <div className="row gap-12 wrap"><Link href="/trust" className="btn btn-primary">Open the Trust center</Link><Link href="/security" className="btn btn-secondary">How access works</Link></div>
            </Reveal>
          </div>
        </div>
      </section>

      <CtaBand partner title="Give your agents a memory they can be held to." lead="We’re onboarding a small group of design partners, with early access to Decision Guard and the other Enterprise features." />
    </>
  );
}
