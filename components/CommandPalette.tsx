'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconArrow, IconSearch } from './Icons';

type Item = { label: string; hint: string; href: string; group: string };
const ITEMS: Item[] = [
  { group: 'Pages', label: 'Home', hint: 'Overview', href: '/' },
  { group: 'Pages', label: 'Product', hint: 'Search, Explorer, Pulse, MCP', href: '/product' },
  { group: 'Pages', label: 'Integrations', hint: 'Slack, Gmail, Notion, Jira and more', href: '/integrations' },
  { group: 'Pages', label: 'Enterprise', hint: 'Decision Guard and more, early access', href: '/enterprise' },
  { group: 'Pages', label: 'Security', hint: 'Roles, classification, retention', href: '/security' },
  { group: 'Pages', label: 'Pricing', hint: 'Individual, Team, Enterprise', href: '/pricing' },
  { group: 'Product', label: 'Context Search', hint: 'Ask what was decided', href: '/product#search' },
  { group: 'Product', label: 'Memory Explorer', hint: 'Every decision in one place', href: '/product#explorer' },
  { group: 'Product', label: 'Team Pulse', hint: 'Weekly read on what moved', href: '/product#pulse' },
  { group: 'Product', label: 'MCP server for agents', hint: 'search_decisions, get_decision_context', href: '/product#mcp' },
  { group: 'Enterprise', label: 'Decision Guard', hint: 'Agents check plans against decisions', href: '/enterprise#guard' },
  { group: 'Enterprise', label: 'Reversal impact', hint: 'What depends on a decision', href: '/enterprise#reversal' },
  { group: 'Enterprise', label: 'Decision change alerts', hint: 'Push changes to running agents', href: '/enterprise#alerts' },
  { group: 'Enterprise', label: 'Ownerless decision handover', hint: 'Reassign when people move on', href: '/enterprise#handover' },
  { group: 'Enterprise', label: 'Decision Health', hint: 'How well teams keep decisions', href: '/enterprise#health' },
  { group: 'Security', label: 'Data processing', hint: 'DPA and retention', href: '/security#dpa' },
  { group: 'Actions', label: 'Try the live demo', hint: 'Click through the app', href: '/demo' },
  { group: 'Actions', label: 'Book a demo', hint: 'Talk to the team', href: '/contact' },
  { group: 'Actions', label: 'Request an integration', hint: 'Tell us which tool', href: '/contact?topic=integration' },
  { group: 'Actions', label: 'Sign in', hint: 'Google, Microsoft or SSO', href: '/signin' },
];

export function openPalette() { window.dispatchEvent(new Event('open-palette')); }

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [i, setI] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return t ? ITEMS.filter((x) => (x.label + ' ' + x.hint + ' ' + x.group).toLowerCase().includes(t)) : ITEMS;
  }, [q]);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen((o) => !o); }
      else if (e.key === '/' && !open && !(e.target as HTMLElement)?.closest('input,textarea,select,[contenteditable]')) { e.preventDefault(); setOpen(true); }
    };
    const ext = () => setOpen(true);
    window.addEventListener('keydown', key); window.addEventListener('open-palette', ext);
    return () => { window.removeEventListener('keydown', key); window.removeEventListener('open-palette', ext); };
  }, [open]);
  useEffect(() => { if (open) { setQ(''); setI(0); setTimeout(() => input.current?.focus(), 10); } }, [open]);
  useEffect(() => { setI(0); }, [q]);

  const go = (x?: Item) => { if (!x) return; setOpen(false); router.push(x.href); };
  if (!open) return null;
  let last = '';
  return (
    <div className="cmdk-scrim" onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
      <div className="cmdk" role="dialog" aria-modal="true" aria-label="Search the site">
        <div className="cmdk-input">
          <IconSearch size={18} />
          <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Jump to a page, feature or action" aria-controls="cmdk-list" aria-activedescendant={list[i] ? `cmdk-${i}` : undefined}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setI((x) => Math.min(list.length - 1, x + 1)); }
              else if (e.key === 'ArrowUp') { e.preventDefault(); setI((x) => Math.max(0, x - 1)); }
              else if (e.key === 'Enter') { e.preventDefault(); go(list[i]); }
              else if (e.key === 'Escape') setOpen(false);
            }} />
          <kbd>Esc</kbd>
        </div>
        <ul className="cmdk-list" id="cmdk-list" role="listbox">
          {list.length === 0 && <li className="cmdk-empty">No match for “{q}”. Try “security” or “demo”.</li>}
          {list.map((x, j) => {
            const head = x.group !== last ? x.group : null; last = x.group;
            return (
              <li key={x.href + x.label} role="presentation">
                {head && <div className="cmdk-group">{head}</div>}
                <button id={`cmdk-${j}`} role="option" aria-selected={j === i} className="cmdk-item" onMouseMove={() => setI(j)} onClick={() => go(x)}>
                  <span><strong>{x.label}</strong><span className="cmdk-hint">{x.hint}</span></span>
                  <IconArrow size={16} />
                </button>
              </li>
            );
          })}
        </ul>
        <div className="cmdk-foot"><span><kbd>↑</kbd><kbd>↓</kbd> to move</span><span><kbd>Enter</kbd> to open</span></div>
      </div>
    </div>
  );
}
