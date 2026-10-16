'use client';
import { useEffect, useRef, useState } from 'react';
import { AGENT_EXAMPLES, LIFECYCLE } from '@/lib/content';
import { Cls, Tag } from './Sections';
import { IconAgent, IconArrow, IconUser } from './Icons';

/* Hero preview with an audience switch: what a person sees vs what an agent gets */
export function HeroPreview() {
  const [mode, setMode] = useState<'people' | 'agents'>('people');
  return (
    <div className="hero-preview">
      <div className="seg" role="tablist" aria-label="Preview for">
        <button role="tab" aria-selected={mode === 'people'} onClick={() => setMode('people')}><IconUser size={16} />For people</button>
        <button role="tab" aria-selected={mode === 'agents'} onClick={() => setMode('agents')}><IconAgent size={16} />For agents</button>
      </div>
      <div className="mock-wrap"><div className="mock">
        <div className="mock-bar"><i /><i /><i /><span className="mono caption" style={{ marginLeft: 10 }}>{mode === 'people' ? 'app.locus.ai / search' : 'mcp://locus-ai · release-agent'}</span></div>
        {mode === 'people' ? (
          <div className="grid hero-mock-grid panel-in" key="p">
            <div className="stack gap-16">
              <div className="row gap-12" style={{ padding: '14px 16px', borderRadius: 12, border: '1.5px solid #CFC7FB', boxShadow: '0 0 0 4px #F1EEFF', fontWeight: 500 }}>Why did we move the Q3 launch to July 29?</div>
              <div className="stack gap-12" style={{ padding: 18, borderRadius: 12, background: 'var(--bg-page)', border: '1px solid var(--border)' }}>
                <div className="row gap-8 wrap"><Tag t="Decision" /><Cls l="Internal" /><span className="caption">High confidence · 3 sources agree</span></div>
                <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.65 }}>On June 12 the launch team moved the Q3 release from July 15 to <b>July 29</b> to finish the security review and ship SSO in the same release. Priya owns the new date. <span style={{ color: 'var(--link)', fontWeight: 600 }}>[1] [2]</span></p>
                <div className="row gap-8 wrap">
                  {['1  Slack · #launch-planning · Jun 12', '2  Notion · Q3 Roadmap · Jun 13'].map((c) => <span key={c} className="caption" style={{ padding: '6px 10px', borderRadius: 8, background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>{c}</span>)}
                </div>
              </div>
            </div>
            <div className="stack gap-8 hide-sm" style={{ padding: 16, borderRadius: 12, border: '1px solid var(--border)', alignSelf: 'start' }}>
              <span className="overline" style={{ color: 'var(--text-3)' }}>Decision lineage</span>
              <div className="small" style={{ textDecoration: 'line-through' }}>○ Launch on July 15</div>
              <div className="caption">May 28 · superseded</div>
              <div className="small" style={{ color: 'var(--text)', fontWeight: 600, marginTop: 6 }}>● Launch on July 29 with SSO</div>
              <div className="caption" style={{ color: 'var(--success)' }}>Jun 12 · active</div>
            </div>
          </div>
        ) : (
          <div className="grid hero-mock-grid panel-in" key="a">
            <div className="code" style={{ fontSize: 13, borderRadius: 12, margin: 0 }}><span className="c">{'// release-agent asks before it posts the launch note'}</span>{'\n'}<span className="k">search_decisions</span>({'{'}{'\n'}  query: <span className="s">&quot;Q3 launch date&quot;</span>,{'\n'}  on_behalf_of: <span className="s">&quot;priya@acme.com&quot;</span>{'\n'}{'}'}){'\n\n'}<span className="c">{'// returns'}</span>{'\n{\n  '}<span className="p">&quot;decision&quot;</span>: <span className="s">&quot;Launch on July 29 with SSO&quot;</span>,{'\n  '}<span className="p">&quot;status&quot;</span>: <span className="s">&quot;active&quot;</span>,{'\n  '}<span className="p">&quot;supersedes&quot;</span>: <span className="s">&quot;Launch on July 15&quot;</span>,{'\n  '}<span className="p">&quot;classification&quot;</span>: <span className="s">&quot;internal&quot;</span>,{'\n  '}<span className="p">&quot;sources&quot;</span>: [<span className="s">&quot;slack/#launch-planning&quot;</span>]{'\n}'}</div>
            <div className="stack gap-8 hide-sm" style={{ padding: 16, borderRadius: 12, border: '1px solid var(--border)', alignSelf: 'start' }}>
              <span className="overline" style={{ color: 'var(--text-3)' }}>Checked before answering</span>
              {['Acting for Priya (Lead, Launch)', 'Scope: Launch team', 'Classification: Internal ≤ allowed', 'Logged to audit trail'].map((t) => <div key={t} className="row gap-8 small" style={{ color: 'var(--text)' }}><span style={{ color: 'var(--success)', fontWeight: 700 }}>✓</span>{t}</div>)}
            </div>
          </div>
        )}
      </div></div>
    </div>
  );
}

/* Count-up number that starts when scrolled into view */
export function CountUp({ value, className, style }: { value: string; className?: string; style?: React.CSSProperties }) {
  const m = value.match(/^(\D*)(\d+)(.*)$/);
  const target = m ? parseInt(m[2], 10) : 0;
  const [n, setN] = useState(target);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el || !m) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setN(0);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; io.disconnect();
      const t0 = performance.now(); const d = 1100;
      const tick = (t: number) => { const k = Math.min(1, (t - t0) / d); setN(Math.round(target * (1 - Math.pow(1 - k, 3)))); if (k < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el); return () => io.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return <span ref={ref} className={className} style={style}>{m ? `${m[1]}${n}${m[3]}` : value}</span>;
}

/* Four-stage lifecycle with auto-advance until the visitor interacts */
export function Lifecycle() {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => { if (!auto) return; const t = setInterval(() => setI((x) => (x + 1) % LIFECYCLE.length), 5000); return () => clearInterval(t); }, [auto]);
  const s = LIFECYCLE[i];
  return (
    <div className="life">
      <div className="life-steps" role="tablist" aria-label="How Locus AI works">
        {LIFECYCLE.map((x, j) => (
          <button key={x.key} role="tab" aria-selected={i === j} className="life-step" onClick={() => { setI(j); setAuto(false); }}>
            <span className="mono caption">{x.step}</span><span className="life-name">{x.name}</span>
            <span className="life-bar"><span style={{ animationPlayState: auto && i === j ? 'running' : 'paused', width: !auto && i === j ? '100%' : undefined }} key={`${i}-${auto}`} /></span>
          </button>
        ))}
      </div>
      <div className="life-panel card card-lg panel-in" key={s.key} role="tabpanel">
        <div className="stack gap-12" style={{ maxWidth: 520 }}>
          <h3 className="h2">{s.title}</h3>
          <p className="body">{s.body}</p>
        </div>
        <LifeVisual k={s.key} />
      </div>
    </div>
  );
}

