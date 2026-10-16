import { asset } from '@/lib/base';
import Link from 'next/link';
import { SITE } from '@/lib/content';

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="stack gap-12">
            <img src={asset('/logo-light.svg')} alt="Locus AI" width={158} height={33} />
            <p className="small" style={{ maxWidth: 300 }}>{SITE.tagline}.</p>
            <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" className="small" style={{ fontWeight: 600 }}>LinkedIn</a>
          </div>
          <div>
            <h4>Product</h4>
            <ul>
              <li><Link href="/product">Context Search</Link></li>
              <li><Link href="/product#explorer">Memory Explorer</Link></li>
              <li><Link href="/product#pulse">Team Pulse</Link></li>
              <li><Link href="/product#mcp">MCP Server</Link></li>
              <li><Link href="/enterprise">Enterprise</Link></li>
              <li><Link href="/integrations">Integrations</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><Link href="/design-partners">Design partners</Link></li>
              <li><Link href="/use-cases">Use cases</Link></li>
              <li><Link href="/contact">Contact sales</Link></li>
              <li><Link href="/demo">Live demo</Link></li>
              <li><Link href="/signin">Sign in</Link></li>
            </ul>
          </div>
          <div>
            <h4>Trust</h4>
            <ul>
              <li><Link href="/trust">Trust center</Link></li>
              <li><Link href="/security">Security</Link></li>
              <li><Link href="/privacy">Privacy policy</Link></li>
              <li><Link href="/terms">Terms of service</Link></li>
              <li><Link href="/security#dpa">DPA</Link></li>
            </ul>
          </div>
        </div>
        <hr className="divider" style={{ margin: '40px 0 20px' }} />
        <p className="caption">© {new Date().getFullYear()} Locus AI. All rights reserved.</p>
      </div>
    </footer>
  );
}
