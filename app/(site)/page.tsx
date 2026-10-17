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
            <Link href="/enterprise#guard" className="ed-new"><span>New</span>Decision Guard for agents <IconArrow size={13} /></Link>
          </div>
          <div className="ed-grid">
            <h1 className="ed-title"><span className="w" style={{ animationDelay: '0ms' }}>The</span> <span className="w" style={{ animationDelay: '70ms' }}>system</span> <span className="w" style={{ animationDelay: '140ms' }}>of</span> <span className="w" style={{ animationDelay: '210ms' }}>record</span> <span className="w" style={{ animationDelay: '280ms' }}>for</span> <em className="w" style={{ animationDelay: '380ms' }}>every decision.<svg className="ed-ul" viewBox="0 0 300 12" preserveAspectRatio="none" aria-hidden="true"><path d="M2 8 C 80 2, 180 12, 298 4" /></svg></em></h1>
            <div className="ed-side">
              <p className="ed-lead">Owner, source and access rules for every decision, ready for people and AI agents.</p>
              <div className="ed-cta">
                <Link href="/contact" className="btn btn-ink btn-lg">Book a demo</Link>
                <Link href="/demo" className="ed-link">Live demo <IconArrow size={15} /></Link>
              </div>
            </div>
          </div>
          <div className="ed-rule" aria-hidden="true"><span /></div>
          <div className="ed-frame"><LedgerHero /></div>
        </div>
      </section>

      {/* WORKS WITH */}
      <section className="ww">
        <div className="container">
          <p className="ww-k">Works with</p>
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
              ['Capture', 'Pulled from conversations as they happen. No tagging.'],
              ['Keep current', 'Replaced decisions stay linked, never served.'],
              ['Govern', 'Access checked before every answer. Every read logged.'],
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
            <h2 className="h1">Agents answer from whatever they find.</h2>
            <p className="lead">Decisions change in threads. The docs your agents read don’t.</p>
            <ul className="ba-list">
              <li><b>Support agents</b> quote retired prices.</li>
              <li><b>Coding agents</b> rebuild rejected designs.</li>
              <li><b>Teams</b> reopen settled calls.</li>
            </ul>
            <p className="small">Flip the switch.</p>
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
            <p className="lead">Select a sentence to trace it to its source.</p>
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
              <div className="bx-copy"><h3 className="h4">Any agent, over MCP</h3><p className="small">Same memory, same permissions as the user.</p></div>
              <pre className="bx-code"><span className="c">{'// agent, acting for Sam Lee (Growth)'}</span>{'\n'}<span className="k">search_decisions</span>(<span className="s">&quot;free tier seats&quot;</span>){'\n\n'}<span className="c">{'→'}</span> {'{'}{'\n'}  title: <span className="s">&quot;Cap the free tier at 20 seats&quot;</span>,{'\n'}  owner: <span className="s">&quot;Rosa Diaz&quot;</span>,{'\n'}  status: <span className="s">&quot;active&quot;</span>, replaces: <span className="s">&quot;unlimited seats&quot;</span>,{'\n'}  source: <span className="s">&quot;slack://#pricing/1697…&quot;</span>{'\n'}{'}'}</pre>
            </Reveal>
            <Reveal className="bx bx-perm" delay={60}>
              <div className="bx-copy"><h3 className="h4">Permission-aware by default</h3><p className="small">Checked on every search and agent call.</p></div>
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
              <div className="bx-copy"><h3 className="h4">Audit everything</h3><p className="small">Every grant and access, exportable.</p></div>
              <div className="bx-log">
                {[['09:41', 'Granted Confidential access'], ['09:12', 'SCIM provisioned a member'], ['Yesterday', 'Changed a role']].map(([t, e]) => <div key={e}><span>{t}</span>{e}</div>)}
              </div>
            </Reveal>
            <Reveal className="bx bx-data" delay={180}>
              <div className="bx-copy"><h3 className="h4">Minimal data, by design</h3><p className="small">Read-only. Raw content purged in 30 days.</p></div>
              <div className="bx-chips">{['Read-only OAuth', 'SSO and SCIM', '30-day purge', 'Audit export'].map((c) => <span key={c}>{c}</span>)}</div>
            </Reveal>
            <Reveal className="bx bx-trust">
              <div className="bx-copy">
                <h3 className="h3">Every control, with its real status.</h3>
                <p className="body">What’s in place, and what’s next.</p>
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
