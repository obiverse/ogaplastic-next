/** Base path for GitHub Pages deployment. Empty string for root domain. */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** Prepend basePath to an asset path (e.g. "/images/foo.png" → "/ogaplastic-next/images/foo.png") */
export function asset(path: string): string {
  return `${basePath}${path}`;
}
