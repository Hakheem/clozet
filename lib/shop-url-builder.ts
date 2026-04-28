/**
 * Utility to build shop URLs with updated query parameters.
 * Safe to use in both Server and Client Components.
 */
export function makeShopUrl(
  baseUrl: string,
  searchParams: Record<string, string>,
  updates: Record<string, string | undefined>
): string {
  const p = new URLSearchParams(searchParams as Record<string, string>);
  Object.entries(updates).forEach(([k, v]) => {
    if (v === undefined) p.delete(k);
    else p.set(k, v);
  });
  p.set("page", updates.page ?? "1");
  return `${baseUrl}?${p.toString()}`;
}
