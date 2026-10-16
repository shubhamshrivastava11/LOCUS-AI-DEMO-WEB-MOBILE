import Link from 'next/link';
import type { Metadata } from 'next';
import { Reveal, Faq } from '@/components/Interactive';
import { CtaBand, PageHero, SectionHead } from '@/components/Sections';
import TrustCenter from '@/components/TrustCenter';
import { TRUST_FAQ } from '@/lib/content';

export const metadata: Metadata = { title: 'Trust center', description: 'What Locus AI has in place today, and what is planned: access, data handling, governance and assurance.' };

export default function Trust() {
  return (
    <>
      <PageHero overline="Trust center" title="What’s in place, and what isn’t yet." lead="Locus AI is in pilot. This page lists every security and compliance control we’re asked about, with its real status. If something matters for your review and it says Planned, tell us and we’ll show you where it sits on the roadmap.">
        <div className="row gap-12 wrap" style={{ justifyContent: 'center' }}>
          <Link className="btn btn-primary btn-lg" href="/contact">Request a security review</Link>
          <Link className="btn btn-secondary btn-lg" href="/security">How access works</Link>
        </div>
      </PageHero>
      <section className="section">
        <div className="container">
          <SectionHead overline="Controls" title="Every control, with its status." lead="Filter by status. Nothing is listed as in place unless it works in the product today." />
          <Reveal><TrustCenter /></Reveal>
        </div>
      </section>
      <section className="section alt">
        <div className="container">
          <SectionHead overline="Security review" title="Questions your security team will ask." lead="Straight answers, including where the answer is “not yet”." centered />
          <Faq items={TRUST_FAQ} />
        </div>
      </section>
      <section className="section">
        <div className="container grid g3">
          {[['Data Processing Agreement', 'Available on request for pilot and enterprise customers.'], ['Sub-processor list', 'Hosting and model providers, shared with your DPA.'], ['Security questionnaire', 'We fill in yours. SIG Lite and CAIQ formats welcome.']].map(([t, b]) => (
            <Reveal key={t}><div className="card card-hover stack gap-8" style={{ height: '100%' }}><h3 className="h4">{t}</h3><p className="small">{b}</p><Link className="small" style={{ fontWeight: 600 }} href="/contact">Request it</Link></div></Reveal>
          ))}
        </div>
      </section>
      <CtaBand title="Bring your security team. We’ll bring straight answers." lead="Walk through roles, classification, retention and the audit log with your own sources." />
    </>
  );
}
