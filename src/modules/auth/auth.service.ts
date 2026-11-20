import { type User } from "#app/interfaces/user.type";
import { AppError } from "#app/modules/appError/appError.class";
import { withTransaction } from "#app/db/transaction.js";
import * as bcrypt from "bcrypt";
import * as authRepository from "./auth.repository.js";
import * as tokenService from "#app/modules/tokens/tokens.service";
import type { Tokens } from "#app/interfaces/tokens.type";

export async function registerUser(
  email: string,
  login: string,
  password: string,
): Promise<Tokens> {
  const isAlreadyTakenLogin = await authRepository.findUserByLogin(login);
  if (isAlreadyTakenLogin) {
    throw new AppError("INVALID_CREDENTIALS");
  }

  const isAlreadyTakenEmail = await authRepository.findUserByEmail(email);
  if (isAlreadyTakenEmail) {
    throw new AppError("INVALID_CREDENTIALS");
  }

  const passwordHashed = await bcrypt.hash(password, 10);

  const user = await authRepository.registerUser(email, login, passwordHashed);
  if (!user) {
    throw new AppError("Couldn't register a new user", 500);
  }

  const userId = user.id;

  const accessToken = tokenService.generateAccessToken({ userId });
  const refreshToken = tokenService.generateRefreshToken();
  const hashedRefreshToken = tokenService.hashRefreshToken(refreshToken);

  const newTokens: Tokens = {
    access: accessToken,
    refresh: hashedRefreshToken,
  };

  await tokenService.saveRefreshToken(hashedRefreshToken, userId);

  return newTokens;
}

export async function loginUser(
  email: string,
  password: string,
): Promise<{ accessToken: string; refreshToken: string } | null> {
  const authUser = await authRepository.getAuthUser(email);
  if (!authUser) {
    throw new AppError("Bad credentials", 400);
  }

  const isPasswordMatches = await bcrypt.compare(password, authUser.password);
  if (!isPasswordMatches) {
    throw new AppError("Bad credentials", 400);
  }

  const userId = authUser.id;
  const accessToken = tokens.generateAccessToken({ userId: userId });
  const refreshToken = tokens.generateRefreshToken({ userId: userId });

  const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await authRepository.saveRefreshToken(
    authUser.id,
    refreshTokenHash,
    expiresAt,
  );

  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
}

export async function getMatchingTokenId(
  userId: number,
  refreshToken: string,
): Promise<number | null> {
  const tokens = await authRepository.getActiveRefreshTokens(userId);

  for (const token of tokens) {
    if (await bcrypt.compare(refreshToken, token.tokenHash)) {
      return token.id;
    }
  }

  return null;
}

export async function logOutUser(refreshToken: string) {
  const payload = tokens.verifyRefreshToken(refreshToken);
  if (!payload) {
    throw new AppError("Invalid token", 400);
  }

  const tokenId = await getMatchingTokenId(payload.userId, refreshToken);
  if (tokenId === null) {
    throw new AppError("Invalid token", 400);
  }

  const isRevoked = await authRepository.revokeRefreshToken(tokenId);
  if (!isRevoked) {
    throw new AppError("Invalid token", 400);
  }
}

export async function refreshUserToken(
  refreshToken: string,
): Promise<{ accessToken: string; refreshToken: string }> {
  const payload = tokens.verifyRefreshToken(refreshToken);
  if (!payload) {
    throw new AppError("Invalid token", 400);
  }

  const tokenId = await getMatchingTokenId(payload.userId, refreshToken);
  if (tokenId === null) {
    throw new AppError("Invalid token", 400);
  }

  const newRefreshToken = tokens.generateRefreshToken({
    userId: payload.userId,
  });

  const newAccessToken = tokens.generateAccessToken({
    userId: payload.userId,
  });

  const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await withTransaction(async (client) => {
    const revoked = await authRepository.revokeRefreshToken(tokenId, client);
    if (!revoked) {
      throw new AppError("Invalid token", 400);
    }

    await authRepository.saveRefreshToken(
      payload.userId,
      newRefreshTokenHash,
      expiresAt,
      client,
    );
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}
