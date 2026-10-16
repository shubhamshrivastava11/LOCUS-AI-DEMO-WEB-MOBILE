import Link from 'next/link';
export default function NotFound() {
  return (
    <main id="main" className="dark" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <div className="stack gap-16 center" style={{ maxWidth: 520 }}>
        <img src="/logo-dark.svg" alt="Locus AI" width={160} height={34} />
        <h1 className="h1">This page wasn’t remembered.</h1>
        <p className="lead">The link may be old, or the page moved. Even our memory has boundaries.</p>
        <Link className="btn btn-primary btn-lg" href="/">Back to home</Link>
      </div>
    </main>
  );
}
