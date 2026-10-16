'use client';
import { useEffect, useRef, useState } from 'react';
import { INTEGRATIONS } from '@/lib/content';
import { ToolIcon, toolHue } from './ToolIcon';

type Src = { n: number; slug: string; where: string; who: string; when: string; quote: string };
type Claim = { text: string; refs: number[] };
type Q = { id: string; ask: string; srcs: Src[]; answer: Claim[]; lineage?: string; excluded?: { where: string; why: string }; none?: string };

const SOURCES = ['slack', 'gmail', 'microsoft-teams', 'notion', 'jira', 'github'];
const QS: Q[] = [
  {
    id: 'launch', ask: 'Why did the launch move?',
    srcs: [
      { n: 1, slug: 'slack', where: '#launch-planning', who: 'Priya Shah', when: 'Jun 12', quote: 'Moving launch two weeks to July 29 so SSO ships with it. I’ll own the new date.' },
      { n: 2, slug: 'notion', where: 'Q3 Roadmap', who: 'Launch team', when: 'Jun 13', quote: 'Security review must close before GA. SSO is in scope for the Q3 release.' },
      { n: 3, slug: 'jira', where: 'LOC-412', who: 'Priya Shah', when: 'Oct 13', quote: 'I’ll have the SSO rollout plan in this ticket by Oct 20.' },
    ],
    answer: [
      { text: 'It moved to July 29 so SSO could ship with it.', refs: [1, 2] },
      { text: 'Priya Shah owns the date.', refs: [1, 3] },
    ],
    lineage: 'July 15 plan',
  },
  {
    id: 'pricing', ask: 'How many free-tier seats?',
    srcs: [
      { n: 1, slug: 'slack', where: '#pricing', who: 'Rosa Diaz', when: 'Mon', quote: 'We’re capping the free tier at 20 seats, effective next billing cycle.' },
      { n: 2, slug: 'microsoft-teams', where: 'Growth › Pricing', who: 'Sam Lee', when: 'Mon', quote: 'Billing will enforce the 20-seat cap from the next cycle.' },
    ],
    answer: [
      { text: '20 seats, from the next billing cycle.', refs: [1, 2] },
    ],
    lineage: 'Unlimited seats',
    excluded: { where: 'help.acme.com/pricing', why: 'Still says “unlimited seats”, but a newer decision replaced it, so Locus AI ignores it.' },
  },
  {
    id: 'salary', ask: '2027 salary bands?',
    srcs: [], answer: [],
    none: 'Nothing you have access to answers this, so Locus AI doesn’t guess.',
  },
];

// Geometry (viewBox 1000 x 400)
const SX = 150, PX = 520, PY = 200, OUT = 980;
const sy = (i: number) => 60 + i * 56;

