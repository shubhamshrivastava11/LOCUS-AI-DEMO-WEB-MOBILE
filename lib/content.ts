// Single source for site copy and facts. Bracketed values are placeholders to confirm before launch.
export const SITE = {
  name: 'Locus AI',
  tagline: 'Organizational memory infrastructure for enterprise AI',
  url: 'https://shubhamshrivastava11.github.io/LOCUS-AI-DEMO-WEB-MOBILE',
  linkedin: 'https://www.linkedin.com/in/shubhamshrivastava11',
};

export const NAV = [
  { href: '/product', label: 'Product' },
  { href: '/integrations', label: 'Integrations' },
  { href: '/enterprise', label: 'Enterprise' },
  { href: '/security', label: 'Security' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/demo', label: 'Live demo' },
];

export const STATS = [
  { n: '93%', t: 'of people we interviewed lose track of team decisions regularly.' },
  { n: '80%', t: 'rely on docs and notes that only kind of work.' },
  { n: '87%', t: 'would adopt a dedicated memory layer once their team signs off.' },
];
export const STATS_SOURCE = 'Source: Locus AI customer discovery, 15+ interviews with product and engineering teams, 2026.';

// Logos: drop an official file at public/integrations/<slug>.svg (or .png) from each vendor's brand kit.
// Tiles pick it up at build time; until then a neutral category icon is shown.
export const INTEGRATIONS = [
  { name: 'Slack', slug: 'slack', cat: 'Communication', scope: 'Channels you pick, public and private' },
  { name: 'Gmail', slug: 'gmail', cat: 'Communication', scope: 'Labels you pick, personal by default' },
  { name: 'Microsoft Teams', slug: 'microsoft-teams', cat: 'Communication', scope: 'Teams and channels you pick' },
  { name: 'Discord', slug: 'discord', cat: 'Communication', scope: 'Servers and channels you pick' },
  { name: 'Notion', slug: 'notion', cat: 'Knowledge', scope: 'Workspaces and pages you pick' },
  { name: 'Confluence', slug: 'confluence', cat: 'Knowledge', scope: 'Spaces you pick' },
  { name: 'Jira', slug: 'jira', cat: 'Delivery', scope: 'Projects you pick' },
  { name: 'ClickUp', slug: 'clickup', cat: 'Delivery', scope: 'Spaces and lists you pick' },
  { name: 'Monday', slug: 'monday', cat: 'Delivery', scope: 'Boards you pick' },
  { name: 'GitHub', slug: 'github', cat: 'Engineering', scope: 'Repositories, issues and PR discussions you pick' },
];
export const INTEGRATION_CATS = [
  { key: 'Communication', label: 'Chat & email', note: 'Where decisions get made' },
  { key: 'Knowledge', label: 'Docs & wikis', note: 'Where decisions get written down' },
  { key: 'Delivery', label: 'Work tracking', note: 'Where decisions turn into work' },
  { key: 'Engineering', label: 'Code', note: 'Where decisions get shipped' },
];

// Lifecycle, humans and agents
export const LIFECYCLE = [
  { key: 'connect', step: '01', name: 'Connect', title: 'Pick the channels, labels and spaces Locus AI can read.', body: 'One-click OAuth with read-only scopes. Nothing is posted, edited or replied to, and personal sources stay private to their owner.' },
  { key: 'capture', step: '02', name: 'Capture', title: 'Decisions extract themselves from the conversation.', body: 'A fast triage model skips the noise. A second model pulls out the decision, owner, rationale and source, with no tagging or templates.' },
  { key: 'govern', step: '03', name: 'Govern', title: 'Every record is classified before anyone can see it.', body: 'Public, Internal, Restricted or Confidential, plus role and scope. Raw content is purged after 30 days; only structured decisions persist.' },
  { key: 'recall', step: '04', name: 'Recall', title: 'People ask in plain language. Agents ask over MCP.', body: 'Same memory, same permissions. A person gets an answer with receipts; an agent gets structured context before it acts.' },
];

export const AGENT_EXAMPLES = [
  { name: 'Release agent', ask: 'What did we decide about the Q3 launch date?', gets: 'Active decision, owner, two sources' },
  { name: 'Support agent', ask: 'Did we commit to SSO for enterprise customers?', gets: 'Decision with classification check' },
  { name: 'Onboarding agent', ask: 'Why do we use pgvector instead of a vector DB?', gets: 'Rationale and the ADR it came from' },
  { name: 'Code review agent', ask: 'Is this pattern something the team ruled out?', gets: 'Superseded decision and its replacement' },
  { name: 'Your own agent', ask: 'Any MCP client: Claude, Cursor or custom', gets: 'search_decisions, get_decision_context, log_decision' },
];

export const PILLARS = [
  { key: 'search', name: 'Context Search', title: 'Ask what was decided. Get the answer with receipts.', body: 'Plain-language questions return the decision, who made it, when, and the exact thread it came from. The freshest decision ranks first, so nobody acts on one that was already reversed.', bullets: ['Every answer links to its source', 'Reversed decisions stay linked to what replaced them', 'Confidence and "why you can see this" on every answer'] },
  { key: 'explorer', name: 'Memory Explorer', title: 'Every decision, action and blocker in one place.', body: 'A live, filterable record of what your teams decided, committed to or got stuck on, captured from conversations as they happen.', bullets: ['Filter by type, team, source, date and classification', 'Owner and rationale pulled from context', 'Export to CSV for reviews and audits'] },
  { key: 'pulse', name: 'Team Pulse', title: 'Know what moved this week without another status meeting.', body: 'A weekly read on what each team decided, what is open and what is stuck, built from the work itself.', bullets: ['Weekly digest per team', 'Stuck blockers surfaced early', 'Share to Slack in one click'] },
  { key: 'mcp', name: 'MCP Server', title: 'One memory every agent can query before it acts.', body: 'Plug Locus AI into Claude, Cursor or your own agents. They check what your team already decided, with the same permissions as the person they act for.', bullets: ['search_decisions', 'get_decision_context', 'log_decision'] },
];

export const SECURITY = [
  { title: 'Read-only access', body: 'Every integration uses read-only OAuth scopes. Locus AI never posts, edits or replies.' },
  { title: '30-day raw content purge', body: 'Messages are encrypted at rest and deleted after 30 days. Only structured decisions persist.' },
  { title: 'Five roles', body: 'Owner, Admin, Lead, Member and Guest. Guests see only what is shared with them and can expire.' },
  { title: 'Four classification levels', body: 'Public, Internal, Restricted and Confidential, checked on every search, digest and agent call.' },
  { title: 'Personal sources stay personal', body: 'Records from a person’s own Gmail are visible only to them, including from Admins.' },
  { title: 'Audit log', body: 'Admin actions, role changes and every confidential access grant are recorded and exportable.' },
];

export const ROLES = [
  { role: 'Owner', desc: 'Billing, tenant settings and ownership.' },
  { role: 'Admin', desc: 'Configure sources, roles and policies without reading everything.' },
  { role: 'Lead', desc: 'Manage the scopes their team owns.' },
  { role: 'Member', desc: 'Find and use everyday team knowledge.' },
  { role: 'Guest', desc: 'Only spaces explicitly shared with them; access can expire.' },
];

export const CLASSES = [
  { level: 'Public', who: 'Everyone in the workspace and approved Guests.' },
  { level: 'Internal', who: 'All Members. The default for new records.' },
  { level: 'Restricted', who: 'Members of the owning scope only. Never shown to Guests.' },
  { level: 'Confidential', who: 'Explicit grants only. Every access is logged.' },
];

export const PLANS = [
  { name: 'Individual', price: '$12', per: 'per month', desc: 'For one person who is tired of losing decisions.', cta: 'Start free', href: '/signin', features: ['Personal sources (Gmail, Slack DMs)', 'Private decision register', 'Context Search with history', 'Weekly personal Pulse', 'MCP access for your own agents'] },
  { name: 'Team', price: 'Pilot', per: 'pricing on a call', desc: 'For teams that want one shared memory.', cta: 'Join the pilot', href: '/contact', featured: true, features: ['Everything in Individual', 'Shared workspace and scopes', 'Team Pulse and Memory Explorer', 'Roles: Admin, Lead, Member, Guest', 'Team MCP access for agents', 'Audit log'] },
  { name: 'Enterprise', price: 'Custom', per: 'annual contract', desc: 'For organizations with security and compliance requirements.', cta: 'Contact sales', href: '/contact', features: ['Everything in Team', 'Decision Guard and agent decision features (early access)', 'SAML SSO and SCIM provisioning', 'Classification policies and confidential grants', 'Audit log export', 'Custom retention and data residency', 'DPA, security review and dedicated support'] },
];

export const FAQS = [
  { q: 'What data does Locus AI store?', a: 'Raw messages are encrypted and purged after 30 days. Only structured decisions persist: the summary, owner, date, source link and classification.' },
  { q: 'Can Locus AI post or change anything in our tools?', a: 'No. Every integration uses read-only OAuth scopes, and you choose exactly which channels, labels, spaces and projects it can read.' },
  { q: 'Who can see a decision?', a: 'Access follows role, scope and classification. Confidential records need an explicit grant, and personal sources stay private to their owner, including from Admins.' },
  { q: 'Do you support SSO and SCIM?', a: 'SAML SSO and SCIM provisioning are part of the Enterprise plan. Contact sales for availability for your identity provider.' },
  { q: 'Can our AI agents use it?', a: 'Yes. The Locus AI MCP server exposes search_decisions, get_decision_context and log_decision. Agents get the same permissions as the person they act for.' },
  { q: 'How long until we see value?', a: 'Setup is mostly connecting tools. Locus AI then reads recent history, so first answers usually arrive the same day.' },
];

// Memory loom: what a raw message from each tool becomes once Locus AI captures it
export const LOOM = [
  { slug: 'slack', where: 'Slack · #launch-planning', said: 'Let’s move launch to the 29th so SSO ships with it. I’ll own the date.', kind: 'Decision', title: 'Launch on July 29 with SSO', cls: 'Internal', owner: 'Priya Shah' },
  { slug: 'gmail', where: 'Gmail · Legal', said: 'DPA redlines are still with their counsel. Both deals are on hold until it clears.', kind: 'Blocker', title: 'EU DPA review blocking two deals', cls: 'Confidential', owner: 'Legal' },
  { slug: 'notion', where: 'Notion · ADR-014', said: 'We standardize on Postgres with pgvector for retrieval. No separate vector DB.', kind: 'Decision', title: 'Adopt Postgres + pgvector', cls: 'Internal', owner: 'Platform team' },
  { slug: 'jira', where: 'Jira · LOC-412', said: 'Priya to draft the SSO rollout plan by Oct 20.', kind: 'Action', title: 'Draft SSO rollout plan by Oct 20', cls: 'Internal', owner: 'Priya Shah' },
  { slug: 'github', where: 'GitHub · PR discussion', said: 'Not adding a Redis cache here. We ruled it out in the ADR.', kind: 'Decision', title: 'No Redis cache for retrieval', cls: 'Internal', owner: 'Platform team' },
  { slug: 'microsoft-teams', where: 'Teams · Pricing', said: 'Cap the free tier at 20 seats starting next month.', kind: 'Decision', title: 'Cap the free tier at 20 seats', cls: 'Restricted', owner: 'Growth' },
];

// Enterprise features (early access: not generally available yet)
export const ENTERPRISE = [
  { key: 'guard', name: 'Decision Guard', line: 'Agents check their plan against what your team decided before they act.', body: 'An agent sends its plan to check_plan. Locus AI returns any conflicting decision with its owner and source. The agent changes course or asks the owner for an override, and the override is logged.' },
  { key: 'reversal', name: 'Reversal impact', line: 'See everything built on a decision the moment it is reversed.', body: 'Every agent action records the decisions it relied on. Reverse one, and Locus AI lists the actions, documents and pull requests that depended on it.' },
  { key: 'alerts', name: 'Decision change alerts', line: 'Running agents learn about a changed decision as soon as it is confirmed.', body: 'Agents subscribe to topics. When an owner confirms that a new decision replaces an old one, every subscribed agent gets the change and a short reason over MCP.' },
  { key: 'handover', name: 'Ownerless decision handover', line: 'No decision is left without an owner when people move on.', body: 'When someone leaves or changes role, Locus AI finds their active decisions, suggests a new owner by team and scope, and queues the rest for review.' },
  { key: 'health', name: 'Decision Health', line: 'Measure how well each team makes and keeps decisions.', body: 'Per team: decisions argued over again, time to decide, reversal rate and decisions with no owner, trended week over week.' },
];
