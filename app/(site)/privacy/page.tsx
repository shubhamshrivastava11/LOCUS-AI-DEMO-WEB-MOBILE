import Link from 'next/link';
import type { Metadata } from 'next';
import { PageHero } from '@/components/Sections';

export const metadata: Metadata = { title: 'Privacy policy' };

export default function Page() {
  return (
    <>
      <PageHero overline="Legal" title="Privacy policy" lead="How Locus AI handles the data it reads." />
      <section className="section">
        <div className="container stack gap-16" style={{ maxWidth: 760 }}>
          <h2 className="h3">Summary</h2>
          <p className="body">Locus AI connects to your tools with read-only access, encrypts raw content at rest and purges it after 30 days, and keeps only structured decisions. Access follows role, scope and classification. Personal sources remain private to their owner.</p>
          <h2 className="h3">Contact</h2>
          <p className="body">Questions about this policy: <Link href="/contact">contact our team</Link>.</p>
        </div>
      </section>
    </>
  );
}
