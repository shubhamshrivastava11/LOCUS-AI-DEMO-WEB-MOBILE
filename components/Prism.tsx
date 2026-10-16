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
    id: 'launch', ask: 'Why did the Q3 launch move to July 29?',
    srcs: [
      { n: 1, slug: 'slack', where: '#launch-planning', who: 'Priya Shah', when: 'Jun 12', quote: 'Moving launch two weeks to July 29 so SSO ships with it. I’ll own the new date.' },
      { n: 2, slug: 'notion', where: 'Q3 Roadmap', who: 'Launch team', when: 'Jun 13', quote: 'Security review must close before GA. SSO is in scope for the Q3 release.' },
      { n: 3, slug: 'jira', where: 'LOC-412', who: 'Priya Shah', when: 'Oct 13', quote: 'I’ll have the SSO rollout plan in this ticket by Oct 20.' },
    ],
    answer: [
      { text: 'The launch moved from July 15 to July 29', refs: [1] },
      { text: 'so the security review could finish and SSO could ship in the same release.', refs: [1, 2] },
      { text: 'Priya Shah owns the new date, and the SSO rollout plan is due Oct 20.', refs: [1, 3] },
    ],
    lineage: 'Replaces “Launch on July 15” (May 28)',
  },
  {
    id: 'pricing', ask: 'How many seats does the free tier include?',
    srcs: [
      { n: 1, slug: 'slack', where: '#pricing', who: 'Rosa Diaz', when: 'Mon 10:14', quote: 'We’re capping the free tier at 20 seats, effective next billing cycle.' },
      { n: 2, slug: 'microsoft-teams', where: 'Growth › Pricing', who: 'Sam Lee', when: 'Mon 11:02', quote: 'Billing will enforce the 20-seat cap from the next cycle. Existing workspaces get a notice.' },
    ],
    answer: [
      { text: 'The free tier is capped at 20 seats,', refs: [1] },
      { text: 'starting with the next billing cycle,', refs: [1, 2] },
      { text: 'and existing workspaces get a notice before it applies.', refs: [2] },
    ],
    lineage: 'Replaces “Free tier: unlimited seats” (Aug 30)',
    excluded: { where: 'help.acme.com/pricing', why: 'Says “unlimited seats”. Left out because a newer decision replaces it.' },
  },
  {
    id: 'salary', ask: 'What are the salary bands for 2027?',
    srcs: [], answer: [],
    none: 'There’s no decision on this that you can access, so Locus AI won’t guess. If one exists, it may be Confidential and need a grant.',
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

          <ol className="prism-steps">
            <li className={phase === 'retrieve' ? 'on' : phase !== 'idle' ? 'done' : ''}><b>1</b><span><strong>Retrieve</strong> only sources this person may see</span></li>
            <li className={phase === 'ground' ? 'on' : phase === 'done' ? 'done' : ''}><b>2</b><span><strong>Check</strong> every claim against those sources</span></li>
            <li className={phase === 'done' ? 'on' : ''}><b>3</b><span><strong>Cite</strong> each claim, or decline to answer</span></li>
          </ol>
        </div>
        <div className="prism-out" aria-live="polite" key={q.id}>
          <span className="po-k">Question</span>
          <p className="po-q">{q.ask}</p>
          <span className="po-k">Answer</span>
          {q.none ? (
            <div className={`po-none ${phase === 'done' ? 'in' : ''}`}>{phase === 'done' ? q.none : <span className="po-wait">Searching…</span>}</div>
          ) : (
            <p className="po-a">
              {q.answer.map((c, k) => (
                <span key={k} className={`claim ${k < claimsShown ? 'in' : ''}`}>
                  {c.text}{' '}
                  {c.refs.map((r) => <button key={r} className={`cite ${hot === r ? 'hot' : ''}`} onMouseEnter={() => setHot(r)} onMouseLeave={() => setHot(null)} onFocus={() => setHot(r)} onBlur={() => setHot(null)} aria-label={`Source ${r}`}>{r}</button>)}{' '}
                </span>
              ))}
              {claimsShown === 0 && <span className="po-wait">Retrieving…</span>}
            </p>
          )}
          <div className="po-ground">
            <div className="row between"><span className="po-k" style={{ margin: 0 }}>Groundedness</span><span className={`po-score ${q.none ? 'na' : ''}`}>{q.none ? 'No claims made' : `${Math.min(claimsShown, grounded)} of ${q.answer.length} claims backed by a source`}</span></div>
            {!q.none && <div className="po-bar"><span style={{ width: `${(Math.min(claimsShown, grounded) / q.answer.length) * 100}%` }} /></div>}
            {q.lineage && phase === 'done' && <div className="po-line"><span className="tag tag-superseded">Lineage</span>{q.lineage}</div>}
            {q.excluded && phase === 'done' && <div className="po-excl"><b>Excluded:</b> {q.excluded.where}. {q.excluded.why}</div>}
          </div>
          {q.srcs.length > 0 && (
            <div className="po-prov">
              <span className="po-k">Provenance</span>
              {q.srcs.map((s, k) => (
                <div key={s.n} className={`prov-row ${hot === s.n ? 'hot' : ''} ${phase === 'idle' || (phase === 'retrieve' && k > 0) ? '' : 'in'}`} onMouseEnter={() => setHot(s.n)} onMouseLeave={() => setHot(null)} style={{ ['--hue' as any]: toolHue(s.slug), transitionDelay: `${k * 120}ms` }}>
                  <span className="prov-n">{s.n}</span>
                  <div style={{ minWidth: 0 }}>
                    <div className="prov-meta"><ToolIcon slug={s.slug} size={12} /> {name(s.slug)} · {s.where} · {s.who} · {s.when}</div>
                    <div className="prov-quote">“{s.quote}”</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
