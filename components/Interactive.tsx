'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { FAQS, PILLARS } from '@/lib/content';

export function Reveal({ children, className = '', as: Tag = 'div', delay = 0 }: { children: ReactNode; className?: string; as?: any; delay?: number }) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) { setShown(true); return; }
    let done = false;
    const show = () => { if (done) return; done = true; setShown(true); io.disconnect(); window.removeEventListener('scroll', check); window.removeEventListener('resize', check); };
    const io = new IntersectionObserver((entries) => { if (entries.some((e) => e.isIntersecting)) show(); }, { rootMargin: '0px 0px -10% 0px' });
    // Failsafe: anything already at or above the bottom of the viewport is shown, even if the observer missed it.
    let raf = 0;
    const check = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { if (el.getBoundingClientRect().top < window.innerHeight * 0.95) show(); }); };
    io.observe(el);
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    check();
    return () => { done = true; io.disconnect(); cancelAnimationFrame(raf); window.removeEventListener('scroll', check); window.removeEventListener('resize', check); };
  }, []);
  return <Tag ref={ref} className={`reveal ${shown ? 'in' : ''} ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>{children}</Tag>;
}

export function Faq({ items = FAQS }: { items?: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="faq">
      {items.map((f, i) => (
        <div className="faq-item" key={f.q}>
          <h3 style={{ margin: 0 }}>
            <button className="faq-q" aria-expanded={open === i} aria-controls={`faq-${i}`} id={`faq-q-${i}`} onClick={() => setOpen(open === i ? null : i)}>
              <span>{f.q}</span><span aria-hidden="true">+</span>
            </button>
          </h3>
          <div id={`faq-${i}`} role="region" aria-labelledby={`faq-q-${i}`} className={`faq-a ${open === i ? 'open' : ''}`}>
            <div><p>{f.a}</p></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PillarVisual({ k }: { k: string }) {
  if (k === 'search') return (
    <div className="stack gap-12">
      <div className="card" style={{ padding: '14px 16px', fontWeight: 500 }}>Who owns the pricing page rewrite?</div>
      {[
        ['Marketing owns copy, Design owns layout', 'decision', 'Decision', 'Slack · #growth · Sep 18', 'internal'],
        ['Ship rewrite after annual plan launch', 'action', 'Action', 'Notion · Growth Q4 plan · Sep 20', 'internal'],
        ['Design owns the full rewrite', 'superseded', 'Superseded', 'Gmail · Sep 02', 'restricted'],
      ].map(([t, c, l, s, cl]) => (
        <div className="card stack gap-8" key={t} style={{ padding: '14px 16px' }}>
          <div className="row between gap-12"><strong style={{ fontSize: 15, textDecoration: c === 'superseded' ? 'line-through' : 'none', color: c === 'superseded' ? 'var(--text-2)' : 'inherit' }}>{t}</strong><span className={`tag tag-${c}`}>{l}</span></div>
          <div className="row gap-8"><span className={`cls cls-${cl}`}>{cl[0].toUpperCase() + cl.slice(1)}</span><span className="caption">{s}</span></div>
        </div>
      ))}
    </div>
  );
  if (k === 'explorer') return (
    <div className="table-wrap"><table className="table"><thead><tr><th>Type</th><th>Summary</th><th>Class</th></tr></thead><tbody>
      {[['decision', 'Decision', 'Adopt Postgres + pgvector', 'internal'], ['blocker', 'Blocker', 'Legal review of EU DPA', 'confidential'], ['action', 'Action', 'Draft SSO rollout plan', 'internal'], ['decision', 'Decision', 'Cap free tier at 20 seats', 'restricted']].map(([c, l, t, cl]) => (
        <tr key={t}><td><span className={`tag tag-${c}`}>{l}</span></td><td style={{ fontWeight: 600 }}>{t}</td><td><span className={`cls cls-${cl}`}>{cl[0].toUpperCase() + cl.slice(1)}</span></td></tr>
      ))}
    </tbody></table></div>
  );
  if (k === 'pulse') return (
    <div className="stack gap-12">
      <div className="grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
        {[['Decisions', '24'], ['Open actions', '11'], ['Blockers', '3']].map(([a, b]) => <div className="card" key={a} style={{ padding: 16 }}><div className="caption">{a}</div><div className="h2" style={{ color: a === 'Blockers' ? 'var(--warning)' : undefined }}>{b}</div></div>)}
      </div>
      <div className="card stack gap-12" style={{ padding: 16 }}>
        <div className="overline" style={{ color: 'var(--text-3)' }}>Decisions by team</div>
        {[['Platform', 90], ['Launch', 66], ['Growth', 55], ['Legal', 22]].map(([a, w]) => (
          <div className="row gap-12" key={a as string}><span className="small" style={{ width: 80 }}>{a}</span><span style={{ flex: 1, height: 10, background: 'var(--bg-subtle)', borderRadius: 5 }}><span style={{ display: 'block', width: `${w}%`, height: 10, background: 'var(--brand)', borderRadius: 5 }} /></span></div>
        ))}
      </div>
    </div>
  );
  return (
    <div className="code" aria-label="MCP tools">
      <span className="c">{'// tools exposed by the Locus AI MCP server'}</span>{'\n'}
      <span className="k">search_decisions</span>(query, team?, since?){'\n'}
      <span className="k">get_decision_context</span>(decision_id){'\n'}
      <span className="k">log_decision</span>(summary, owner, source)
    </div>
  );
}

export function ProductTabs() {
  const [active, setActive] = useState(PILLARS[0].key);
  const p = PILLARS.find((x) => x.key === active)!;
  return (
    <div className="stack gap-24">
      <div className="tabs" role="tablist" aria-label="Locus AI products">
        {PILLARS.map((x) => (
          <button key={x.key} role="tab" id={`tab-${x.key}`} aria-controls={`panel-${x.key}`} aria-selected={x.key === active} className="tab" onClick={() => setActive(x.key)}>{x.name}</button>
        ))}
      </div>
      <div role="tabpanel" id={`panel-${p.key}`} aria-labelledby={`tab-${p.key}`} key={p.key} className="card card-lg panel-in" style={{ padding: 0, overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
        <div className="grid g2" style={{ gap: 0 }}>
          <div className="stack gap-16" style={{ padding: 40 }}>
            <p className="overline" style={{ color: 'var(--text-3)' }}>{p.name}</p>
            <h3 className="h2">{p.title}</h3>
            <p className="body">{p.body}</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
              {p.bullets.map((b) => <li key={b} className="row gap-8" style={{ fontFamily: p.key === 'mcp' ? 'var(--mono)' : undefined, fontSize: 15 }}><span style={{ color: 'var(--brand)', fontWeight: 700 }}>✓</span>{b}</li>)}
            </ul>
          </div>
          <div style={{ padding: 32, background: 'var(--bg-page)', borderLeft: '1px solid var(--border)' }}><PillarVisual k={p.key} /></div>
        </div>
      </div>
    </div>
  );
}
