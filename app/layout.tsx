import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/inter';
import '@fontsource/jetbrains-mono/500.css';
import '@fontsource-variable/inter-tight';
import '@fontsource-variable/newsreader/opsz.css';
import '@fontsource-variable/newsreader/opsz-italic.css';
import './globals.css';
import { SITE } from '@/lib/content';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: 'Locus AI · Organizational memory for enterprise AI', template: '%s · Locus AI' },
  description: 'Locus AI captures every decision your team makes across Slack, Gmail, Notion, Jira and more, and serves it back with sources and permissions to the people and agents who act next.',
  openGraph: { title: 'Locus AI · Your AI can reason. Locus AI makes it remember.', description: 'Organizational memory infrastructure for enterprise AI.', type: 'website', siteName: 'Locus AI', url: SITE.url, images: [{ url: `${SITE.url}/og.png`, width: 1200, height: 630, alt: 'Locus AI' }] },
  twitter: { card: 'summary_large_image', images: [`${SITE.url}/og.png`] },
};
export const viewport: Viewport = { themeColor: '#0B1424', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
