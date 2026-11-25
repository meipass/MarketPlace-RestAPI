import type { SortBy } from "#app/interfaces/search/queryFilter.type";

export function isSortBy(value: unknown): value is SortBy {
  return value === "title" || value === "price";
}
