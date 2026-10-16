import fs from 'node:fs';
import path from 'node:path';
import { asset } from '@/lib/base';
import { ToolIcon, toolHue } from './ToolIcon';

// Build-time lookup: use an official logo file if one was dropped into public/integrations/
export function logoFor(slug: string): string | null {
  for (const ext of ['svg', 'png', 'webp']) {
    if (fs.existsSync(path.join(process.cwd(), 'public', 'integrations', `${slug}.${ext}`))) return `/integrations/${slug}.${ext}`;
  }
  return null;
}

export function IntegrationMark({ name, slug, cat, size = 40 }: { name: string; slug: string; cat: string; size?: number }) {
  const src = logoFor(slug);
  return (
    <span className={`int-mark ${src ? 'has-logo' : 'tool'}`} style={{ width: size, height: size, ['--hue' as any]: toolHue(slug) }} aria-hidden="true">
      {src ? <img src={asset(src)} alt="" width={size - 14} height={size - 14} /> : <ToolIcon slug={slug} size={Math.round(size * 0.48)} />}
    </span>
  );
}

export function IntegrationTile({ name, slug, cat, scope, compact }: { name: string; slug: string; cat: string; scope?: string; compact?: boolean }) {
  return (
    <div className={`int-tile ${compact ? 'compact' : ''}`}>
      <IntegrationMark name={name} slug={slug} cat={cat} size={compact ? 36 : 44} />
      <div className="stack" style={{ gap: 2, minWidth: 0 }}>
        <strong className="int-name">{name}</strong>
        {scope && !compact && <span className="caption">{scope}</span>}
      </div>
      {!compact && <span className="int-live">In pilot</span>}
    </div>
  );
}
