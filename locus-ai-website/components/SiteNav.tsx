'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NAV } from '@/lib/content';

export default function SiteNav({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, []);
  const dark = tone === 'dark' && !open;
  return (
    <header className={`nav ${tone === 'dark' ? 'on-dark' : 'on-light'} ${scrolled || open ? 'scrolled' : ''}`} style={open ? { background: '#0B1424', color: '#fff' } : undefined}>
      <div className="container nav-inner">
        <Link href="/" aria-label="Locus AI home">
          <img src={dark || open ? '/logo-dark.svg' : '/logo-light.svg'} alt="Locus AI" width={158} height={33} />
        </Link>
        <nav aria-label="Primary">
          <ul className="nav-links">
            {NAV.map((n) => (
              <li key={n.href}><Link href={n.href} aria-current={path === n.href ? 'page' : undefined}>{n.label}</Link></li>
            ))}
          </ul>
        </nav>
        <div className="nav-cta">
          <Link className="nav-signin" href="/signin">Sign in</Link>
          <Link className="btn btn-primary" href="/contact">Book a demo</Link>
          <button className="menu-btn" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>{open ? 'Close' : 'Menu'}</button>
        </div>
      </div>
      <div id="mobile-menu" className={`mobile-menu ${open ? 'open' : ''}`}>
        {NAV.map((n) => <Link key={n.href} href={n.href}>{n.label}</Link>)}
        <Link href="/signin">Sign in</Link>
        <div style={{ marginTop: 24 }}><Link className="btn btn-primary btn-lg btn-block" href="/contact" style={{ fontSize: 16, border: 0, padding: 0 }}>Book a demo</Link></div>
      </div>
    </header>
  );
}
