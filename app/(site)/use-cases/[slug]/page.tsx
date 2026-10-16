import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Reveal } from '@/components/Interactive';
import { CtaBand, PageHero, SectionHead, Tag } from '@/components/Sections';
import { USE_CASES } from '@/lib/content';

export function generateStaticParams() { return USE_CASES.map((u) => ({ slug: u.slug })); }
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const u = USE_CASES.find((x) => x.slug === params.slug);
  return u ? { title: `${u.name} use case`, description: u.lead } : {};
}

export default function UseCase({ params }: { params: { slug: string } }) {
  const u = USE_CASES.find((x) => x.slug === params.slug);
  if (!u) notFound();
  const [a, b, without, withL] = u.scenario;
  const others = USE_CASES.filter((x) => x.slug !== u.slug);
  return (
    <>
      <PageHero overline={`Use case · ${u.name}`} title={u.title} lead={u.lead}>
        <div className="row gap-12 wrap" style={{ justifyContent: 'center' }}>
          <Link className="btn btn-primary btn-lg" href="/design-partners">Pilot it with your team</Link>
          <Link className="btn btn-secondary btn-lg" href="/demo">Try the live demo</Link>
        </div>
      </PageHero>
      <section className="section">
        <div className="container">
          <SectionHead overline="Example · sample data" title="One decision, two outcomes." />
          <div className="uc-flow">
            {[a, b].map(([when, what], i) => <Reveal key={when} delay={i * 80} className="uc-step"><span className="uc-when">{when}</span><p>{what}</p></Reveal>)}
            <div className="uc-split">
              <Reveal className="uc-out bad" delay={160}><span className="uc-when">{without[0]}</span><p>{without[1]}</p></Reveal>
              <Reveal className="uc-out good" delay={240}><span className="uc-when">{withL[0]}</span><p>{withL[1]}</p><code className="uc-call">{u.call}</code></Reveal>
            </div>
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="container grid g2" style={{ gap: 40, alignItems: 'start' }}>
          <Reveal className="stack gap-16">
            <p className="overline">What Locus AI captures</p>
            <h2 className="h2">Records your people and agents can rely on.</h2>
            <div className="stack gap-8">
              {u.captures.map(([k, t, m]) => (
                <div key={t} className="uc-rec"><Tag t={k as any} /><strong style={{ textDecoration: k === 'Superseded' ? 'line-through' : undefined }}>{t}</strong><span className="caption">{m}</span></div>
              ))}
            </div>
            <p className="caption">Captured from: {u.where.join(', ')}.</p>
          </Reveal>
          <Reveal className="stack gap-16">
            <p className="overline">What to measure in a pilot</p>
            <h2 className="h2">Agree the measures before you start.</h2>
            <ul className="dp-fit">{u.measure.map((m) => <li key={m}>{m}</li>)}</ul>
            <p className="caption">We baseline these with you in week one and compare at the end of the pilot.</p>
          </Reveal>
        </div>
      </section>
      <section className="section-sm">
        <div className="container row gap-12 wrap" style={{ justifyContent: 'center' }}>
          {others.map((o) => <Link key={o.slug} className="btn btn-secondary" href={`/use-cases/${o.slug}`}>{o.name} use case →</Link>)}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
