'use client';
import { useEffect, useRef, useState } from 'react';
import { IconAgent, IconHash } from './Icons';

type Mode = 'without' | 'with';
const STEP_MS = 4200;
const STEPS: Record<Mode, { label: string; caption: string }[]> = {
  without: [
    { label: 'Decided', caption: 'Monday: the Growth lead caps the free tier at 20 seats in Slack.' },
    { label: 'Forgotten', caption: 'Nobody updates the help center. The old pricing stays published.' },
    { label: 'Agent asked', caption: 'Wednesday: a 45-person prospect asks the AI support agent about the free tier.' },
    { label: 'Wrong answer', caption: 'The agent reads the old page and promises 45 free seats. The deal is now at risk.' },
  ],
  with: [
    { label: 'Decided', caption: 'Monday: the Growth lead caps the free tier at 20 seats in Slack.' },
    { label: 'Captured', caption: 'Locus AI keeps it as a decision, with an owner and access level, and retires the old one.' },
    { label: 'Agent checks', caption: 'Before replying, the support agent asks Locus AI what was decided.' },
    { label: 'Right answer', caption: 'It answers with the current decision, and the deal moves forward.' },
  ],
};

export default function HeroStory() {
  const [mode, setMode] = useState<Mode>('without');
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(true);
  const [hover, setHover] = useState(false);
  const [tick, setTick] = useState(0);
  const [size, setSize] = useState(45);
  const visible = useRef(true);
  const box = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting; });
    if (box.current) io.observe(box.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!auto || hover) return;
    const t = window.setTimeout(() => {
      if (!visible.current || document.hidden) { setTick((x) => x + 1); return; }
      if (step < 3) setStep(step + 1);
      else { setMode(mode === 'without' ? 'with' : 'without'); setStep(0); }
    }, step === 3 ? STEP_MS + 1600 : STEP_MS);
    return () => clearTimeout(t);
  }, [step, mode, auto, hover, tick]);

  const choose = (m: Mode) => { setMode(m); setStep(0); setAuto(true); };
  const jump = (n: number) => { setStep(n); setAuto(false); };
  const go = (d: number) => {
    setAuto(false);
    const n = step + d;
    if (n > 3) { setMode(mode === 'without' ? 'with' : 'without'); setStep(0); }
    else if (n < 0) { setMode(mode === 'without' ? 'with' : 'without'); setStep(3); }
    else setStep(n);
  };
  const pickSize = (n: number) => { setSize(n); setAuto(false); };
  const fix = () => { setMode('with'); setStep(1); setAuto(true); };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    else if (e.key === ' ' && e.target === e.currentTarget) { e.preventDefault(); setAuto(!auto); }
  };
  const playing = auto && !hover;
  const onMove = (e: React.PointerEvent) => {
    const el = stage.current; if (!el || e.pointerType !== 'mouse' || reduced.current) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 5}deg`);
    el.style.setProperty('--rx', `${-((e.clientY - r.top) / r.height - 0.5) * 4}deg`);
  };
  const onLeave = () => { const el = stage.current; if (el) { el.style.setProperty('--ry', '0deg'); el.style.setProperty('--rx', '0deg'); } };
  const s = STEPS[mode];

  return (
    <div className="ledger-stage" ref={stage} onPointerMove={onMove} onPointerLeave={onLeave}>
      <div className={`story ${mode}`} ref={box} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onKeyDown={onKey} tabIndex={0} aria-label="Example: a pricing decision and an AI support agent">
        <div className="story-head">
          <div className="story-title"><span className="story-k">Example · B2B software company</span><strong>A pricing change meets an AI agent</strong></div>
          <div className="story-seg" role="tablist" aria-label="Compare">
            <button role="tab" aria-selected={mode === 'without'} onClick={() => choose('without')}>Without Locus AI</button>
            <button role="tab" aria-selected={mode === 'with'} onClick={() => choose('with')}>With Locus AI</button>
          </div>
        </div>
        <ol className="story-rail" aria-label="Steps">
          {s.map((x, n) => (
            <li key={x.label}>
              <button className={`${n === step ? 'on' : ''} ${n < step ? 'done' : ''}`} onClick={() => jump(n)} aria-current={n === step ? 'step' : undefined}>
                <span className="rail-fill" aria-hidden="true">{n === step && auto && !hover && <span key={`${mode}-${step}`} style={{ animationDuration: `${step === 3 ? STEP_MS + 1600 : STEP_MS}ms` }} />}{n < step && <span className="full" />}</span>
                <span className="rail-label">{n + 1}. {x.label}</span>
              </button>
            </li>
          ))}
        </ol>
        <div className="story-body" key={`${mode}-${step}`} aria-live="polite">
          {step === 0 && <SceneSlack extract={mode === 'with'} />}
          {step === 1 && (mode === 'with' ? <SceneCaptured /> : <SceneForgotten />)}
          {step === 2 && <SceneAsk checking={mode === 'with'} size={size} onSize={pickSize} />}
          {step === 3 && <SceneAnswer good={mode === 'with'} size={size} onSize={pickSize} onFix={fix} onReplay={() => choose('without')} />}
        </div>
        <div className="story-foot">
          <p className="story-caption" key={`c-${mode}-${step}-${size}`}>{mode === 'without' && step === 3 && size <= 20 ? 'The agent reads the old page. This time the number happens to work. The reasoning doesn’t.' : s[step].caption.replace('45', String(size))}</p>
          <div className="story-ctl" role="group" aria-label="Playback">
            <button onClick={() => go(-1)} aria-label="Previous step"><svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
            <button onClick={() => setAuto(!auto)} aria-label={auto ? 'Pause' : 'Play'} className="play">{auto ? <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3v10M11 3v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg> : <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3l8 5-8 5z" fill="currentColor" /></svg>}</button>
            <button onClick={() => go(1)} aria-label="Next step"><svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
            <span className="story-hint">{playing ? 'Sample data' : hover && auto ? 'Paused' : 'Use ← → keys'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const FIELDS = [
  { k: 'what', label: 'Decision', val: 'Cap the free tier' },
  { k: 'limit', label: 'Limit', val: '20 seats' },
  { k: 'when', label: 'Effective', val: 'Next billing cycle' },
  { k: 'owner', label: 'Owner', val: 'Rosa Diaz, Growth' },
];
function SceneSlack({ extract }: { extract: boolean }) {
  const [hot, setHot] = useState<string | null>(null);
  const M = ({ k, children }: { k: string; children: React.ReactNode }) => extract
    ? <mark className={`sc-x x-${k} ${hot === k ? 'hot' : ''}`} onMouseEnter={() => setHot(k)} onMouseLeave={() => setHot(null)}>{children}</mark>
    : <>{children}</>;
  return (
    <div className="sc">
      <div className="sc-win in1">
        <div className="sc-bar"><IconHash size={14} /><strong>pricing</strong><span>Slack</span></div>
        <div className="sc-msg">
          <span className={`sc-av ${extract ? 'sc-x-av' : ''} ${hot === 'owner' ? 'hot' : ''}`} onMouseEnter={() => extract && setHot('owner')} onMouseLeave={() => setHot(null)}>RD</span>
          <div><div className="sc-who"><b>Rosa Diaz</b><span>Growth lead · Mon 10:14</span></div>
            <p className="in2">We’re <M k="what">capping the free tier</M> at <M k="limit">20 seats</M>, <M k="when">effective next billing cycle</M>.</p>
            <span className="sc-react in3">+1 · 12</span></div>
        </div>
      </div>
      {extract ? (
        <div className="sc-fields in3" aria-label="What Locus AI extracts">
          <span className="sc-fields-k">Locus AI reads it as · hover to trace</span>
          <div className="sc-fields-grid">
            {FIELDS.map((f, i) => (
              <button key={f.k} className={`sc-field x-${f.k} ${hot === f.k ? 'hot' : ''}`} style={{ animationDelay: `${0.9 + i * 0.15}s` }} onMouseEnter={() => setHot(f.k)} onMouseLeave={() => setHot(null)} onFocus={() => setHot(f.k)} onBlur={() => setHot(null)}>
                <span>{f.label}</span><b>{f.val}</b>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="sc-note bad in3">12 people react. Nobody writes it down anywhere an agent can read.</div>
      )}
    </div>
  );
}

function SceneForgotten() {
  return (
    <div className="sc">
      <div className="sc-faded in1"><span className="sc-av sm">RD</span><span>“We’re capping the free tier at 20 seats…”</span><span className="sc-scroll">scrolled away</span></div>
      <div className="sc-page in2">
        <div className="sc-bar"><span className="sc-url">help.acme.com/pricing</span><span className="sc-pill warn">Last updated 4 months ago</span></div>
        <div className="sc-pagebody"><b>Free plan</b><p>Includes <mark>unlimited seats</mark> for every team.</p></div>
      </div>
      <div className="sc-note bad in3">No decision on record. The old answer is still the only one an agent can find.</div>
    </div>
  );
}

function SceneCaptured() {
  return (
    <div className="sc">
      <div className="sc-dec in1">
        <div className="sc-dec-top"><span className="sc-src"><IconHash size={13} /> Captured from #pricing</span><span>Mon 10:14</span></div>
        <div className="row gap-8 wrap"><span className="tag tag-decision">Decision</span><strong>Cap the free tier at 20 seats</strong></div>
        <div className="row gap-8 wrap sc-meta"><span>Owner: Rosa Diaz, Growth</span><span className="cls cls-restricted">Restricted</span></div>
      </div>
      <div className="sc-old in2">
        <span className="tag tag-superseded">Superseded</span><span className="sc-strike">Free tier: unlimited seats</span>
      </div>
      <div className="sc-note good in3">The old decision now points to the new one. Any person or agent asking gets the current answer.</div>
    </div>
  );
}

const SIZES = [12, 45, 120];
function SizePick({ size, onSize }: { size: number; onSize: (n: number) => void }) {
  return (
    <div className="sc-size" role="radiogroup" aria-label="Prospect team size">
      <span>Try a prospect with</span>
      {SIZES.map((n) => <button key={n} role="radio" aria-checked={size === n} onClick={() => onSize(n)}>{n} people</button>)}
    </div>
  );
}
function Question({ size }: { size: number }) {
  return <div className="sc-bub them in1" key={size}><span className="sc-whos">Northwind Systems · {size} people</span>Does your free tier cover our whole team of {size}?</div>;
}

function SceneAsk({ checking, size, onSize }: { checking: boolean; size: number; onSize: (n: number) => void }) {
  return (
    <div className="sc">
      <SizePick size={size} onSize={onSize} />
      <Question size={size} />
      {checking ? (
        <div className="sc-call in2">
          <div><span className="k">search_decisions</span>(<span className="s">&quot;free tier seats&quot;</span>)</div>
          <div className="sc-result in3"><span className="ok">✓</span> 1 active decision · replaces 1 · owner Rosa Diaz</div>
        </div>
      ) : (
        <div className="sc-call bad in2">
          <div><span className="k">search_help_center</span>(<span className="s">&quot;free tier seats&quot;</span>)</div>
          <div className="sc-result in3"><span className="x">!</span> help.acme.com/pricing · last updated 4 months ago</div>
        </div>
      )}
      <div className="sc-typing in3"><IconAgent size={14} /> support-agent is writing<span className="dots"><i /><i /><i /></span></div>
    </div>
  );
}

function SceneAnswer({ good, size, onSize, onFix, onReplay }: { good: boolean; size: number; onSize: (n: number) => void; onFix: () => void; onReplay: () => void }) {
  const fits = size <= 20;
  // Without Locus AI the agent quotes the stale page. It only happens to be harmless for small teams.
  const reply = good
    ? (fits ? `Yes. The free plan covers up to 20 seats, so all ${size} of you fit. The cap applies from the next billing cycle.` : `The free plan covers up to 20 seats. For ${size} people, the Team plan fits, and I can set up a trial today.`)
    : `Yes. The free plan includes unlimited seats, so all ${size} of you can join at no cost.`;
  return (
    <div className="sc">
      <SizePick size={size} onSize={onSize} />
      <Question size={size} />
      <div className={`sc-bub us ${good ? 'good' : fits ? 'warn' : 'bad'} in2`} key={`a-${size}`}>
        <span className="sc-whos"><IconAgent size={12} /> support-agent{good && <span className="sc-cite">cites #pricing · Mon</span>}</span>
        {reply}
      </div>
      <div className={`sc-outcome ${good ? 'good' : fits ? 'warn' : 'bad'} in3`} key={`o-${size}`}>
        <span>
          {good
            ? <><b>{fits ? 'Correct, with a heads-up.' : 'Deal on track.'}</b> Answer linked to Rosa’s decision.</>
            : fits
              ? <><b>Right by luck.</b> The reason is wrong, and so is every answer above 20 seats.</>
              : <><b>Thursday: deal at risk.</b> Sales opens the call with a correction.</>}
        </span>
        {good
          ? <button className="sc-act" onClick={onReplay}>Replay without</button>
          : <button className="sc-act" onClick={onFix}>Fix it with Locus AI →</button>}
      </div>
    </div>
  );
}