function LifeVisual({ k }: { k: string }) {
  if (k === 'connect') return (
    <div className="stack gap-8 life-vis">
      {[['Slack', '#launch-planning, #platform, #growth', true], ['Gmail', 'Label: Decisions (personal)', true], ['Notion', 'Engineering wiki, Q3 Roadmap', true], ['Jira', 'LOC, PLAT projects', false]].map(([a, b, on]) => (
        <div key={a as string} className="row between gap-12 vis-row"><span><strong>{a}</strong> <span className="caption">{b}</span></span><span className={`toggle ${on ? 'on' : ''}`} /></div>
      ))}
      <span className="caption">Read-only scopes · change any time</span>
    </div>
  );
  if (k === 'capture') return (
    <div className="stack gap-8 life-vis">
      <div className="vis-row small"><span className="caption">#launch-planning · Jun 12</span><br />“Let’s move to the 29th so SSO ships with it. I’ll own the date.”</div>
      <div className="row gap-8 caption" style={{ justifyContent: 'center' }}>↓ extracted</div>
      <div className="vis-row stack gap-8"><div className="row gap-8"><Tag t="Decision" /><strong className="small">Launch on July 29 with SSO</strong></div><span className="caption">Owner: Priya · Why: finish security review · Source linked</span></div>
    </div>
  );
  if (k === 'govern') return (
    <div className="stack gap-8 life-vis">
      {[['Public', 'Everyone + approved Guests'], ['Internal', 'All Members'], ['Restricted', 'Owning scope only'], ['Confidential', 'Explicit grants, every access logged']].map(([l, w]) => (
        <div key={l} className="row between gap-12 vis-row"><Cls l={l} /><span className="caption">{w}</span></div>
      ))}
    </div>
  );
  return (
    <div className="grid life-vis" style={{ gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      <div className="vis-row stack gap-8"><span className="row gap-8 small" style={{ fontWeight: 600 }}><IconUser size={16} />Person</span><span className="small">“Who owns the SSO rollout?”</span><span className="caption">Answer + sources</span></div>
      <div className="vis-row stack gap-8"><span className="row gap-8 small" style={{ fontWeight: 600 }}><IconAgent size={16} />Agent</span><span className="mono caption">get_decision_context(“d3”)</span><span className="caption">Structured JSON</span></div>
      <div className="caption" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>Same memory · same permissions</div>
    </div>
  );
}

/* Horizontal rail of agent examples */
export function AgentRail() {
  const ref = useRef<HTMLDivElement>(null);
  const go = (d: number) => ref.current?.scrollBy({ left: d * 340, behavior: 'smooth' });
  return (
    <div className="stack gap-20">
      <div className="rail" ref={ref} tabIndex={0} aria-label="Example agents using Locus AI">
        {AGENT_EXAMPLES.map((a) => (
          <div key={a.name} className="rail-card">
            <span className="icon-chip"><IconAgent size={20} /></span>
            <strong style={{ fontSize: 17 }}>{a.name}</strong>
            <span className="small">asks: <span style={{ color: '#fff' }}>{a.ask}</span></span>
            <span className="mono caption" style={{ marginTop: 'auto' }}>→ {a.gets}</span>
          </div>
        ))}
      </div>
      <div className="row gap-8" style={{ justifyContent: 'flex-end' }}>
        <button className="rail-btn" aria-label="Previous" onClick={() => go(-1)}><span style={{ display: 'inline-flex', transform: 'scaleX(-1)' }}><IconArrow size={18} /></span></button>
        <button className="rail-btn" aria-label="Next" onClick={() => go(1)}><IconArrow size={18} /></button>
      </div>
    </div>
  );
}

