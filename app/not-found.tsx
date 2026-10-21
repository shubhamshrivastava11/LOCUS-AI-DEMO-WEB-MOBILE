import type { Metadata } from 'next';
import { asset } from '@/lib/base';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Page not found', description: 'This page doesn’t exist or has moved.', robots: { index: false } };

export default function NotFound() {
  return (
    <main id="main" className="nf">
      <div className="nf-in">
        <img src={asset('/logo-light.svg')} alt="Locus AI" width={160} height={34} />
        <p className="pg-k">Error 404</p>
        <h1 className="pg-title">This page wasn’t remembered.</h1>
        <p className="pg-lead">The link may be old, or the page has moved.</p>
        <div className="row gap-12 wrap">
          <Link className="btn btn-ink btn-lg" href="/">Back to home</Link>
          <Link className="ed-link" href="/contact">Contact the team</Link>
        </div>
      </div>
    </main>
  );
}
