import { db } from "#app/db/db";
import { tokensTable } from "#app/db/schema/tokens.schema";
import { and, eq, gt, isNull } from "drizzle-orm";

export async function saveRefreshToken(
  tokenHash: string,
  ownerId: number,
): Promise<boolean> {
  const [result] = await db
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
): Promise<boolean> {
  const [result] = await db
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
): Promise<number | null> {
  const [result] = await db
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
