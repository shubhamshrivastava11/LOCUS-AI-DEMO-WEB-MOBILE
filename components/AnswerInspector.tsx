'use client';
import { useEffect, useRef, useState } from 'react';
import { ToolIcon, toolHue } from './ToolIcon';
import { IconLock } from './Icons';

type Hit = 'match' | 'none' | 'locked';
type Ev = { n: number; slug: string; tool: string; where: string; who: string; when: string; quote: string; mark: string };
type Q = {
  id: string; ask: string;
  searched: Record<string, { hit: Hit; note: string }>;
  claims: { text: string; refs: number[] }[];
  evidence: Ev[];
  replaces?: string;
  ignored?: { where: string; quote: string; why: string };
  none?: string;
};

const TOOLS: [string, string][] = [['slack', 'Slack'], ['microsoft-teams', 'Teams'], ['gmail', 'Gmail'], ['notion', 'Notion'], ['jira', 'Jira'], ['github', 'GitHub']];

const QS: Q[] = [
  {
    id: 'launch', ask: 'Why did the Q3 launch move?',
    searched: { slack: { hit: 'match', note: '#launch-planning' }, notion: { hit: 'match', note: 'Q3 Roadmap' }, jira: { hit: 'match', note: 'LOC-412' }, 'microsoft-teams': { hit: 'none', note: 'No match' }, gmail: { hit: 'none', note: 'No match' }, github: { hit: 'none', note: 'No match' } },
    claims: [
      { text: 'The launch moved from July 15 to July 29 so SSO could ship in the same release.', refs: [1, 2] },
      { text: 'Priya Shah owns the new date, with the SSO rollout plan due Oct 20.', refs: [1, 3] },
    ],
    evidence: [
      { n: 1, slug: 'slack', tool: 'Slack', where: '#launch-planning', who: 'Priya Shah', when: 'Jun 12', quote: 'Moving launch two weeks to July 29 so SSO ships with it. I’ll own the new date.', mark: 'July 29 so SSO ships with it' },
      { n: 2, slug: 'notion', tool: 'Notion', where: 'Q3 Roadmap', who: 'Launch team', when: 'Jun 13', quote: 'Security review must close before GA. SSO is in scope for the Q3 release.', mark: 'SSO is in scope for the Q3 release' },
      { n: 3, slug: 'jira', tool: 'Jira', where: 'LOC-412', who: 'Priya Shah', when: 'Oct 13', quote: 'I’ll have the SSO rollout plan in this ticket by Oct 20.', mark: 'SSO rollout plan in this ticket by Oct 20' },
    ],
    replaces: 'Launch on July 15 (May 28)',
  },
  {
    id: 'pricing', ask: 'How many seats does the free tier include?',
    searched: { slack: { hit: 'match', note: '#pricing' }, 'microsoft-teams': { hit: 'match', note: 'Growth › Pricing' }, notion: { hit: 'none', note: 'No match' }, gmail: { hit: 'none', note: 'No match' }, jira: { hit: 'none', note: 'No match' }, github: { hit: 'none', note: 'No match' } },
    claims: [
      { text: 'The free tier is capped at 20 seats from the next billing cycle.', refs: [1, 2] },
      { text: 'Existing workspaces get a notice before the cap applies.', refs: [2] },
    ],
    evidence: [
      { n: 1, slug: 'slack', tool: 'Slack', where: '#pricing', who: 'Rosa Diaz', when: 'Mon 10:14', quote: 'We’re capping the free tier at 20 seats, effective next billing cycle.', mark: 'capping the free tier at 20 seats' },
      { n: 2, slug: 'microsoft-teams', tool: 'Teams', where: 'Growth › Pricing', who: 'Sam Lee', when: 'Mon 11:02', quote: 'Billing will enforce the 20-seat cap from the next cycle. Existing workspaces get a notice.', mark: 'Existing workspaces get a notice' },
    ],
    replaces: 'Free tier: unlimited seats (Aug 30)',
    ignored: { where: 'help.acme.com/pricing', quote: 'Free plan includes unlimited seats for every team.', why: 'Older than the decision that replaced it' },
  },
  {
    id: 'salary', ask: 'What are the 2027 salary bands?',
    searched: { gmail: { hit: 'locked', note: 'HR labels · not shared with you' }, notion: { hit: 'locked', note: 'People space · no access' }, slack: { hit: 'none', note: 'No match' }, 'microsoft-teams': { hit: 'none', note: 'No match' }, jira: { hit: 'none', note: 'No match' }, github: { hit: 'none', note: 'No match' } },
    claims: [], evidence: [],
    none: 'I can’t answer this. Nothing you have access to covers it, and I won’t guess.',
  },
];

