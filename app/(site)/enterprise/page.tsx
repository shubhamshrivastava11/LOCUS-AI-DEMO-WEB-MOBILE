import Link from 'next/link';
import type { Metadata } from 'next';
import { Reveal } from '@/components/Interactive';
import { CtaBand, PageHero } from '@/components/Sections';
import { AlertsDemo, GuardDemo, HandoverDemo, HealthDemo, ReversalDemo } from '@/components/Enterprise';
import { ENTERPRISE } from '@/lib/content';

export const metadata: Metadata = { title: 'Enterprise', description: 'Decision Guard, reversal impact, decision change alerts, ownerless decision handover and Decision Health: memory that keeps people and agents consistent with what your organization decided.' };

const DEMOS: Record<string, () => JSX.Element> = { reversal: ReversalDemo, alerts: AlertsDemo, handover: HandoverDemo, health: HealthDemo };

export default function Enterprise() {
  const [guard, ...rest] = ENTERPRISE;
  return (
    <>
      <PageHero overline="Enterprise · Early access" title="Memory that keeps every agent consistent with what you decided." lead="Search answers questions. These five features stop people and agents from acting against decisions your organization already made, and show you what happens when a decision changes.">
        <div className="row gap-12 wrap" style={{ justifyContent: 'center' }}>
          <Link className="btn btn-primary btn-lg" href="/contact">Join early access</Link>
          <a className="btn btn-secondary btn-lg" href="#guard">Try Decision Guard</a>
        </div>
      </PageHero>

      <section className="section-sm ent-index-wrap">
        <div className="container">
          <nav className="ent-index" aria-label="Enterprise features">
            {ENTERPRISE.map((f, i) => <a key={f.key} href={`#${f.key}`}><span className="ent-n">{i + 1}</span>{f.name}</a>)}
          </nav>
        </div>
      </section>

      <section id="guard" className="section ent-anchor">
        <div className="container">
          <Reveal className="head">
            <span className="ea-tag">Early access</span>
            <h2 className="h1">{guard.name}</h2>
            <p className="lead">{guard.line} {guard.body}</p>
          </Reveal>
          <GuardDemo />
        </div>
      </section>

      {rest.map((f, i) => { const Demo = DEMOS[f.key]; return (
        <section key={f.key} id={f.key} className={`section ent-anchor ${i % 2 === 0 ? 'alt' : ''}`}>
          <div className="container ent-split">
            <Reveal className="stack gap-16">
              <span className="ea-tag">Early access</span>
              <h2 className="h2">{f.name}</h2>
              <p className="lead" style={{ fontSize: 19 }}>{f.line}</p>
              <p className="body">{f.body}</p>
            </Reveal>
            <Reveal delay={120}><Demo /></Reveal>
          </div>
        </section>
      ); })}

      <section className="section-sm">
        <div className="container card card-lg row between wrap gap-20">
          <div className="stack gap-8" style={{ maxWidth: 620 }}>
            <h2 className="h3">Shape these features with us</h2>
            <p className="body">Enterprise features are in early access. Design partners get them first and help decide what ships next.</p>
          </div>
          <Link className="btn btn-primary btn-lg" href="/contact">Become a design partner</Link>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
