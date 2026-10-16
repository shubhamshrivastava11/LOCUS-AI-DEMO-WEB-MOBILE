// Prefix for files in /public when the site is served from a sub-path (GitHub Pages)
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const asset = (p: string) => `${BASE}${p}`;
