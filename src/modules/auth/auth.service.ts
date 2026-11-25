import { AppError } from "#app/modules/appError/appError.class";
import type { Tokens } from "#app/interfaces/tokens/tokens.type";

import { db } from "#app/db/db";

import bcrypt from "bcrypt";
import * as tokenService from "#app/modules/tokens/tokens.service";
import * as userService from "#app/modules/users/user.service";

export async function registerUser(
  email: string,
  login: string,
  password: string,
): Promise<Tokens> {
  const result = await db.transaction(async (tx) => {
    const isAlreadyTakenLogin = await userService.findByLogin(login, tx);
    if (isAlreadyTakenLogin) {
      throw new AppError("INVALID_CREDENTIALS");
    }

    const isAlreadyTakenEmail = await userService.findByEmail(email, tx);
    if (isAlreadyTakenEmail) {
      throw new AppError("INVALID_CREDENTIALS");
    }

    const passwordHashed = await bcrypt.hash(password, 10);

    const userId = await userService.create(email, login, passwordHashed, tx);
    if (!userId) {
      throw new AppError("UNKNOWN_SERVER_ERROR");
    }

    const accessToken = tokenService.generateAccessToken({ userId });
    const refreshToken = tokenService.generateRefreshToken();
    const hashedRefreshToken = tokenService.hashRefreshToken(refreshToken);

    await tokenService.saveRefreshToken(hashedRefreshToken, userId, tx);

    return {
      access: accessToken,
      refresh: hashedRefreshToken,
    };
  });

  return result;
}

export async function loginUser(
  login: string,
  password: string,
): Promise<Tokens> {
  const authUser = await userService.getAuthDataByLogin(login);
  if (!authUser) {
    throw new AppError("INVALID_CREDENTIALS");
  }

  const isPasswordMatches = await bcrypt.compare(
    password,
    authUser.passwordHash,
  );
  if (!isPasswordMatches) {
    throw new AppError("INVALID_CREDENTIALS");
  }

  const userId = authUser.id;

  const accessToken = tokenService.generateAccessToken({ userId: userId });
  const refreshToken = tokenService.generateRefreshToken();

  const refreshTokenHash = tokenService.hashRefreshToken(refreshToken);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  const isSaved = await tokenService.saveRefreshToken(
    refreshTokenHash,
    authUser.id,
  );
  if (!isSaved) {
    throw new AppError("UNKNOWN_SERVER_ERROR");
  }

  return {
    access: accessToken,
    refresh: refreshToken,
  };
}

export async function logOutUser(refreshToken: string) {
  const hashedRefreshToken = tokenService.hashRefreshToken(refreshToken);

  await db.transaction(async (tx) => {
    const userId = await tokenService.findRefreshToken(hashedRefreshToken, tx);
    if (!userId) {
      throw new AppError("INVALID_TOKEN");
    }

    const isRevoked = await tokenService.revokeRefreshToken(
      hashedRefreshToken,
      tx,
    );
    if (!isRevoked) {
      throw new AppError("INVALID_TOKEN");
    }
  });
}

export async function refreshUserTokens(refreshToken: string): Promise<Tokens> {
  const rotateResult = await tokenService.rotateRefreshToken(refreshToken);

  const accessToken = tokenService.generateAccessToken({
    userId: rotateResult.userId,
  });

  return {
    access: accessToken,
    refresh: rotateResult.newRefreshToken,
  };
}
