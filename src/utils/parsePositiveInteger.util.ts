export function parsePositiveInteger(
  value: unknown,
  defaultValue: number,
  max?: number,
): number | null {
  if (value === undefined) return defaultValue;
  if (typeof value !== "string" || value.trim() === "") return null;

  const parsed = Number(value);

  if (!Number.isSafeInteger(parsed) || parsed <= 0) return null;
  if (max !== undefined && parsed > max) return null;

  return parsed;
}
