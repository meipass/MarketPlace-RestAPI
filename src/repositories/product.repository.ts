import { pool } from "../db/db.js"
import type { PaginatedResult } from "../interfaces/paginatedResult.interface.js";
import type { Product } from "../interfaces/product.interface.js"
import type { QueryFilter } from "../interfaces/queryFilter.interface.js";

export async function createProduct(sellerId: number, title: string, description: string, price: number, stock: number): Promise<Product | null> {
    price = Number(price) || 1
    stock = Number(stock) || 0

    const result = await pool.query(
        `INSERT INTO products (seller_id, title, description, price, stock)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING 
                id,
                seller_id AS "sellerId",
                title,
                description,
                price,
                stock
        `, [sellerId, title, description, price, stock]
    )

    return result.rows[0] ?? null
}

export async function getProducts(filters: QueryFilter): Promise<PaginatedResult<Product>> {
    const conditions: string[] = []
    const values: unknown[] = []

    if (filters.minPrice !== undefined) {
        values.push(filters.minPrice)
        conditions.push(`price >= $${values.length}`)
    }

    if (filters.maxPrice !== undefined) {
        values.push(filters.maxPrice)
        conditions.push(`price <= $${values.length}`)
    }

    if (filters.search !== undefined && filters.search.length > 0) {
        values.push(`%${filters.search}%`)
        conditions.push(`title ILIKE $${values.length}`)
    }

    const whereClause = conditions.length > 0
        ? `WHERE ${conditions.join(" AND ")}`
        : ""

    const sortColumns = {
        price: "price",
        title: "title"
    } as const

    const sortColumn = sortColumns[filters.sortBy]
    const sortOrder = filters.order.toUpperCase()

    const limitIndex = values.length + 1
    const offsetIndex = values.length + 2

    const queryValues = [
        ...values,
        filters.limit,
        (filters.page - 1) * filters.limit
    ]

    const result = await pool.query(
        `SELECT
            id,
            seller_id AS "sellerId",
            title,
            description,
            price,
            stock
        FROM products
        ${whereClause}
        ORDER BY ${sortColumn} ${sortOrder}
        LIMIT $${limitIndex}
        OFFSET $${offsetIndex}`,
        queryValues
    )

    const countResult = await pool.query(
        `SELECT COUNT(*) AS total
        FROM products
        ${whereClause}`,
        values
    )

    return {
        items: result.rows,
        page: filters.page,
        limit: filters.limit,
        total: Number(countResult.rows[0].total)
    }
}

export async function getProduct(id: number): Promise<Product | null> {
    const result = await pool.query(
        `SELECT 
                id,
                seller_id AS "sellerId",
                title,
                description,
                price,
                stock
            FROM products
            WHERE id = $1
        `, [id]
    )

    return result.rows[0] ?? null
}

export async function getProductOwner(id: number): Promise<number | null> {
    const result = await pool.query(
        `SELECT seller_id
            FROM products
            WHERE id = $1
        `, [id]
    )

    return Number(result.rows[0].seller_id) ?? null
}

export async function changeProduct(id: number, title?: string, description?: string, price?: number, stock?: number): Promise<Product | null> {
    const result = await pool.query(
        `UPDATE products
            SET 
                title = COALESCE($1, title),
                description = COALESCE($2, description),
                price = COALESCE($3, price),
                stock = COALESCE($4, stock)
            WHERE id = $5 
            RETURNING 
                id,
                seller_id AS "sellerId",
                title,
                description, 
                price,
                stock
        `, [title, description, price, stock, id]
    )

    return result.rows[0] ?? null
}

export async function deleteProduct(id: number) {
    await pool.query(
        `DELETE 
            FROM products
            WHERE id = $1
        `, [id]
    )
}
