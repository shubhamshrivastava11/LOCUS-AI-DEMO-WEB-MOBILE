import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import Link from 'next/link';
import CommandPalette from '@/components/CommandPalette';
import { BackToTop, PointerLight, ScrollProgress } from '@/components/Motion';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="announce"><span className="announce-tag">New</span>Locus AI now ships an MCP server, so any agent can query your team’s memory. <Link href="/product#mcp">See the tools</Link></div>
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
