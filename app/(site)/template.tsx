// Re-mounts on every navigation, so each page arrives with the same soft entrance
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>;
}
