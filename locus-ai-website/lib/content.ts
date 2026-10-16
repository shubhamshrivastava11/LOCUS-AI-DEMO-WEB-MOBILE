// Single source for site copy and facts. Bracketed values are placeholders to confirm before launch.
export const SITE = {
  name: 'Locus AI',
  tagline: 'Organizational memory infrastructure for enterprise AI',
  url: 'https://locus-ai.vercel.app',
  linkedin: 'https://www.linkedin.com/in/shubhamshrivastava11',
};

export const NAV = [
  { href: '/product', label: 'Product' },
  { href: '/integrations', label: 'Integrations' },
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

export const INTEGRATIONS = [
  { name: 'Slack', cat: 'Communication', scope: 'Channels you pick, public and private' },
  { name: 'Gmail', cat: 'Communication', scope: 'Labels you pick, personal by default' },
  { name: 'Microsoft Teams', cat: 'Communication', scope: 'Teams and channels you pick' },
  { name: 'Discord', cat: 'Communication', scope: 'Servers and channels you pick' },
  { name: 'Notion', cat: 'Knowledge', scope: 'Workspaces and pages you pick' },
  { name: 'Confluence', cat: 'Knowledge', scope: 'Spaces you pick' },
  { name: 'Jira', cat: 'Delivery', scope: 'Projects you pick' },
  { name: 'ClickUp', cat: 'Delivery', scope: 'Spaces and lists you pick' },
  { name: 'Monday', cat: 'Delivery', scope: 'Boards you pick' },
  { name: 'GitHub', cat: 'Engineering', scope: 'Repositories, issues and PR discussions you pick' },
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
  { name: 'Team', price: '[$ per seat]', per: 'per seat / month', desc: 'For teams that want one shared memory.', cta: 'Start team trial', href: '/signin', featured: true, features: ['Everything in Individual', 'Shared workspace and scopes', 'Team Pulse and Memory Explorer', 'Roles: Admin, Lead, Member, Guest', 'Team MCP access for agents', 'Audit log'] },
  { name: 'Enterprise', price: 'Custom', per: 'annual contract', desc: 'For organizations with security and compliance requirements.', cta: 'Contact sales', href: '/contact', features: ['Everything in Team', 'SAML SSO and SCIM provisioning', 'Classification policies and confidential grants', 'Audit log export', 'Custom retention and data residency', 'DPA, security review and dedicated support'] },
];

export const FAQS = [
  { q: 'What data does Locus AI store?', a: 'Raw messages are encrypted and purged after 30 days. Only structured decisions persist: the summary, owner, date, source link and classification.' },
  { q: 'Can Locus AI post or change anything in our tools?', a: 'No. Every integration uses read-only OAuth scopes, and you choose exactly which channels, labels, spaces and projects it can read.' },
  { q: 'Who can see a decision?', a: 'Access follows role, scope and classification. Confidential records need an explicit grant, and personal sources stay private to their owner, including from Admins.' },
  { q: 'Do you support SSO and SCIM?', a: 'SAML SSO and SCIM provisioning are part of the Enterprise plan. Contact sales for availability for your identity provider.' },
  { q: 'Can our AI agents use it?', a: 'Yes. The Locus AI MCP server exposes search_decisions, get_decision_context and log_decision. Agents get the same permissions as the person they act for.' },
  { q: 'How long until we see value?', a: 'Setup is mostly connecting tools. Locus AI then reads recent history, so first answers usually arrive the same day.' },
];
