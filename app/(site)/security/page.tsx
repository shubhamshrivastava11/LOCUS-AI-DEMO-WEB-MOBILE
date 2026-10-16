import Link from 'next/link';
import type { Metadata } from 'next';
import { Reveal } from '@/components/Interactive';
import { CtaBand, Cls, PageHero, SectionHead } from '@/components/Sections';
import { CLASSES, ROLES, SECURITY } from '@/lib/content';

export const metadata: Metadata = { title: 'Security', description: 'Read-only access, 30-day raw content purge, five roles, four classification levels, audit log, SSO and SCIM.' };

export default function Security() {
  return (
    <>
      <PageHero overline="Security & governance" title="Shared memory, with real boundaries." lead="Every answer, digest and agent call checks role, scope and classification first. Raw content is purged after 30 days; only structured decisions persist.">
        <div className="row gap-12 wrap" style={{ justifyContent: 'center' }}><Link className="btn btn-primary btn-lg" href="/contact">Request a security review</Link><a className="btn btn-secondary btn-lg" href="#dpa">Data processing</a></div>
      </PageHero>
      <section className="section">
        <div className="container">
          <SectionHead overline="Controls" title="What Locus AI does, and what it never does." />
          <div className="grid g3">{SECURITY.map((s) => <Reveal key={s.title}><div className="card card-hover stack gap-8" style={{ height: '100%' }}><h3 className="h4">{s.title}</h3><p className="small">{s.body}</p></div></Reveal>)}</div>
        </div>
      </section>
      <section className="section alt">
        <div className="container grid g2" style={{ gap: 40, alignItems: 'start' }}>
          <Reveal className="stack gap-16" >
            <p className="overline">Roles</p>
            <h2 className="h2">Five roles, scoped to how your org works.</h2>
            <div className="table-wrap"><table className="table"><thead><tr><th>Role</th><th>Can</th></tr></thead><tbody>{ROLES.map((r) => <tr key={r.role}><td style={{ fontWeight: 600 }}>{r.role}</td><td className="muted">{r.desc}</td></tr>)}</tbody></table></div>
          </Reveal>
          <Reveal className="stack gap-16" >
            <p className="overline">Classification</p>
            <h2 className="h2">Four levels, checked on every request.</h2>
            <div className="table-wrap"><table className="table"><thead><tr><th>Level</th><th>Who can see it</th></tr></thead><tbody>{CLASSES.map((c) => <tr key={c.level}><td><Cls l={c.level} /></td><td className="muted">{c.who}</td></tr>)}</tbody></table></div>
          </Reveal>
        </div>
      </section>
      <section className="section">
        <div className="container grid g2" style={{ gap: 40 }}>
          <Reveal className="stack gap-12" >
            <p className="overline">Data handling</p>
            <h2 className="h2">Minimal by design.</h2>
            <ul className="body" style={{ display: 'grid', gap: 10, paddingLeft: 18, margin: 0 }}>
              <li>Read-only OAuth scopes, chosen per channel, label, space or project.</li>
              <li>Raw messages encrypted at rest and purged after 30 days.</li>
              <li>Structured decisions kept until an Admin deletes them.</li>
              <li>Personal sources visible only to their owner, including from Admins.</li>
              <li>Agents get the same permissions as the person they act for.</li>
            </ul>
          </Reveal>
          <Reveal className="stack gap-12" >
            <div id="dpa" style={{ scrollMarginTop: 90 }} />
            <p className="overline">Compliance & contracts</p>
            <h2 className="h2">Ready for your security review.</h2>
            <div className="card stack gap-12">
              {[['Data Processing Agreement', 'Available on request'], ['Security questionnaire', 'Answered by our team'], ['SSO (SAML) and SCIM', 'Enterprise plan']].map(([a, b]) => <div key={a} className="row between gap-12"><span style={{ fontWeight: 600 }}>{a}</span><span className={b.startsWith('[') ? 'placeholder small' : 'small'}>{b}</span></div>)}
            </div>
          </Reveal>
        </div>
      </section>
      <CtaBand title="Bring your security team. We’ll bring the answers." lead="Book a walkthrough of roles, classification, retention and audit logging with your own sources." />
    </>
  );
}
