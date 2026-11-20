import type { Response, Request, NextFunction } from "express"
import type { QueryFilter, SortBy, SortOrder } from "../interfaces/queryFilter.interface.js";

function parsePositiveInteger(value: unknown, defaultValue: number, max?: number): number | null {
    if (value === undefined) return defaultValue
    if (typeof value !== "string" || value.trim() === "") return null
    
    const parsed = Number(value)

    if (!Number.isSafeInteger(parsed) || parsed <= 0) return null
    if (max !== undefined && parsed > max) return null

    return parsed
}

function parsePrice(value: unknown): number | undefined | null {
    if (value === undefined) return undefined
    if (typeof value !== "string" || value.trim() === "") return null

    const parsed = Number(value)

    if (!Number.isFinite(parsed) || parsed < 0) return null

    return parsed
}

function isSortBy(value: unknown): value is SortBy {
    return value === "title" || value === "price"
}

function isSortOrder(value: unknown): value is SortOrder {
    return value === "asc" || value === "desc"
}

export function getProductsMiddleware(req: Request, res: Response, next: NextFunction) {
    const page = parsePositiveInteger(req.query.page, 1)
    const limit = parsePositiveInteger(req.query.limit, 20, 100)

    const minPrice = parsePrice(req.query.minPrice)
    const maxPrice = parsePrice(req.query.maxPrice)

    const search = req.query.search

    const sortBy = req.query.sortBy
    const order = req.query.order

    if (page === null || limit === null) {
        return res.status(400).json({
            error: "Page must be a positive integer and limit must be between 1 and 100"
        })
    }

    if (minPrice === null || maxPrice === null) {
        return res.status(400).json({
            error: "Prices must be non-negative numbers"
        })
    }

    if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
        return res.status(400).json({
            error: "Minimum price cannot exceed maximum price"
        })
    }

    if (search !== undefined && typeof search !== "string") {
        return res.status(400).json({
            error: "Search must be a string"
        })
    }

    if (typeof search === "string" && search.length > 70) {
        return res.status(400).json({
            error: "Search cannot exceed 70 characters"
        })
    }

    if (sortBy !== undefined && !isSortBy(sortBy)) {
        return res.status(400).json({
            error: "sortBy must be price or title"
        })
    }

    if (order !== undefined && !isSortOrder(order)) {
        return res.status(400).json({
            error: "sortOrder must be asc or desc"
        })
    }

    const validatedSortBy: SortBy = isSortBy(sortBy) ? sortBy : "price"
    const validatedSortOrder: SortOrder = isSortOrder(order) ? order : "asc"
    const validatedSearch: string | undefined = typeof search === "string" ? search : undefined

    const filters: QueryFilter = {
        page: page,
        limit: limit,
        sortBy: validatedSortBy,
        order: validatedSortOrder,
        ...(minPrice !== undefined && { minPrice }),
        ...(maxPrice !== undefined && { maxPrice }),
        ...(validatedSearch !== undefined && { search: validatedSearch })
    }

    res.locals.productFilters = filters

    next()
}
