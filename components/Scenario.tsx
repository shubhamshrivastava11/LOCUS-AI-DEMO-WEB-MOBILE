'use client';
import { useEffect, useRef, useState } from 'react';
import { IconAgent, IconHash, IconUser } from './Icons';

const STEPS = [
  { key: 'mon', when: 'Monday, 10:14', title: 'A decision is made in Slack', body: 'The Growth lead caps the free tier at 20 seats. Twelve people react. Nobody updates the help center.' },
  { key: 'wed', when: 'Wednesday, 15:40', title: 'An AI agent answers from the old page', body: 'A prospect asks whether the free tier covers their 45-person team. The support agent reads the outdated pricing page and says yes.' },
  { key: 'thu', when: 'Thursday, 09:05', title: 'Sales finds out on the call', body: 'The first enterprise call opens with a correction instead of a contract. The deal is now at risk.' },
  { key: 'locus', when: 'With Locus AI', title: 'The agent checks the decision first', body: 'The Slack message becomes a decision with an owner and an access level. The old one is marked as replaced. The agent asks Locus AI before it answers.' },
];
const DUR = 6500;

export default function Scenario() {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const [seen, setSeen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.35 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!auto || !seen || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setTimeout(() => setI((x) => (x + 1) % STEPS.length), DUR);
    return () => clearTimeout(t);
  }, [i, auto, seen]);
  const pick = (n: number) => { setI(n); setAuto(false); };
  return (
    <div className="scn" ref={ref}>
      <ol className="scn-steps" role="tablist" aria-label="Example scenario">
        {STEPS.map((s, n) => (
          <li key={s.key}>
            <button role="tab" id={`scn-t-${s.key}`} aria-controls="scn-panel" aria-selected={n === i} className={`scn-step ${n === i ? 'on' : ''} ${n < i ? 'done' : ''} ${s.key === 'locus' ? 'locus' : ''}`} onClick={() => pick(n)}>
              <span className="scn-dot" aria-hidden="true" />
              <span className="scn-when">{s.when}</span>
              <span className="scn-title">{s.title}</span>
              {n === i && <span className="scn-body">{s.body}</span>}
              {n === i && auto && seen && <span className="scn-prog" key={`p${i}`} style={{ animationDuration: `${DUR}ms` }} aria-hidden="true" />}
            </button>
          </li>
        ))}
      </ol>
      <div className="scn-panel" id="scn-panel" role="tabpanel" aria-labelledby={`scn-t-${STEPS[i].key}`} key={i}>
        {i === 0 && <SlackView />}
        {i === 1 && <SupportView wrong />}
        {i === 2 && <CrmView />}
        {i === 3 && <LocusView />}
      </div>
    </div>
  );
}

function Win({ title, icon, children, tone }: { title: string; icon: React.ReactNode; children: React.ReactNode; tone?: string }) {
  return (
    <div className={`scn-win ${tone || ''}`}>
      <div className="scn-bar"><span className="scn-bar-ic">{icon}</span><strong>{title}</strong></div>
      <div className="scn-content">{children}</div>
    </div>
  );
}

function SlackView() {
  return (
    <div className="scn-stack">
      <Win title="pricing" icon={<IconHash size={15} />}>
        <div className="msg">
          <span className="msg-av" style={{ background: '#E6F4F1', color: '#0E7C6F' }}>RD</span>
          <div className="msg-main">
            <div className="msg-head"><strong>Rosa Diaz</strong><span>Growth lead · 10:14</span></div>
            <p>We’re capping the free tier at 20 seats, effective next billing cycle.</p>
            <span className="msg-react">+1 · 12</span>
          </div>
        </div>
      </Win>
      <div className="scn-callout warn"><b>Still published</b><span>Help center, Pricing: “Free plan includes unlimited seats.”</span></div>
    </div>
  );
}

function SupportView({ wrong }: { wrong?: boolean }) {
  return (
    <Win title="Support chat · Northwind Systems" icon={<IconAgent size={15} />}>
      <div className="chat">
        <div className="bub them"><span className="who">Prospect, 45-person team</span>Does your free tier cover our whole team of 45?</div>
        <div className={`bub us ${wrong ? 'bad' : 'good'}`}>
          <span className="who"><IconAgent size={13} /> support-agent</span>
          {wrong ? 'Yes. The free plan includes unlimited seats, so all 45 of you can join at no cost.' : 'The free plan covers up to 20 seats. For 45 people, the Team plan fits, and I can set up a trial today.'}
        </div>
        {wrong && <div className="scn-flag">Answered from an outdated help-center page. The decision changed on Monday.</div>}
      </div>
    </Win>
  );
}

function CrmView() {
  return (
    <Win title="Opportunity · Northwind Systems" icon={<IconUser size={15} />}>
      <div className="crm">
        <div className="crm-row"><span>Stage</span><span className="crm-stage"><s>Evaluation</s> <b>At risk</b></span></div>
        <div className="crm-row"><span>Seats</span><span>45</span></div>
        <div className="crm-row"><span>Next step</span><span>Re-scope pricing</span></div>
        <div className="crm-note"><b>Call note, Thu 09:05.</b> Prospect expected 45 free seats based on our support chat. Opened the call with a correction. Champion is now asking for a written pricing confirmation.</div>
      </div>
    </Win>
  );
}

function LocusView() {
  return (
    <div className="scn-stack">
      <div className="scn-captured">
        <div className="scn-cap-head"><span className="scn-cap-k">Captured from Slack #pricing</span><span className="scn-cap-time">Mon 10:14</span></div>
        <div className="row gap-8 wrap"><span className="tag tag-decision">Decision</span><strong>Cap the free tier at 20 seats</strong></div>
        <div className="row gap-8 wrap caption"><span>Owner: Rosa Diaz, Growth</span><span className="cls cls-restricted">Restricted</span></div>
        <div className="scn-replaced"><span className="tag tag-superseded">Superseded</span><s>Free tier: unlimited seats</s></div>
      </div>
      <div className="scn-call mono"><span className="c">// support-agent, acting for Sam (Growth), before replying</span>{'\n'}<span className="k">search_decisions</span>(<span className="s">&quot;free tier seats&quot;</span>){'\n'}<span className="c">→ 1 active decision · replaces 1 · owner Rosa Diaz</span></div>
      <SupportView />
    </div>
  );
}
