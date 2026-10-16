'use client';
import { useState } from 'react';
import { TRUST_CONTROLS, type TrustStatus } from '@/lib/content';

const ORDER: (TrustStatus | 'All')[] = ['All', 'In place', 'In progress', 'Planned'];

export default function TrustCenter() {
  const [f, setF] = useState<TrustStatus | 'All'>('All');
  const all = TRUST_CONTROLS.flatMap((a) => a.items);
  const count = (s: TrustStatus | 'All') => (s === 'All' ? all.length : all.filter((i) => i.status === s).length);
  return (
    <div className="tc">
      <div className="tc-filter" role="group" aria-label="Filter by status">
        {ORDER.filter((s) => s === 'All' || count(s) > 0).map((s) => (
          <button key={s} aria-pressed={f === s} onClick={() => setF(s)} className={`tc-chip ${s.replace(' ', '-').toLowerCase()}`}>
            {s} <span>{count(s)}</span>
          </button>
        ))}
      </div>
      <div className="tc-grid">
        {TRUST_CONTROLS.map((a) => {
          const items = a.items.filter((i) => f === 'All' || i.status === f);
          if (!items.length) return null;
          return (
            <div key={a.area} className="tc-area">
              <h3 className="tc-area-h">{a.area}</h3>
              <ul>
                {items.map((i) => (
                  <li key={i.name} className="tc-row">
                    <span className={`tc-dot ${i.status.replace(' ', '-').toLowerCase()}`} aria-hidden="true" />
                    <div className="tc-main"><strong>{i.name}</strong>{i.note && <span>{i.note}</span>}</div>
                    <span className={`tc-st ${i.status.replace(' ', '-').toLowerCase()}`}>{i.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
