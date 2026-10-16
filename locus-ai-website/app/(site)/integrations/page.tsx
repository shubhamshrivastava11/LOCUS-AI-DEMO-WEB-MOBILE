import Link from 'next/link';
import type { Metadata } from 'next';
import { Reveal } from '@/components/Interactive';
import { CtaBand, PageHero } from '@/components/Sections';
import { INTEGRATIONS } from '@/lib/content';

export const metadata: Metadata = { title: 'Integrations', description: 'Slack, Gmail, Microsoft Teams, Discord, Notion, Confluence, Jira, ClickUp, Monday and GitHub, with read-only scopes.' };
const CATS = ['Communication', 'Knowledge', 'Delivery', 'Engineering'];

export default function Integrations() {
  return (
    <>
      <PageHero overline="Integrations" title="Works where decisions actually happen." lead="Ten integrations live, each connected with read-only OAuth and scopes you choose per channel, label, space or project." />
      {CATS.map((c, i) => (
        <section key={c} className={`section-sm ${i % 2 ? 'alt' : ''}`}>
          <div className="container">
            <h2 className="h2" style={{ marginBottom: 24 }}>{c}</h2>
            <div className="grid g4">
              {INTEGRATIONS.filter((x) => x.cat === c).map((x) => (
                <Reveal key={x.name}>
                  <div className="card card-hover row gap-12" style={{ height: '100%', alignItems: 'flex-start' }}>
                    <span className="icon-chip" aria-hidden="true" style={{ fontWeight: 700 }}>{x.name[0]}</span>
                    <div className="stack gap-8"><div className="row gap-8"><strong>{x.name}</strong><span className="status status-ok">Live</span></div><p className="small">{x.scope}</p></div>
                  </div>
                </Reveal>
              ))}
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
