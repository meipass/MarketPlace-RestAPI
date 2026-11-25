import type { SortOrder } from "#app/interfaces/search/queryFilter.type";

export function isSortOrder(value: unknown): value is SortOrder {
  return value === "asc" || value === "desc";
}
