import Link from 'next/link';
import type { Metadata } from 'next';
import { Reveal } from '@/components/Interactive';
import { CtaBand, PageHero } from '@/components/Sections';
import { AGENT_PLATFORMS, INTEGRATIONS, INTEGRATION_CATS, PLANNED_INTEGRATIONS } from '@/lib/content';
import { IntegrationMark } from '@/components/IntegrationTile';
import { SectionHead } from '@/components/Sections';
import { IntegrationTile } from '@/components/IntegrationTile';
import IntegrationExplorer from '@/components/IntegrationExplorer';
import { logoFor } from '@/components/IntegrationTile';

export const metadata: Metadata = { title: 'Integrations', description: 'Slack, Gmail, Microsoft Teams, Discord, Notion, Confluence, Jira, ClickUp, Monday and GitHub, with read-only scopes.' };

export default function Integrations() {
  return (
    <>
      <PageHero overline="Integrations" title="Works where decisions actually happen." lead="Ten integrations available to pilot customers, each connected with read-only OAuth and scopes you choose per channel, label, space or project." />
      <section className="section-sm"><div className="container"><IntegrationExplorer logos={Object.fromEntries(INTEGRATIONS.map((i) => [i.slug, logoFor(i.slug)]))} /></div></section>
      {INTEGRATION_CATS.map((c, i) => (
        <section key={c.key} className={`section-sm ${i % 2 ? 'alt' : ''}`}>
          <div className="container">
            <div className="int-group-head" style={{ marginBottom: 20 }}><h2 className="h2">{c.label}</h2><span className="caption">{c.note}</span></div>
            <div className="grid g3">
              {INTEGRATIONS.filter((x) => x.cat === c.key).map((x) => <Reveal key={x.slug}><IntegrationTile {...x} /></Reveal>)}
            </div>
          </div>
        </section>
      ))}
      <section className="section">
        <div className="container">
          <SectionHead overline="On the roadmap" title="Next: documents, meetings and customer systems." lead="Not available yet. Most decisions are made in meetings, so transcripts come early. Tell us which of these matters most to your team." />
          <div className="grid g3">
            {PLANNED_INTEGRATIONS.map((x, i) => (
              <Reveal key={x.slug} delay={(i % 3) * 60}>
                <div className="int-tile planned">
                  <IntegrationMark name={x.name} slug={x.slug} cat={x.cat} size={44} />
                  <div className="stack" style={{ gap: 2, minWidth: 0 }}><strong className="int-name">{x.name}</strong><span className="caption">{x.why}</span></div>
                  <span className="int-planned">Planned</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="container">
          <SectionHead overline="Agent platforms" title="Your agents query Locus AI over MCP." lead="Any client that supports remote MCP servers can connect today, with the permissions of the person it acts for. Verified, documented integrations with the major agent platforms are on the roadmap." />
          <div className="ap-grid">
            {AGENT_PLATFORMS.map((p) => (
              <div key={p.name} className={`ap-item ${p.status}`}><strong>{p.name}</strong><span>{p.status === 'works' ? 'Connects today' : 'Verified integration planned'}</span></div>
            ))}
          </div>
          <p className="caption" style={{ marginTop: 14 }}>Locus AI is the decision layer these platforms call. It complements enterprise search and copilots rather than replacing them.</p>
        </div>
      </section>
      <section className="section">
        <div className="container card card-lg row between wrap gap-20">
          <div className="stack gap-8"><h2 className="h2">Missing a tool?</h2><p className="body">Tell us where your team decides. Requests from pilot customers set the order.</p></div>
          <Link className="btn btn-primary btn-lg" href="/contact?topic=integration">Request an integration</Link>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
