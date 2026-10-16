'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/* Thin progress line under the nav that tracks how far you've read */
export function ScrollProgress() {
  useEffect(() => {
    const el = document.documentElement;
    const on = () => { const max = el.scrollHeight - innerHeight; el.style.setProperty('--read', String(max > 0 ? scrollY / max : 0)); };
    on(); addEventListener('scroll', on, { passive: true }); addEventListener('resize', on);
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on); };
  }, []);
  return <div className="read-bar" aria-hidden="true" />;
}

/* Soft light that follows the pointer across dark sections and over cards */
export function PointerLight() {
  const path = usePathname();
  useEffect(() => {
    if (matchMedia('(pointer: coarse)').matches) return;
    const on = (e: PointerEvent) => {
      const t = (e.target as HTMLElement)?.closest?.('.dark, .lit') as HTMLElement | null;
      if (!t) return;
      const r = t.getBoundingClientRect();
      t.style.setProperty('--mx', `${e.clientX - r.left}px`); t.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    addEventListener('pointermove', on, { passive: true });
    return () => removeEventListener('pointermove', on);
  }, [path]);
  return null;
}

/* Back-to-top button that appears after the first screen */
export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => { const on = () => setShow(scrollY > innerHeight * 1.2); on(); addEventListener('scroll', on, { passive: true }); return () => removeEventListener('scroll', on); }, []);
  return (
    <button className={`to-top ${show ? 'show' : ''}`} aria-label="Back to top" tabIndex={show ? 0 : -1}
      onClick={() => scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6" /></svg>
    </button>
  );
}
