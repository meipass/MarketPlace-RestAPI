export function parsePrice(value: unknown): number | null | undefined {
  if (value === undefined) return null;
  if (typeof value !== "string" || value.trim() === "") return null;

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) return null;

  return parsed;
}
