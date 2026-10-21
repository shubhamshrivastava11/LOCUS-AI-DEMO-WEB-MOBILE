import { Suspense } from 'react';
import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = { title: 'Contact sales', description: 'Book a 30-minute Locus AI walkthrough with your own sources, roles and classification rules.' };

export default function Contact() {
  return (
    <section className="pg-hero pg-contact">
      <div className="container grid g2" style={{ gap: 56, alignItems: 'start' }}>
        <div className="stack gap-20 hero-in">
          <p className="pg-k">Contact sales</p>
          <h1 className="pg-title">See Locus AI on your own decisions.</h1>
          <p className="lead">A 30-minute walkthrough with your sources, roles and classification rules. We’ll cover SSO, SCIM, retention and your security review.</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
            {['Security questionnaire and DPA on request', 'Pilot with your own Slack and Notion', 'Pricing for your seat count'].map((t) => <li key={t} className="row gap-12"><span style={{ color: 'var(--brand)', fontWeight: 700 }}>✓</span>{t}</li>)}
          </ul>
        </div>
        <Suspense fallback={<div className="card card-lg" style={{ minHeight: 480 }} />}><ContactForm /></Suspense>
      </div>
    </section>
  );
}
