import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import Link from 'next/link';
import CommandPalette from '@/components/CommandPalette';
import { BackToTop, PointerLight, ScrollProgress } from '@/components/Motion';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <aside className="announce" aria-label="Announcement"><span className="announce-tag">Now open</span>Design partner program: early access to Enterprise features and a direct line to the team. <Link href="/design-partners">Apply</Link></aside>
      <SiteNav />
      <main id="main">{children}</main>
      <SiteFooter />
      <ScrollProgress />
      <PointerLight />
      <BackToTop />
      <CommandPalette />
    </>
  );
}
