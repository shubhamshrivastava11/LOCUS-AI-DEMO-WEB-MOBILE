'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { asset } from '@/lib/base';
import { INTEGRATIONS, LOOM } from '@/lib/content';
import { Cls, Tag } from './Sections';
import { IconAgent, IconUser } from './Icons';
import { ToolIcon, toolHue } from './ToolIcon';

// Geometry in SVG units. Phones get a taller canvas so the six sources have room.
type Geo = { W: number; H: number; SRC_X: number; CORE: { x: number; y: number }; OUT_X: number; gap: number; top: number; outs: number[] };
const WIDE: Geo = { W: 1000, H: 460, SRC_X: 176, CORE: { x: 520, y: 230 }, OUT_X: 840, gap: 70, top: 55, outs: [150, 310] };
const TALL: Geo = { W: 1000, H: 1250, SRC_X: 190, CORE: { x: 450, y: 625 }, OUT_X: 640, gap: 190, top: 150, outs: [430, 820] };
const OUTS = [{ key: 'people', label: 'People', sub: 'Answer with sources' }, { key: 'agents', label: 'Agents', sub: 'Context over MCP' }];
const srcY = (g: Geo, i: number) => g.top + i * g.gap;
const pathIn = (g: Geo, i: number) => `M ${g.SRC_X} ${srcY(g, i)} C ${g.SRC_X + 190} ${srcY(g, i)}, ${g.CORE.x - 200} ${g.CORE.y}, ${g.CORE.x - 46} ${g.CORE.y}`;
const pathOut = (g: Geo, y: number) => `M ${g.CORE.x + 46} ${g.CORE.y} C ${g.CORE.x + 160} ${g.CORE.y}, ${g.OUT_X - 170} ${y}, ${g.OUT_X - 30} ${y}`;

const IN_MS = 950, OUT_MS = 850, CYCLE_MS = 3800;
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

function SourceIcon({ slug }: { slug: string }) {
  return <ToolIcon slug={slug} size={18} />;
}

