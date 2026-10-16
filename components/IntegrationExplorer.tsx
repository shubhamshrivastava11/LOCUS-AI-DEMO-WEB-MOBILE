'use client';
import { useEffect, useRef, useState } from 'react';
import { asset } from '@/lib/base';
import { INTEGRATIONS, INTEGRATION_CATS } from '@/lib/content';
import { ToolIcon, toolHue } from './ToolIcon';

type Ex = { reads: string; where: string; who: string; said: string; kind: 'Decision' | 'Action' | 'Blocker'; title: string; cls: 'Public' | 'Internal' | 'Restricted' | 'Confidential'; owner: string };
const EX: Record<string, Ex> = {
  slack: { reads: 'Messages and threads in the channels you pick, public or private.', where: '#pricing', who: 'Rosa Diaz', said: 'We’re capping the free tier at 20 seats, effective next billing cycle.', kind: 'Decision', title: 'Cap the free tier at 20 seats', cls: 'Restricted', owner: 'Rosa Diaz, Growth' },
  gmail: { reads: 'Threads under the labels you pick. Private to their owner by default.', where: 'Label: Legal', who: 'Outside counsel', said: 'Redlines on the DPA are still with us. Both deals stay on hold until the sub-processor list is final.', kind: 'Blocker', title: 'EU DPA review blocking two deals', cls: 'Confidential', owner: 'Legal' },
  'microsoft-teams': { reads: 'Channel messages and replies in the teams you pick.', where: 'Launch › General', who: 'Priya Shah', said: 'Let’s hold new hiring for the launch team until after the Q4 release.', kind: 'Decision', title: 'Hold Q4 hiring for the launch team', cls: 'Restricted', owner: 'Priya Shah, Launch' },
  discord: { reads: 'Messages in the servers and channels you pick.', where: '#api-changes', who: 'Arjun Mehta', said: 'v1 webhooks go away on Dec 1. Migration guide is live.', kind: 'Decision', title: 'Sunset the legacy webhook API on Dec 1', cls: 'Internal', owner: 'Arjun Mehta, Platform' },
  notion: { reads: 'Pages and databases in the workspaces you pick.', where: 'Engineering › ADR-014', who: 'Platform team', said: 'Decision: use Postgres with pgvector for retrieval. No separate vector database.', kind: 'Decision', title: 'Adopt Postgres + pgvector', cls: 'Internal', owner: 'Platform team' },
  confluence: { reads: 'Pages and comments in the spaces you pick.', where: 'Platform › MCP docs', who: 'Arjun Mehta', said: 'I’ll publish the MCP auth guide here this week so agents have a documented flow before beta.', kind: 'Action', title: 'Publish the MCP auth guide', cls: 'Public', owner: 'Arjun Mehta' },
  jira: { reads: 'Issues, status changes and comments in the projects you pick.', where: 'LOC-412', who: 'Priya Shah', said: 'I’ll have the SSO rollout plan in this ticket by Oct 20.', kind: 'Action', title: 'Draft the SSO rollout plan by Oct 20', cls: 'Internal', owner: 'Priya Shah' },
  clickup: { reads: 'Tasks and comments in the spaces and lists you pick.', where: 'Growth › Onboarding', who: 'Sam Lee', said: 'Opening a contract role for onboarding design. We need the extra capacity in Q4.', kind: 'Action', title: 'Hire a contract designer for onboarding', cls: 'Restricted', owner: 'Sam Lee, Growth' },
  monday: { reads: 'Items, status changes and updates on the boards you pick.', where: 'Launch board', who: 'Infra', said: 'Status changed to Blocked: waiting on cloud quota for the staging cluster.', kind: 'Blocker', title: 'Waiting on infra quota for staging', cls: 'Internal', owner: 'Infra' },
  github: { reads: 'Issues and pull request discussions in the repositories you pick.', where: 'PR #318', who: 'Mei Lin', said: 'Not adding a Redis cache here. We ruled it out in ADR-014.', kind: 'Decision', title: 'No Redis cache for retrieval', cls: 'Internal', owner: 'Platform team' },
};

