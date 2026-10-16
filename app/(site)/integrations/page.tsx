import Link from 'next/link';
import type { Metadata } from 'next';
import { Reveal } from '@/components/Interactive';
import { CtaBand, PageHero } from '@/components/Sections';
import { INTEGRATIONS, INTEGRATION_CATS } from '@/lib/content';
import { IntegrationTile } from '@/components/IntegrationTile';

export const metadata: Metadata = { title: 'Integrations', description: 'Slack, Gmail, Microsoft Teams, Discord, Notion, Confluence, Jira, ClickUp, Monday and GitHub, with read-only scopes.' };

export default function Integrations() {
  return (
    <>
      <PageHero overline="Integrations" title="Works where decisions actually happen." lead="Ten integrations live, each connected with read-only OAuth and scopes you choose per channel, label, space or project." />
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
        <div className="container card card-lg row between wrap gap-20">
          <div className="stack gap-8"><h2 className="h2">Missing a tool?</h2><p className="body">Tell us where your team decides. New integrations ship every month.</p></div>
          <Link className="btn btn-primary btn-lg" href="/contact?topic=integration">Request an integration</Link>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
