import Link from 'next/link';
import type { ReactNode } from 'react';
import { Reveal } from './Interactive';

export function PageHero({ overline, title, lead, children }: { overline: string; title: ReactNode; lead?: string; children?: ReactNode }) {
  return (
    <section className="pg-hero">
      <div className="container pg-hero-in">
        <p className="pg-k">{overline}</p>
        <h1 className="pg-title">{title}</h1>
        {lead && <p className="pg-lead">{lead}</p>}
        {children && <div className="pg-cta">{children}</div>}
        <div className="pg-rule" aria-hidden="true" />
      </div>
    </section>
  );
}

export function SectionHead({ overline, title, lead, centered }: { overline: string; title: string; lead?: string; centered?: boolean }) {
  return (
    <Reveal className={`head ${centered ? 'centered' : ''}`}>
      <p className="overline">{overline}</p>
      <h2 className="h1">{title}</h2>
      {lead && <p className="lead">{lead}</p>}
    </Reveal>
  );
}

export function CtaBand({ title = 'Give your team a memory that doesn’t walk out the door.', lead = 'In pilot with 40+ users across 10 integrations. Read-only from day one, with nothing new to learn.', partner = false }: { title?: string; lead?: string; partner?: boolean }) {
  return (
    <section className="section">
      <div className="container">
        <Reveal className="" as="div">
          <div className="dark" style={{ borderRadius: 28, padding: 'clamp(40px,7vw,88px) clamp(24px,6vw,72px)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <h2 className="h1" style={{ maxWidth: 820 }}>{title}</h2>
            <p className="lead" style={{ maxWidth: 560 }}>{lead}</p>
            <div className="row gap-12 wrap" style={{ justifyContent: 'center' }}>
              {partner ? <>
                <Link className="btn btn-primary btn-lg" href="/design-partners">Become a design partner</Link>
                <Link className="btn btn-secondary btn-lg" href="/contact">Book a demo</Link>
              </> : <>
                <Link className="btn btn-primary btn-lg" href="/contact">Book a demo</Link>
                <Link className="btn btn-secondary btn-lg" href="/demo">Try the live demo</Link>
              </>}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export const Tag = ({ t }: { t: 'Decision' | 'Action' | 'Blocker' | 'Superseded' }) => <span className={`tag tag-${t.toLowerCase()}`}>{t}</span>;
export const Cls = ({ l }: { l: string }) => <span className={`cls cls-${l.toLowerCase()}`}>{l}</span>;