export default function Prism() {
  const [qi, setQi] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'retrieve' | 'ground' | 'done'>('idle');
  const [hot, setHot] = useState<number | null>(null);
  const [claimsShown, setClaimsShown] = useState(0);
  const started = useRef(false);
  const box = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const q = QS[qi];

  const run = (i: number) => {
    timers.current.forEach(clearTimeout); timers.current = [];
    setQi(i); setHot(null); setClaimsShown(0);
    const fast = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (fast) { setPhase('done'); setClaimsShown(QS[i].answer.length); return; }
    setPhase('retrieve');
    timers.current.push(window.setTimeout(() => setPhase('ground'), 1100));
    QS[i].answer.forEach((_, k) => timers.current.push(window.setTimeout(() => setClaimsShown(k + 1), 1300 + k * 450)));
    timers.current.push(window.setTimeout(() => setPhase('done'), 1400 + QS[i].answer.length * 450));
  };
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !started.current) { started.current = true; run(0); io.disconnect(); } }, { threshold: 0.35 });
    if (box.current) io.observe(box.current);
    return () => io.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const usedSlugs = q.srcs.map((s) => s.slug);
  const lit = (slug: string) => phase !== 'idle' && usedSlugs.includes(slug);
  const hotSlug = hot ? q.srcs.find((s) => s.n === hot)?.slug : null;
  const name = (slug: string) => slug === 'microsoft-teams' ? 'Teams' : INTEGRATIONS.find((x) => x.slug === slug)?.name;
  const grounded = q.answer.filter((c) => c.refs.length > 0).length;

  return (
    <div className="prism" ref={box}>
      <div className="prism-asks" role="tablist" aria-label="Try a question">
        {QS.map((x, i) => <button key={x.id} role="tab" aria-selected={i === qi} onClick={() => run(i)}>{x.ask}</button>)}
      </div>
      <div className="prism-grid">
        <div className="prism-left">
        <div className="prism-stage">
          <svg viewBox="0 0 1000 400" className="prism-svg" aria-hidden="true">
            <defs>
              <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFFFFF" stopOpacity=".95" /><stop offset=".55" stopColor="#E9E5FF" stopOpacity=".9" /><stop offset="1" stopColor="#B9AEFF" stopOpacity=".85" /></linearGradient>
              <linearGradient id="outbeam" gradientUnits="userSpaceOnUse" x1="572" y1="0" x2="940" y2="0"><stop offset="0" stopColor="#6D5AE6" /><stop offset="1" stopColor="#6D5AE6" stopOpacity=".15" /></linearGradient>
              <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10" /></filter>
            </defs>
            {SOURCES.map((s, i) => {
              const on = lit(s), isHot = hotSlug === s;
              return <path key={s} d={`M ${SX + 70} ${sy(i)} C ${SX + 230} ${sy(i)}, ${PX - 170} ${PY}, ${PX - 58} ${PY + (i - 2.5) * 6}`} className={`beam ${on ? 'on' : ''} ${isHot ? 'hot' : ''}`} style={{ ['--c' as any]: toolHue(s) }} />;
            })}
            <circle cx={PX} cy={PY} r="90" fill="#6D5AE6" opacity={phase === 'idle' ? 0.08 : 0.28} filter="url(#soft)" className="prism-glow" />
            <path d={`M ${PX + 52} ${PY} L ${OUT - 40} ${PY}`} className={`outbeam ${phase === 'done' || phase === 'ground' ? 'on' : ''} ${q.none ? 'none' : ''}`} />
            <g className={`tri ${phase === 'retrieve' || phase === 'ground' ? 'busy' : ''}`}>
              <polygon points={`${PX - 60},${PY + 52} ${PX + 60},${PY + 52} ${PX},${PY - 66}`} fill="url(#glass)" stroke="#8B7FFF" strokeWidth="2" strokeLinejoin="round" />
              <polygon points={`${PX - 60},${PY + 52} ${PX},${PY - 66} ${PX - 8},${PY + 52}`} fill="#fff" opacity=".35" />
              <path d={`M ${PX + 18} ${PY - 24} L ${PX + 46} ${PY + 40}`} stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".7" />
            </g>
          </svg>
          {SOURCES.map((s, i) => (
            <span key={s} className={`prism-src ${lit(s) ? 'on' : ''} ${hotSlug === s ? 'hot' : ''}`} style={{ top: `${(sy(i) / 400) * 100}%`, left: `${(SX / 1000) * 100}%`, ['--hue' as any]: toolHue(s) }}>
              <span className="ps-ic"><ToolIcon slug={s} size={14} /></span>{name(s)}
            </span>
          ))}
          <span className="prism-label" style={{ left: `${(PX / 1000) * 100}%`, top: `${((PY + 78) / 400) * 100}%` }}>Locus AI</span>
          <span className="prism-phase" style={{ left: `${(PX / 1000) * 100}%`, top: `${((PY - 100) / 400) * 100}%` }}>{phase === 'retrieve' ? 'Retrieving sources you can access…' : phase === 'ground' ? 'Checking every claim…' : phase === 'done' ? (q.none ? 'Nothing to cite' : `${q.srcs.length} sources · ${grounded} claims checked`) : ' '}</span>
        </div>

          <p className="prism-key">
            <span className={phase === 'retrieve' ? 'on' : ''}>Retrieve what you can see</span><i>→</i>
            <span className={phase === 'ground' ? 'on' : ''}>Check each claim</span><i>→</i>
            <span className={phase === 'done' ? 'on' : ''}>Cite or decline</span>
          </p>
        </div>
        <div className="prism-out" aria-live="polite" key={q.id}>
          {q.none ? (
            <p className={`po-a none ${phase === 'done' ? 'in' : ''}`}>{phase === 'done' ? q.none : <span className="po-wait">Searching…</span>}</p>
          ) : (
            <p className="po-a">
              {q.answer.map((c, k) => (
                <span key={k} className={`claim ${k < claimsShown ? 'in' : ''}`}>
                  {c.text}{' '}
                  {c.refs.map((r) => <button key={r} className={`cite ${hot === r ? 'hot' : ''}`} onMouseEnter={() => setHot(r)} onFocus={() => setHot(r)} onClick={() => setHot(r)} aria-label={`Source ${r}`}>{r}</button>)}{' '}
                </span>
              ))}
              {claimsShown === 0 && <span className="po-wait">Thinking…</span>}
            </p>
          )}

          <div className={`po-badges ${phase === 'done' ? 'in' : ''}`}>
            {q.none
              ? <span className="po-badge neutral">No sources · no answer</span>
              : <span className="po-badge ok">✓ {grounded} of {q.answer.length} {q.answer.length === 1 ? "claim" : "claims"} cited</span>}
            {q.lineage && <span className="po-badge">Replaces: <s>{q.lineage}</s></span>}
          </div>

          {q.srcs.length > 0 && (
            <div className={`po-srcs ${phase === 'idle' ? '' : 'in'}`}>
              <div className="po-chips">
                {q.srcs.map((s) => (
                  <button key={s.n} className={`po-chip ${hot === s.n ? 'hot' : ''}`} style={{ ['--hue' as any]: toolHue(s.slug) }} onMouseEnter={() => setHot(s.n)} onFocus={() => setHot(s.n)} onClick={() => setHot(s.n)}>
                    <span className="po-n">{s.n}</span><ToolIcon slug={s.slug} size={12} />{name(s.slug)}
                  </button>
                ))}
                {q.excluded && (
                  <button className={`po-chip skip ${hot === -1 ? 'hot' : ''}`} onMouseEnter={() => setHot(-1)} onFocus={() => setHot(-1)} onClick={() => setHot(-1)}>Ignored 1 stale page</button>
                )}
              </div>
              {(() => {
                if (hot === -1 && q.excluded) return <div className="po-quote skip" key="x"><span className="po-qm">{q.excluded.where}</span>{q.excluded.why}</div>;
                const src = q.srcs.find((x) => x.n === hot);
                return src
                  ? <div className="po-quote" key={src.n} style={{ ['--hue' as any]: toolHue(src.slug) }}><span className="po-qm">{name(src.slug)} · {src.where} · {src.who}, {src.when}</span>“{src.quote}”</div>
                  : <div className="po-quote hint">Point at a source or a number to see the original message.</div>;
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
