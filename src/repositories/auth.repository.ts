import { pool } from "../db/db.js"
import { type RefreshToken } from "../interfaces/refreshToken.interface.js"
import { type User } from "../interfaces/user.interface.js"
import { type AuthUser } from "../interfaces/authUser.interface.js"

export async function findUserByLogin(login: string): Promise<User | null> {
    const result = await pool.query(
        `SELECT 
            id, 
            login
        FROM users
        WHERE login = $1
        `, [login]
    )

    return result.rows[0] ?? null
}

export async function findUserById(userId: number): Promise<User | null> {
    const result = await pool.query(
        `SELECT
                id,
                login,
                email
            FROM users
            WHERE id = $1
        `, [userId]
    )

    return result.rows[0] ?? null
}

export async function findUserByEmail(email: string): Promise<User | null> {
    const result = await pool.query(
        `SELECT 
            id, 
            login
        FROM users
        WHERE email = $1
        `, [email]
    )

    return result.rows[0] ?? null
}

export async function registerUser(email: string, login: string, passwordHash: string): Promise<User | null> {
    const result = await pool.query(
        `INSERT INTO users (email, login, password)
            VALUES ($1, $2, $3)
            RETURNING 
                id, 
                login, 
                email
        `, [email, login, passwordHash]
    )

    return result.rows[0] ?? null
}

export async function getAuthUser(email: string): Promise<AuthUser | null> {
    const result = await pool.query(
        `SELECT *
            FROM users
            WHERE email = $1
        `, [email]
    )

    return result.rows[0] ?? null
}

export async function saveRefreshToken(userId: number, token: string, expiresAt: Date) {
    await pool.query(
        `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
            VALUES ($1, $2, $3)
        `, [userId, token, expiresAt]
    )
}

export async function revokeRefreshToken(id: number) {
    await pool.query(
        `UPDATE refresh_tokens 
            SET revoked_at = NOW()
            WHERE id = $1
                AND revoked_at IS NULL
        `, [id]
    )
}

export async function getActiveRefreshTokens(userId: number): Promise<RefreshToken[]> {
    const result = await pool.query(
        `SELECT id, token_hash
            FROM refresh_tokens
            WHERE user_id = $1
                AND revoked_at IS NULL
                AND expires_at > NOW()
        `, [userId]
    )

    return result.rows.map(row => ({
        id: row.id,
        tokenHash: row.token_hash
    }))
}
