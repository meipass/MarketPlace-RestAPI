export interface PaginatedResult<T> {
    items: T[],
    page: number | null,
    limit: number | null,
    total: number
}
