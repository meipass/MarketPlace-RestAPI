import { pool } from "../db/db.js"
import type { PaginatedResult } from "../interfaces/paginatedResult.interface.js";
import type { Product } from "../interfaces/product.interface.js"

export async function createProduct(sellerId: number, title: string, description: string, price: number, stock: number): Promise<Product | null> {
    price = Number(price) || 1
    stock = Number(stock) || 0

    const result = await pool.query(
        `INSERT INTO products (seller_id, title, description, price, stock)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING 
                seller_id AS "sellerId",
                title,
                description,
                price,
                stock
        `, [sellerId, title, description, price, stock]
    )

    return result.rows[0] ?? null
}

export async function getProducts(page?: number, limit?: number): Promise<PaginatedResult<Product>> {
    const result = await pool.query(
        `SELECT * 
            FROM products
            LIMIT $1
            OFFSET $2
        `, [
            limit ?? null,
            page && limit ? (page - 1) * limit : 0
        ]
    )

    const countResult = await pool.query(
        `SELECT COUNT(*) FROM products`
    )

    const total = Number(countResult.rows[0].count)

    return {
        items: result.rows,
        page: page ?? null,
        limit: limit ?? null,
        total: total
    }
}

export async function getProduct(id: number): Promise<Product | null> {
    const result = await pool.query(
        `SELECT 
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

    return Number(result.rows[0]) ?? null
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
    pool.query(
        `DELETE 
            FROM products
            WHERE id = $1
        `, [id]
    )
}
