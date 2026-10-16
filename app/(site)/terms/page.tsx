import Link from 'next/link';
import type { Metadata } from 'next';
import { PageHero } from '@/components/Sections';

export const metadata: Metadata = { title: 'Terms of service' };

export default function Page() {
  return (
    <>
      <PageHero overline="Legal" title="Terms of service" lead="The terms that govern use of Locus AI." />
      <section className="section">
        <div className="container stack gap-16" style={{ maxWidth: 760 }}>
          <h2 className="h3">Summary</h2>
          <p className="body">Locus AI is in a private pilot. Terms of service are provided to each pilot customer directly. To request a copy, contact our team.</p>
          <h2 className="h3">Contact</h2>
          <p className="body">Questions about these terms: <Link href="/contact">contact our team</Link>.</p>
        </div>
      </section>
    </>
  );
}
