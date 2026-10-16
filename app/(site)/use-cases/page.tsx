import Link from 'next/link';
import type { Metadata } from 'next';
import { Reveal } from '@/components/Interactive';
import { CtaBand, PageHero } from '@/components/Sections';
import { USE_CASES } from '@/lib/content';

export const metadata: Metadata = { title: 'Use cases', description: 'How support, sales and engineering teams keep people and AI agents consistent with what was decided.' };

export default function UseCases() {
  return (
    <>
      <PageHero overline="Use cases" title="Wherever decisions change faster than documents." lead="Three teams where an AI agent acting on an outdated decision costs real money. Each example uses sample data." />
      <section className="section">
        <div className="container grid g3">
          {USE_CASES.map((u, i) => (
            <Reveal key={u.slug} delay={i * 80}>
              <Link href={`/use-cases/${u.slug}`} className="card card-hover uc-card">
                <span className="overline">{u.name}</span>
                <h2 className="h3">{u.title}</h2>
                <p className="small">{u.lead}</p>
                <span className="uc-tools">{u.where.join(' · ')}</span>
                <span className="uc-more">See the example →</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