const VIEWER = 'Sam Lee · Member, Growth';

function Quote({ text, mark }: { text: string; mark: string }) {
  const i = text.indexOf(mark);
  if (i < 0) return <>“{text}”</>;
  return <>“{text.slice(0, i)}<mark>{mark}</mark>{text.slice(i + mark.length)}”</>;
}

export default function AnswerInspector() {
  const [qi, setQi] = useState(0);
  const [phase, setPhase] = useState(0); // 0 typing, 1 searching, 2 answer, 3 verified
  const [typed, setTyped] = useState('');
  const [selClaim, setSelClaim] = useState<number | null>(null);
  const [selEv, setSelEv] = useState<number | null>(null);
  const timers = useRef<number[]>([]);
  const started = useRef(false);
  const box = useRef<HTMLDivElement>(null);
  const q = QS[qi];

  const run = (i: number) => {
    timers.current.forEach(clearTimeout); timers.current = [];
    setQi(i); setSelClaim(null); setSelEv(null);
    const ask = QS[i].ask;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setTyped(ask); setPhase(3); return; }
    setPhase(0); setTyped('');
    const per = 22;
    for (let k = 1; k <= ask.length; k++) timers.current.push(window.setTimeout(() => setTyped(ask.slice(0, k)), k * per));
    const t0 = ask.length * per + 150;
    timers.current.push(window.setTimeout(() => setPhase(1), t0));
    timers.current.push(window.setTimeout(() => setPhase(2), t0 + 900));
    timers.current.push(window.setTimeout(() => setPhase(3), t0 + 1500));
  };

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !started.current) { started.current = true; run(0); io.disconnect(); } }, { threshold: 0.3 });
    if (box.current) io.observe(box.current);
    return () => { io.disconnect(); timers.current.forEach(clearTimeout); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Linked highlighting: a sentence lights its evidence; a source lights the sentences that cite it.
  const activeRefs = selClaim !== null ? q.claims[selClaim].refs : selEv !== null ? [selEv] : null;
  const activeClaims = selEv !== null ? q.claims.map((c, k) => (c.refs.includes(selEv) ? k : -1)).filter((k) => k >= 0) : selClaim !== null ? [selClaim] : null;
  const activeSlugs = activeRefs ? q.evidence.filter((e) => activeRefs.includes(e.n)).map((e) => e.slug) : null;
  const matches = Object.values(q.searched).filter((s) => s.hit === 'match').length;
  const locked = Object.values(q.searched).filter((s) => s.hit === 'locked').length;
  const pickClaim = (k: number) => { setSelEv(null); setSelClaim(selClaim === k ? null : k); };
  const pickEv = (n: number) => { setSelClaim(null); setSelEv(selEv === n ? null : n); };

  return (
    <div className="ai" ref={box}>
      <div className="ai-top">
        <div className="ai-input" aria-label="Question">
          <span className="ai-mark" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 3 21 19H3z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M12 3 9.5 19" stroke="currentColor" strokeWidth="1.2" opacity=".5" /></svg></span>
          <span className="ai-q">{typed}{phase === 0 && <i className="ai-caret" />}</span>
          <span className="ai-viewer" title="Answers use this person’s access">Asking as {VIEWER}</span>
        </div>
        <div className="ai-try" role="tablist" aria-label="Example questions">
          <span>Try</span>
          {QS.map((x, i) => <button key={x.id} role="tab" aria-selected={qi === i} onClick={() => run(i)}>{x.ask}</button>)}
        </div>
      </div>

      <div className="ai-cols">
        {/* 1. What was searched */}
        <section className="ai-col ai-searched" aria-label="Sources searched">
          <h3 className="ai-h">Searched <span>{phase >= 1 ? `${matches} match${matches === 1 ? '' : 'es'}${locked ? ` · ${locked} skipped` : ''}` : '…'}</span></h3>
          <ul>
            {TOOLS.map(([slug, name], i) => {
              const s = q.searched[slug];
              const done = phase >= 1;
              const hot = activeSlugs?.includes(slug);
              return (
                <li key={slug} className={`ai-src ${done ? s.hit : 'pending'} ${hot ? 'hot' : ''} ${activeSlugs && !hot ? 'dim' : ''}`} style={{ ['--hue' as any]: toolHue(slug), transitionDelay: done ? `${i * 70}ms` : '0ms' }}>
                  <span className="ai-src-ic"><ToolIcon slug={slug} size={14} /></span>
                  <span className="ai-src-name">{name}</span>
                  <span className="ai-src-st">{!done ? <span className="ai-spin" /> : s.hit === 'locked' ? <><IconLock size={12} /> {s.note}</> : s.note}</span>
                </li>
              );
            })}
          </ul>
          <p className="ai-note">Every tool is searched with your access. Spaces you can’t open are skipped, not peeked into.</p>
        </section>

        {/* 2. The answer */}
        <section className="ai-col ai-answer" aria-label="Answer" aria-live="polite">
          <h3 className="ai-h">Answer {phase >= 2 && !q.none && <span className="ai-hint">Select a sentence to see its evidence</span>}</h3>
          {phase < 2 ? (
            <div className="ai-skel"><span /><span /><span /></div>
          ) : q.none ? (
            <p className="ai-none">{q.none}</p>
          ) : (
            <div className="ai-claims">
              {q.claims.map((c, k) => (
                <button key={k} className={`ai-claim ${activeClaims?.includes(k) ? 'on' : ''} ${activeClaims && !activeClaims.includes(k) ? 'dim' : ''}`} onClick={() => pickClaim(k)} aria-pressed={selClaim === k} style={{ animationDelay: `${k * 140}ms` }}>
                  {c.text}
                  <span className="ai-refs">{c.refs.map((r) => <sup key={r}>{r}</sup>)}</span>
                </button>
              ))}
            </div>
          )}
          <div className={`ai-checks ${phase >= 3 ? 'in' : ''}`}>
            {q.none ? (
              <>
                <span className="ai-check neutral"><b>Declined</b> No claim made without a source</span>
                <span className="ai-check neutral"><b>Access</b> {locked} spaces skipped because you can’t open them</span>
              </>
            ) : (
              <>
                <span className="ai-check ok"><b>Grounded</b> {q.claims.length} of {q.claims.length} sentences backed by a source</span>
                {q.replaces && <span className="ai-check ok"><b>Current</b> Replaces “{q.replaces}”</span>}
                <span className="ai-check ok"><b>Access</b> You can open all {q.evidence.length} sources</span>
              </>
            )}
          </div>
        </section>

        {/* 3. Evidence */}
        <section className="ai-col ai-evidence" aria-label="Evidence">
          <h3 className="ai-h">Evidence <span>{phase >= 2 ? q.evidence.length : '…'}</span></h3>
          {phase < 2 ? (
            <div className="ai-skel small"><span /><span /></div>
          ) : q.evidence.length === 0 ? (
            <div className="ai-empty"><IconLock size={18} /><span>No source you can open answers this. If you need it, ask the owner of that space for access.</span></div>
          ) : (
            <div className="ai-evs">
              {q.evidence.map((e, k) => {
                const on = activeRefs?.includes(e.n);
                return (
                  <button key={e.n} className={`ai-ev ${on ? 'on' : ''} ${activeRefs && !on ? 'dim' : ''}`} style={{ ['--hue' as any]: toolHue(e.slug), animationDelay: `${120 + k * 120}ms` }} onClick={() => pickEv(e.n)} aria-pressed={selEv === e.n}>
                    <span className="ai-ev-meta"><span className="ai-ev-n">{e.n}</span><ToolIcon slug={e.slug} size={12} />{e.tool} · {e.where}<span className="ai-ev-when">{e.who}, {e.when}</span></span>
                    <span className="ai-ev-q"><Quote text={e.quote} mark={e.mark} /></span>
                  </button>
                );
              })}
              {q.ignored && (
                <div className="ai-ev ignored" style={{ animationDelay: `${120 + q.evidence.length * 120}ms` }}>
                  <span className="ai-ev-meta"><span className="ai-ev-n">×</span>Ignored · {q.ignored.where}</span>
                  <span className="ai-ev-q"><s>“{q.ignored.quote}”</s></span>
                  <span className="ai-ev-why">{q.ignored.why}</span>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
