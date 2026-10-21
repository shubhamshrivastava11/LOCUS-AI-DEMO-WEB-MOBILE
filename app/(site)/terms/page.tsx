import Link from 'next/link';
import type { Metadata } from 'next';
import { PageHero } from '@/components/Sections';

export const metadata: Metadata = { title: 'Terms of service', description: 'How terms work during the Locus AI private pilot, and how to request them.' };

const SECTIONS: { h: string; p?: string; li?: string[] }[] = [
  { h: 'The private pilot', p: 'Locus AI is in a private pilot. Each pilot customer receives the full terms of service with their pilot agreement, before any source is connected. Those signed terms govern the service.' },
  { h: 'What these pages cover', li: [
    'This website, which describes Locus AI and how it works.',
    'The live demo, which runs entirely in your browser with sample data for a fictional company, Acme. Nothing you do in the demo is sent to Locus AI.',
    'The contact and design partner forms, which prepare a message for you to send to the team. The form itself does not store or transmit your details.',
  ] },
  { h: 'Your data in the pilot', li: [
    'Every connection is read-only, and your admins choose exactly what Locus AI can read.',
    'How data is collected, used and kept is described in the privacy policy.',
    'A Data Processing Agreement and our security questionnaire answers are available on request.',
  ] },
  { h: 'Early access features', p: 'Enterprise features such as Decision Guard are in early access. They are offered to design partners for evaluation and may change before general availability.' },
];

export default function Page() {
  return (
    <>
      <PageHero overline="Legal" title="Terms of service" lead="How terms work during the private pilot, and how to request them." />
      <section className="section">
        <div className="container legal">
          {SECTIONS.map((s) => (
            <section key={s.h} className="legal-s">
              <h2 className="h3">{s.h}</h2>
              {s.p && <p className="body">{s.p}</p>}
              {s.li && <ul className="body">{s.li.map((x) => <li key={x}>{x}</li>)}</ul>}
            </section>
          ))}
          <section className="legal-s">
            <h2 className="h3">Request the terms</h2>
            <p className="body">To review the pilot terms before you apply, <Link href="/contact">contact the Locus AI team</Link>. See also the <Link href="/privacy">privacy policy</Link> and the <Link href="/trust">Trust center</Link>.</p>
          </section>
        </div>
      </section>
    </>
  );
}