export default function MemoryLoom({ logos }: { logos: Record<string, string | null> }) {
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState<'in' | 'core' | 'out' | 'rest'>('in');
  const [g, setG] = useState<Geo>(WIDE);
  useEffect(() => { const mq = matchMedia('(max-width: 760px)'); const on = () => setG(mq.matches ? TALL : WIDE); on(); mq.addEventListener('change', on); return () => mq.removeEventListener('change', on); }, []);
  const { W, H, SRC_X, CORE, OUT_X } = g;
  const inRefs = useRef<(SVGPathElement | null)[]>([]);
  const outRefs = useRef<(SVGPathElement | null)[]>([]);
  const dotIn = useRef<SVGCircleElement>(null);
  const dotOut = useRef<(SVGCircleElement | null)[]>([]);
  const wrap = useRef<HTMLDivElement>(null);
  const state = useRef({ start: 0, idx: 0, pauseUntil: 0, visible: false, reduced: false });

  const jump = useCallback((i: number, manual = false) => {
    state.current.idx = i;
    state.current.start = performance.now();
    if (manual) state.current.pauseUntil = performance.now() + 9000;
    setActive(i); setPhase('in');
  }, []);

  useEffect(() => {
    const s = state.current;
    s.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    s.start = performance.now();
    const io = new IntersectionObserver(([e]) => { s.visible = e.isIntersecting; }, { threshold: 0.15 });
    if (wrap.current) io.observe(wrap.current);
    let raf = 0; let last = '';
    const place = (c: SVGCircleElement | null, p: SVGPathElement | null, k: number) => {
      if (!c || !p) return;
      const L = p.getTotalLength(); const pt = p.getPointAtLength(L * ease(Math.min(1, Math.max(0, k))));
      c.setAttribute('cx', String(pt.x)); c.setAttribute('cy', String(pt.y));
      c.style.opacity = k <= 0 || k >= 1 ? '0' : '1';
    };
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!s.visible) { s.start = now - Math.min(now - s.start, CYCLE_MS - 1); return; }
      let t = now - s.start;
      if (t > CYCLE_MS) {
        const next = now < s.pauseUntil ? s.idx : (s.idx + 1) % LOOM.length;
        if (now >= s.pauseUntil) { s.idx = next; setActive(next); }
        s.start = now; t = 0;
      }
      if (s.reduced) { const ph = t < IN_MS ? 'in' : 'rest'; if (ph !== last) { last = ph; setPhase(ph as any); } return; }
      const ph = t < IN_MS ? 'in' : t < IN_MS + 120 ? 'core' : t < IN_MS + 120 + OUT_MS ? 'out' : 'rest';
      if (ph !== last) { last = ph; setPhase(ph); }
      place(dotIn.current, inRefs.current[s.idx], t / IN_MS);
      OUTS.forEach((_, j) => place(dotOut.current[j], outRefs.current[j], (t - IN_MS - 120) / OUT_MS));
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, []);

  const ex = LOOM[active];
  const name = (slug: string) => INTEGRATIONS.find((x) => x.slug === slug)?.name ?? slug;
  const remembered = phase !== 'in';

  return (
    <div className="loom" ref={wrap}>
      <div className="loom-stage" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="loom-svg" aria-hidden="true">
          <defs>
            <radialGradient id="coreGlow"><stop offset="0%" stopColor="#8B7FFF" stopOpacity=".55" /><stop offset="100%" stopColor="#8B7FFF" stopOpacity="0" /></radialGradient>
            <filter id="dotBlur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" /></filter>
          </defs>
          {LOOM.map((l, i) => (
            <path key={l.slug} ref={(el) => { inRefs.current[i] = el; }} d={pathIn(g, i)} className={`loom-wire ${i === active ? 'hot' : ''}`} />
          ))}
          {OUTS.map((o, j) => <path key={o.key} ref={(el) => { outRefs.current[j] = el; }} d={pathOut(g, g.outs[j])} className={`loom-wire out ${phase === 'out' || phase === 'rest' ? 'hot' : ''}`} />)}
          <circle cx={CORE.x} cy={CORE.y} r="120" fill="url(#coreGlow)" style={{ transformOrigin: `${CORE.x}px ${CORE.y}px` }} className={`loom-glow ${phase === 'core' || phase === 'out' ? 'burst' : ''}`} />
          <circle cx={CORE.x} cy={CORE.y} r="62" style={{ transformOrigin: `${CORE.x}px ${CORE.y}px` }} className="loom-ring r1" />
          <circle cx={CORE.x} cy={CORE.y} r="84" style={{ transformOrigin: `${CORE.x}px ${CORE.y}px` }} className="loom-ring r2" />
          <g>
            <circle ref={dotIn} r="9" className="loom-dot halo" filter="url(#dotBlur)" />
          </g>
          {OUTS.map((o, j) => <circle key={o.key} ref={(el) => { dotOut.current[j] = el; }} r="6" className="loom-dot" />)}
        </svg>

        {LOOM.map((l, i) => (
          <button key={l.slug} type="button" className={`loom-src ${i === active ? 'on' : ''}`} style={{ left: `${(SRC_X / W) * 100}%`, top: `${(srcY(g, i) / H) * 100}%` }} onClick={() => jump(i, true)} onMouseEnter={() => jump(i, true)} aria-label={`Show a decision captured from ${name(l.slug)}`}>
            <span className="loom-mark tool" style={{ ['--hue' as any]: toolHue(l.slug) }}>{logos[l.slug] ? <img src={asset(logos[l.slug]!)} alt="" width={20} height={20} /> : <SourceIcon slug={l.slug} />}</span>
            <span className="loom-src-name">{name(l.slug)}</span>
          </button>
        ))}

        <div className={`loom-core ${phase === 'core' || phase === 'out' ? 'burst' : ''}`} style={{ left: `${(CORE.x / W) * 100}%`, top: `${(CORE.y / H) * 100}%` }}>
          <img src={asset('/mark.svg')} alt="" width={44} height={44} />
        </div>

        {OUTS.map((o, j) => (
          <div key={o.key} className={`loom-out ${phase === 'rest' ? 'on' : ''}`} style={{ left: `${((OUT_X - 34) / W) * 100}%`, top: `${(g.outs[j] / H) * 100}%` }}>
            <span className="loom-mark">{o.key === 'people' ? <IconUser size={18} /> : <IconAgent size={18} />}</span>
            <span><strong>{o.label}</strong><span className="loom-out-sub">{o.sub}</span></span>
          </div>
        ))}
      </div>

      <div className="loom-readout" aria-live="polite">
        <div className="loom-said" key={`s-${active}`}>
          <span className="loom-k">Heard in {ex.where}</span>
          <p>“{ex.said}”</p>
        </div>
        <div className={`loom-kept ${remembered ? 'on' : ''}`} key={`k-${active}`}>
          <span className="loom-k">Remembered as</span>
          <div className="row gap-8 wrap"><Tag t={ex.kind as any} /><strong>{ex.title}</strong></div>
          <div className="row gap-8 wrap" style={{ marginTop: 8 }}><Cls l={ex.cls} /><span className="caption">Owner: {ex.owner} · source linked</span></div>
        </div>
      </div>
    </div>
  );
}
