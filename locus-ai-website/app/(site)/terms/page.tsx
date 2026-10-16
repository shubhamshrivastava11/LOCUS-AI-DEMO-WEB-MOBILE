import type { Metadata } from 'next';
import { PageHero } from '@/components/Sections';

export const metadata: Metadata = { title: 'Terms of service' };

export default function Page() {
  return (
    <>
      <PageHero overline="Legal" title="Terms of service" lead="Last updated: [date]" />
      <section className="section">
        <div className="container stack gap-16" style={{ maxWidth: 760 }}>
          <p className="placeholder" style={{ padding: '10px 14px', borderRadius: 10 }}>Draft placeholder. Replace this page with your counsel-reviewed Terms of service before launch.</p>
          <h2 className="h3">Summary</h2>
          <p className="body">Locus AI connects to your tools with read-only access, encrypts raw content at rest and purges it after 30 days, and keeps only structured decisions. Access follows role, scope and classification. Personal sources remain private to their owner.</p>
          <h2 className="h3">Contact</h2>
          <p className="body">Questions about this policy: <a href="/contact">contact our team</a>.</p>
        </div>
      </section>
    </>
  );
}
