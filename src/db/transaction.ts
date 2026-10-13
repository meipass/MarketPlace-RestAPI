import { pool } from "./db.js"
import type { PoolClient } from "pg"

export async function withTransaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await pool.connect()

    try {
        await client.query("BEGIN")
        const result = await callback(client)
        await client.query("COMMIT")

        return result
    } catch (err) {
        try {
            await client.query("ROLLBACK")
        } catch(rollbackErr) {
            console.error("Rollback failed: ", rollbackErr)
        }

        throw err
    } finally {
        client.release()
    }
}

