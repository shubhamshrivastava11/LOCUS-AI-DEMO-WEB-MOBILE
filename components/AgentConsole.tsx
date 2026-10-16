'use client';
import { useEffect, useRef, useState } from 'react';
import { IconAgent } from './Icons';

// Hero: one agent, one question, one switch. Shows the agent's trace with and without Locus AI memory.
type Row = { call: string; ms: number; result: React.ReactNode; tone: 'warn' | 'ok' | 'info' };

const OFF: Row[] = [
  { call: 'kb.search("free tier seats")', ms: 112, tone: 'warn', result: <>help.acme.com/pricing <span className="ac-dim">· last updated 4 months ago</span></> },
  { call: 'compose_reply()', ms: 640, tone: 'info', result: <>Based on 1 help-center page</> },
];
const ON: Row[] = [
  { call: 'search_decisions("free tier seats")', ms: 84, tone: 'ok', result: <>1 active decision <span className="ac-dim">· replaces 1 · access checked for Sam Lee, Growth</span></> },
  { call: 'compose_reply()', ms: 610, tone: 'info', result: <>Based on 1 decision, cited</> },
];

const HOLD = 4200;

export default function AgentConsole() {
  const [on, setOn] = useState(false);
  const [step, setStep] = useState(0); // 0 question, 1..rows trace, then reply, then outcome
  const [auto, setAuto] = useState(true);
  const [hover, setHover] = useState(false);
  const timers = useRef<number[]>([]);
  const visible = useRef(true);
  const box = useRef<HTMLDivElement>(null);
  const rows = on ? ON : OFF;
  const total = rows.length + 2; // rows + reply + outcome

  const play = (mode: boolean) => {
    timers.current.forEach(clearTimeout); timers.current = [];
    setOn(mode);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setStep((mode ? ON : OFF).length + 2); return; }
    setStep(0);
    const n = (mode ? ON : OFF).length + 2;
    for (let i = 1; i <= n; i++) timers.current.push(window.setTimeout(() => setStep(i), 500 + i * 520));
  };

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting; });
    if (box.current) io.observe(box.current);
    play(false);
    return () => { io.disconnect(); timers.current.forEach(clearTimeout); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-flip the switch after each run finishes, until the visitor takes over.
  useEffect(() => {
    if (!auto || hover || step < total) return;
    const t = window.setTimeout(() => { if (visible.current && !document.hidden) play(!on); else setStep(total); }, HOLD);
    return () => clearTimeout(t);
  }, [auto, hover, step, total, on]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = () => { setAuto(false); play(!on); };
  const replay = () => { setAuto(false); play(on); };
  const shown = (i: number) => step >= i;

  return (
    <div className={`ac ${on ? 'is-on' : 'is-off'}`} ref={box} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className="ac-bar">
        <div className="ac-id">
          <span className="ac-bot"><IconAgent size={16} /></span>
          <div><strong>support-agent</strong><span>Acme · replies to prospects</span></div>
        </div>
        <button type="button" role="switch" aria-checked={on} className="ac-switch" onClick={toggle}>
          <span className="ac-switch-label">Locus AI memory</span>
          <span className="ac-track"><span className="ac-knob" /></span>
          <span className="ac-state">{on ? 'On' : 'Off'}</span>
        </button>
      </div>

      <div className="ac-body" aria-live="polite">
        <div className="ac-msg them">
          <span className="ac-who">Northwind Systems · prospect, 45 people</span>
          Does your free tier cover our whole team of 45?
        </div>

        <div className="ac-trace">
          <div className="ac-trace-h"><span>Agent trace</span><span>{on ? 'memory: Locus AI' : 'memory: none'}</span></div>
          {rows.map((r, i) => (
            <div key={`${on}-${i}`} className={`ac-row ${r.tone} ${shown(i + 1) ? 'in' : ''}`}>
              <span className="ac-ic" aria-hidden="true">{r.tone === 'warn' ? '!' : r.tone === 'ok' ? '✓' : '→'}</span>
              <code>{r.call}</code>
              <span className="ac-ms">{r.ms} ms</span>
              <span className="ac-res">{r.result}</span>
              {on && i === 0 && (
                <div className={`ac-dec ${shown(1) ? 'in' : ''}`}>
                  <div className="ac-dec-top"><span className="tag tag-decision">Decision</span><strong>Cap the free tier at 20 seats</strong></div>
                  <div className="ac-dec-meta"><span>Rosa Diaz, Growth</span><span>#pricing · Mon 10:14</span><span className="ac-old">Replaces: <s>unlimited seats</s></span></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={`ac-msg us ${on ? 'good' : 'bad'} ${shown(rows.length + 1) ? 'in' : ''}`}>
          <span className="ac-who"><IconAgent size={12} /> support-agent</span>
          {on
            ? <>The free plan covers up to 20 seats. For a team of 45, the Team plan fits, and I can set up a trial today. <span className="ac-cite">Source: #pricing, Mon</span></>
            : <>Yes. The free plan includes unlimited seats, so all 45 of you can join at no cost.</>}
        </div>
      </div>

      <div className={`ac-foot ${shown(total) ? 'in' : ''}`}>
        <span className={`ac-verdict ${on ? 'good' : 'bad'}`}>
          {on ? <><b>Correct.</b> Linked to the decision made Monday.</> : <><b>Wrong.</b> The price changed Monday. The help page never did.</>}
        </span>
        <span className="ac-actions">
          {!on && shown(total) && <button type="button" className="ac-cta" onClick={toggle}>Turn on memory</button>}
          <button type="button" className="ac-replay" onClick={replay} aria-label="Replay">↻</button>
        </span>
      </div>
    </div>
  );
}
