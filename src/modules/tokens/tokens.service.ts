import { createHash, randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";
import * as tokenRepository from "./tokens.repository.js";
import type { RotateRefreshTokenResult } from "#app/interfaces/rotateRefreshTokenResult.type";
import type { AuthPayload } from "#app/interfaces/authPayload.type";
import { AppError } from "#app/modules/appError/appError.class";

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
): Promise<boolean> {
  return tokenRepository.saveRefreshToken(tokenHash, ownerId);
}

export function generateRefreshToken(): string {
  return randomBytes(16).toString("base64url");
}

export function hashRefreshToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function revokeRefreshToken(token: string): Promise<boolean> {
  const tokenHash = hashRefreshToken(token);
  const now = new Date();
  return tokenRepository.revokeRefreshToken(tokenHash, now);
}

export function findRefreshToken(token: string): Promise<number | null> {
  return tokenRepository.findRefreshToken(token);
}

export async function rotateRefreshToken(
  oldToken: string,
): Promise<RotateRefreshTokenResult> {
  const hashedToken = hashRefreshToken(oldToken);

  const newToken = generateRefreshToken();
  const newHashedToken = hashRefreshToken(newToken);

  // TODO: Add transaction
  const userId = await findRefreshToken(hashedToken);
  if (!userId) {
    throw new AppError("INVALID_REFRESH_TOKEN");
  }

  const isSuccessfullyRevoked = await revokeRefreshToken(hashedToken);
  if (!isSuccessfullyRevoked) {
    throw new AppError("REFRESH_TOKEN_REVOKE_ERROR");
  }

  await saveRefreshToken(newHashedToken, userId);

  return {
    userId: userId,
    newRefreshToken: newHashedToken,
  };
}
