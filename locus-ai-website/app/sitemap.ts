import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/content';
export default function sitemap(): MetadataRoute.Sitemap {
  return ['', '/product', '/integrations', '/security', '/pricing', '/contact', '/demo', '/signin', '/privacy', '/terms'].map((p) => ({ url: `${SITE.url}${p}`, lastModified: new Date(), changeFrequency: 'weekly', priority: p === '' ? 1 : 0.7 }));
}
