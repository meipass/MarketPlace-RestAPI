import { db } from "#app/db/db";
import { tokensTable } from "#app/db/schema/tokens.schema";
import type { Transaction } from "#app/interfaces/transaction.type";
import { and, eq, gt, isNull } from "drizzle-orm";

export async function saveRefreshToken(
  tokenHash: string,
  ownerId: number,
  tx?: Transaction,
): Promise<boolean> {
  const client = tx ?? db;

  const [result] = await client
    .insert(tokensTable)
    .values({
      tokenHash,
      ownerId,
    })
    .returning({ id: tokensTable.id });

  return result !== undefined;
}

export async function revokeRefreshToken(
  tokenHash: string,
  now: Date,
  tx?: Transaction,
): Promise<boolean> {
  const client = tx ?? db;
  const [result] = await client
    .update(tokensTable)
    .set({
      revokedAt: now,
    })
    .where(
      and(eq(tokensTable.tokenHash, tokenHash), isNull(tokensTable.revokedAt)),
    )
    .returning({ id: tokensTable.id });

  return result !== undefined;
}

export async function findRefreshToken(
  tokenHash: string,
  tx?: Transaction,
): Promise<number | null> {
  const client = tx ?? db;

  const [result] = await client
    .select({
      ownerId: tokensTable.ownerId,
    })
    .from(tokensTable)
    .where(
      and(
        eq(tokensTable.tokenHash, tokenHash),
        isNull(tokensTable.revokedAt),
        gt(tokensTable.expiresAt, new Date()),
      ),
    );

  return result?.ownerId ?? null;
}
