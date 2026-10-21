import Link from 'next/link';
import type { Metadata } from 'next';
import { PageHero } from '@/components/Sections';

export const metadata: Metadata = { title: 'Privacy policy', description: 'How Locus AI collects, uses, stores and protects information during the private pilot.' };

const SECTIONS: { h: string; p?: string; li?: string[] }[] = [
  { h: 'Who this covers', p: 'This notice covers the Locus AI website, the live demo and the Locus AI service as used by pilot customers. It will be replaced by a full privacy policy before general availability.' },
  { h: 'What we collect', li: [
    'Account details: your name, work email and company, when you sign in or contact us.',
    'Content from the sources your admin connects: messages, pages, tickets and threads in the channels, labels, spaces and projects you choose. Access is read-only.',
    'Decision records that Locus AI creates from that content: the summary, owner, date, source link and classification.',
    'Usage information needed to run and secure the service, such as sign-ins, admin actions and access to confidential records, recorded in the audit log.',
  ] },
  { h: 'How we use it', li: [
    'To capture decisions and answer questions from people and AI agents in your workspace.',
    'To enforce your roles, scopes and classification rules on every answer.',
    'To operate, secure and support the service, and to reply to you when you contact us.',
  ] },
  { h: 'What we never do', li: [
    'Post, edit or reply in your tools. Every connection is read-only.',
    'Sell your data, or use it for advertising.',
    'Show personal sources, such as a person’s own Gmail, to anyone but their owner, including Admins.',
  ] },
  { h: 'How long we keep it', li: [
    'Raw content from your sources is purged after 30 days.',
    'Structured decision records are kept until an Admin deletes them, or until your workspace is deleted.',
    'Admins can export the audit log at any time.',
  ] },
  { h: 'Who processes it', p: 'Locus AI uses a small number of service providers to host the service and run the AI models that extract decisions. Content sent to model providers through their commercial APIs is not used to train their models. The current list of sub-processors is shared with your Data Processing Agreement.' },
  { h: 'Your choices', li: [
    'Admins choose exactly which channels, labels, spaces and projects Locus AI can read, and can disconnect a source at any time.',
    'Admins can delete decision records and export the workspace.',
  ] },
];

export default function Page() {
  return (
    <>
      <PageHero overline="Legal" title="Privacy policy" lead="How Locus AI collects, uses, stores and protects information during the private pilot." />
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
            <h2 className="h3">Contact</h2>
            <p className="body">Questions or requests about your data: <Link href="/contact">contact the Locus AI team</Link>. See also the <Link href="/trust">Trust center</Link> and <Link href="/security">how access works</Link>.</p>
          </section>
        </div>
      </section>
    </>
  );
}
