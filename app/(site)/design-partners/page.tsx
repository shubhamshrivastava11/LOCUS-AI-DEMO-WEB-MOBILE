import Link from 'next/link';
import type { Metadata } from 'next';
import { Reveal } from '@/components/Interactive';
import { CtaBand, PageHero, SectionHead } from '@/components/Sections';

export const metadata: Metadata = { title: 'Design partners', description: 'Shape Locus AI with us: early access to Enterprise features, roadmap influence and a direct line to the team.' };

const GET = [
  ['Early access', 'Decision Guard, reversal impact, change alerts, handover and Decision Health before general release.'],
  ['Your stack first', 'Connectors and agent platforms you rely on move up the roadmap.'],
  ['A direct line', 'A shared channel with the founding team. Bugs and requests go straight to the people building it.'],
  ['Design-partner pricing', 'Terms agreed on the first call and held for your first contract.'],
  ['Your own accuracy numbers', 'We measure how well Locus AI captures decisions on your sources, and share the results with you.'],
  ['Security review support', 'Help with questionnaires, the DPA and your internal approvals.'],
];
const ASK = [
  ['One team, one or two tools', 'Start with a team of 10 to 50 people and the tools they decide in.'],
  ['A short kickoff', 'Thirty minutes to agree what success looks like for your team.'],
  ['Regular feedback', 'A 30-minute call every two weeks during the pilot.'],
  ['Honesty', 'Tell us what doesn’t work. If it does work, consider being a reference.'],
];
const FIT = [
  'Your team runs AI agents or copilots in support, sales or engineering',
  'Decisions happen in Slack, Teams, email or meetings, not in one system',
  'Someone can approve read-only OAuth for a pilot',
  'You’d rather shape a product than wait for a finished one',
];
const STEPS = [
  ['Apply', 'Tell us which team and which tools.'],
  ['Scope', 'A 30-minute call to pick sources and success measures.'],
  ['Connect', 'Read-only OAuth. Locus AI reads recent history first, so your team doesn’t start from an empty memory.'],
  ['Review', 'At the end of the pilot, we review the results against the measures you picked.'],
];

export default function DesignPartners() {
  return (
    <>
      <PageHero overline="Design partner program" title="Shape organizational memory for AI agents with us." lead="We’re working closely with a small group of teams. You get early access and a say in what we build next. We get honest feedback from real work.">
        <div className="row gap-12 wrap" style={{ justifyContent: 'center' }}>
          <Link className="btn btn-primary btn-lg" href="/contact?topic=partner">Apply</Link>
          <Link className="btn btn-secondary btn-lg" href="/demo">Try the live demo first</Link>
        </div>
      </PageHero>
      <section className="section">
        <div className="container">
          <SectionHead overline="What you get" title="More than early access." />
          <div className="grid g3">{GET.map(([t, b], i) => <Reveal key={t} delay={i * 60}><div className="card card-hover stack gap-8" style={{ height: '100%' }}><h3 className="h4">{t}</h3><p className="small">{b}</p></div></Reveal>)}</div>
        </div>
      </section>
      <section className="section alt">
        <div className="container grid g2" style={{ gap: 40, alignItems: 'start' }}>
          <Reveal className="stack gap-16">
            <p className="overline">What we ask</p>
            <h2 className="h2">A small, focused commitment.</h2>
            <div className="stack gap-12">{ASK.map(([t, b]) => <div key={t} className="dp-ask"><strong>{t}</strong><span className="small">{b}</span></div>)}</div>
          </Reveal>
          <Reveal className="stack gap-16">
            <p className="overline">Good fit</p>
            <h2 className="h2">You’ll get the most out of it if…</h2>
            <ul className="dp-fit">{FIT.map((f) => <li key={f}>{f}</li>)}</ul>
          </Reveal>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHead overline="How it works" title="From application to results." centered />
          <ol className="dp-steps">{STEPS.map(([t, b], i) => <Reveal as="li" key={t} delay={i * 80}><span className="dp-n">{i + 1}</span><strong>{t}</strong><span className="small">{b}</span></Reveal>)}</ol>
        </div>
      </section>
      <CtaBand title="Want a say in how your agents remember?" lead="Every application is read by the founding team." />
    </>
  );
}
