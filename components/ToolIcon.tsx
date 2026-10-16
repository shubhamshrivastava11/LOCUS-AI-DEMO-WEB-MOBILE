import { IconBoard, IconBook, IconBranch, IconChecklist, IconHash, IconHeadset, IconMail, IconPage, IconTicket, IconVideoChat } from './Icons';

// Neutral, non-brand identity for each integration: an icon for what the tool is used for,
// and an accent from the Locus AI palette. Official logo files (public/integrations/) override these.
export const TOOL_STYLE: Record<string, { Icon: (p: { size?: number }) => JSX.Element; hue: string }> = {
  slack: { Icon: IconHash, hue: '#0E9F8E' },
  gmail: { Icon: IconMail, hue: '#C77A12' },
  'microsoft-teams': { Icon: IconVideoChat, hue: '#0284C7' },
  discord: { Icon: IconHeadset, hue: '#2E8B4E' },
  notion: { Icon: IconPage, hue: '#6D5AE6' },
  confluence: { Icon: IconBook, hue: '#E0652B' },
  jira: { Icon: IconTicket, hue: '#D14D72' },
  clickup: { Icon: IconChecklist, hue: '#7C3AED' },
  monday: { Icon: IconBoard, hue: '#4338CA' },
  github: { Icon: IconBranch, hue: '#2F6FEB' },
};

export function ToolIcon({ slug, size = 18 }: { slug: string; size?: number }) {
  const t = TOOL_STYLE[slug];
  if (!t) return null;
  return <t.Icon size={size} />;
}
export const toolHue = (slug: string) => TOOL_STYLE[slug]?.hue ?? '#6D5AE6';
