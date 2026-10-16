import { INTEGRATIONS } from '@/lib/content';
import { IntegrationMark } from './IntegrationTile';

// Three rows of integration chips drifting in alternating directions.
// Each track is rendered twice so the loop is seamless.
const ORDERS = [
  ['notion', 'gmail', 'discord', 'monday', 'microsoft-teams', 'slack', 'confluence', 'jira', 'clickup', 'github'],
  ['slack', 'gmail', 'clickup', 'github', 'jira', 'confluence', 'notion', 'microsoft-teams', 'discord', 'monday'],
  ['discord', 'monday', 'notion', 'github', 'microsoft-teams', 'jira', 'slack', 'gmail', 'clickup', 'confluence'],
];

function Chip({ slug }: { slug: string }) {
  const i = INTEGRATIONS.find((x) => x.slug === slug)!;
  return (
    <span className="mq-chip">
      <span className="mq-live" aria-hidden="true" />
      <IntegrationMark name={i.name} slug={i.slug} cat={i.cat} size={40} />
      <span className="mq-name">{i.name}</span>
    </span>
  );
}

export default function IntegrationMarquee() {
  return (
    <div className="mq" role="img" aria-label={`Integrations live: ${INTEGRATIONS.map((i) => i.name).join(', ')}`}>
      {ORDERS.map((row, r) => (
        <div key={r} className={`mq-row ${r % 2 ? 'rev' : ''}`} style={{ ['--mq-speed' as any]: `${46 + r * 8}s` }} aria-hidden="true">
          <div className="mq-track">
            {[...row, ...row].map((slug, k) => <Chip key={`${slug}-${k}`} slug={slug} />)}
          </div>
        </div>
      ))}
    </div>
  );
}
