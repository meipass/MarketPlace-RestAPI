export type SortBy = "price" | "title"
export type SortOrder = "asc" | "desc"

export interface QueryFilter {
    minPrice?: number
    maxPrice?: number
    search?: string
    sortBy: SortBy
    order: SortOrder
    page: number
    limit: number
}
