import Link from 'next/link';
import { CostCalculator } from '@/components/Simulators';
import type { Metadata } from 'next';
import { Faq, Reveal } from '@/components/Interactive';
import { CtaBand, PageHero, SectionHead } from '@/components/Sections';
import { PLANS } from '@/lib/content';

export const metadata: Metadata = { title: 'Pricing', description: 'Individual, Team and Enterprise plans for Locus AI.' };
const ROWS: [string, string, string, string][] = [
  ['Personal sources', '✓', '✓', '✓'], ['Shared team workspace', '—', '✓', '✓'], ['Context Search', '✓', '✓', '✓'], ['Memory Explorer', '—', '✓', '✓'], ['Team Pulse', 'Personal', '✓', '✓'],
  ['MCP server for agents', 'Personal', 'Team', 'Org-wide'], ['Roles', 'Owner', 'Admin, Lead, Member, Guest', 'All five'], ['Classification levels', '—', '✓', '✓ + custom rules'],
  ['Audit log', '—', '✓', 'Unlimited + export'], ['SAML SSO and SCIM', '—', '—', '✓'], ['Custom retention', '—', '—', '✓'], ['Data residency', '—', '—', 'Roadmap'], ['DPA and security review', '—', '—', '✓'],
];
const fx = (v: string) => v === '✓' ? <span style={{ color: 'var(--success)', fontWeight: 700 }} aria-label="Included">✓</span> : v === '—' ? <span className="muted" aria-label="Not included">—</span> : <span className="small">{v}</span>;

export default function Pricing() {
  return (
    <>
      <PageHero overline="Pricing" title="Start solo. Scale to the whole company." lead="Every plan is read-only by design and purges raw content after 30 days." />
      <section className="section" style={{ paddingTop: 48 }}>
        <div className="container grid g3" style={{ alignItems: 'stretch' }}>
          {PLANS.map((p) => (
            <Reveal key={p.name}>
              <div className={`card card-lg plan ${p.featured ? 'featured' : ''}`} style={{ height: '100%' }}>
                <div className="row gap-8"><h2 className="h4">{p.name}</h2>{p.featured && <span className="tag tag-decision">Recommended</span>}</div>
                <div className="row gap-8" style={{ alignItems: 'baseline' }}><span className={`price ${p.price.startsWith('[') ? 'placeholder' : ''}`} style={p.price.startsWith('[') ? { fontSize: 26 } : undefined}>{p.price}</span><span className="small">{p.per}</span></div>
                <p className="small">{p.desc}</p>
                <Link className={`btn btn-block ${p.featured ? 'btn-primary' : 'btn-secondary'}`} href={p.href}>{p.cta}</Link>
                <ul>{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="section alt">
        <div className="container">
          <SectionHead overline="Compare plans" title="Everything, side by side." />
          <div className="table-wrap"><table className="table"><thead><tr><th>Feature</th><th>Individual</th><th>Team</th><th>Enterprise</th></tr></thead><tbody>
            {ROWS.map(([f, a, b, c]) => <tr key={f}><td style={{ fontWeight: 600 }}>{f}</td><td>{fx(a)}</td><td>{fx(b)}</td><td>{fx(c)}</td></tr>)}
          </tbody></table></div>
        </div>
      </section>
      <section className="section"><div className="container"><SectionHead centered overline="FAQ" title="Pricing questions" /><Faq /></div></section>
      <section className="section alt">
        <div className="container">
          <SectionHead overline="Business case" title="What does forgetting cost your team?" lead="Use your own numbers. Nothing here is a Locus AI benchmark." />
          <CostCalculator />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