const WHO: Record<string, string> = { Public: 'Everyone in the workspace and approved Guests.', Internal: 'All Members of the workspace. Not Guests.', Restricted: 'Only members of the owner’s scope.', Confidential: 'Only people with an explicit grant. Every access is logged.' };

export default function IntegrationExplorer({ logos }: { logos: Record<string, string | null> }) {
  const [sel, setSel] = useState('slack');
  const [auto, setAuto] = useState(true);
  const [tick, setTick] = useState(0);
  const seen = useRef(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { seen.current = e.isIntersecting; });
    if (box.current) io.observe(box.current);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!auto || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const order = INTEGRATIONS.map((i) => i.slug);
    const t = setTimeout(() => { if (seen.current && !document.hidden) setSel(order[(order.indexOf(sel) + 1) % order.length]); else setTick((x) => x + 1); }, 5200);
    return () => clearTimeout(t);
  }, [sel, auto, tick]);
  const pick = (s: string) => { setSel(s); setAuto(false); };
  const tool = INTEGRATIONS.find((i) => i.slug === sel)!;
  const ex = EX[sel];
  const Mark = ({ slug, size }: { slug: string; size: number }) => (
    <span className="ix-mark" style={{ width: size, height: size, ['--hue' as any]: toolHue(slug) }}>
      {logos[slug] ? <img src={asset(logos[slug]!)} alt="" width={size - 12} height={size - 12} /> : <ToolIcon slug={slug} size={Math.round(size * 0.5)} />}
    </span>
  );
  return (
    <div className="ix" ref={box}>
      <div className="ix-list" role="tablist" aria-label="Integrations" aria-orientation="vertical">
        {INTEGRATION_CATS.map((c) => (
          <div key={c.key} className="ix-group">
            <span className="ix-cat">{c.label}</span>
            {INTEGRATIONS.filter((i) => i.cat === c.key).map((i) => (
              <button key={i.slug} role="tab" aria-selected={sel === i.slug} className="ix-item" onClick={() => pick(i.slug)}>
                <Mark slug={i.slug} size={30} />
                <span className="ix-name">{i.name}</span>
                <span className="ix-live">In pilot</span>
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="ix-panel" role="tabpanel" key={sel} aria-live="polite">
        <div className="ix-head">
          <Mark slug={sel} size={44} />
          <div><strong className="ix-title">{tool.name}</strong><span className="ix-sub">Read-only OAuth · scopes approved by your admin</span></div>
        </div>
        <div className="ix-facts">
          <div><span className="ix-k">Locus AI reads</span><p>{ex.reads}</p></div>
          <div><span className="ix-k">Never</span><p>Posts, edits, reacts or replies. Raw content is deleted after 30 days.</p></div>
        </div>
        <div className="ix-flow">
          <div className="ix-raw a1">
            <span className="ix-k">In {tool.name} · {ex.where}</span>
            <p><b>{ex.who}:</b> “{ex.said}”</p>
          </div>
          <div className="ix-arrow a2" aria-hidden="true"><span /></div>
          <div className="ix-out a3">
            <span className="ix-k ix-k-brand">Kept by Locus AI</span>
            <div className="row gap-8 wrap"><span className={`tag tag-${ex.kind.toLowerCase()}`}>{ex.kind}</span><strong>{ex.title}</strong></div>
            <div className="row gap-8 wrap ix-meta"><span>Owner: {ex.owner}</span><span className={`cls cls-${ex.cls.toLowerCase()}`}>{ex.cls}</span><span>Source linked</span></div>
          </div>
        </div>
        <div className="ix-after a3">
          <div><span className="ix-k">Who can see it</span><p>{WHO[ex.cls]}</p></div>
          <div><span className="ix-k">How agents get it</span><p className="mono ix-mono">search_decisions(&quot;{ex.title.toLowerCase().split(' ').slice(0, 3).join(' ')}&quot;)</p><p className="ix-small">Same access as the person the agent acts for.</p></div>
        </div>
      </div>
    </div>
  );
}
