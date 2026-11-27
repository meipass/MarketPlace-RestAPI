import { createHash, randomBytes } from "node:crypto";
import type { RotateRefreshTokenResult } from "#app/interfaces/tokens/rotateRefreshTokenResult.type";
import type { AuthPayload } from "#app/interfaces/auth/authPayload.type";
import type { Transaction } from "#app/interfaces/transaction.type";
import { AppError } from "#app/modules/appError/appError.class";
import { db } from "#app/db/db";
import jwt from "jsonwebtoken";

import * as tokenRepository from "./tokens.repository.js";

const ACCESS_JWT_SECRET = process.env.ACCESS_JWT_SECRET!;

export function generateAccessToken(payload: AuthPayload): string {
  return jwt.sign(payload, ACCESS_JWT_SECRET, {
    expiresIn: "15m",
  });
}

export function verifyAccessToken(token: string): AuthPayload {
  return jwt.verify(token, ACCESS_JWT_SECRET) as AuthPayload;
}

export function saveRefreshToken(
  tokenHash: string,
  ownerId: number,
  tx?: Transaction,
): Promise<boolean> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  return tokenRepository.saveRefreshToken(tokenHash, ownerId, expiresAt, tx);
}

export function generateRefreshToken(): string {
  return randomBytes(16).toString("base64url");
}

export function hashRefreshToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function revokeRefreshToken(
  token: string,
  tx?: Transaction,
): Promise<boolean> {
  const tokenHash = hashRefreshToken(token);
  const now = new Date();
  return tokenRepository.revokeRefreshToken(tokenHash, now, tx);
}

export function findRefreshToken(
  token: string,
  tx?: Transaction,
): Promise<number | null> {
  return tokenRepository.findRefreshToken(token, tx);
}

export async function rotateRefreshToken(
  oldToken: string,
): Promise<RotateRefreshTokenResult> {
  const hashedToken = hashRefreshToken(oldToken);

  const newToken = generateRefreshToken();
  const newHashedToken = hashRefreshToken(newToken);

  const result = await db.transaction(async (tx) => {
    const userId = await findRefreshToken(hashedToken, tx);
    if (!userId) {
      throw new AppError("INVALID_REFRESH_TOKEN");
    }

    const isSuccessfullyRevoked = await revokeRefreshToken(hashedToken, tx);
    if (!isSuccessfullyRevoked) {
      throw new AppError("REFRESH_TOKEN_REVOKE_ERROR");
    }

    await saveRefreshToken(newHashedToken, userId, tx);

    return {
      userId: userId,
      newRefreshToken: newToken,
    };
  });

  return result;
}
