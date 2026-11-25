import { AppError } from "#app/modules/appError/appError.class";

import type { AuthUser } from "#app/interfaces/auth/authUser.type";
import type { Transaction } from "#app/interfaces/transaction.type";
import type { User } from "#app/interfaces/user/user.type";

import bcrypt from "bcrypt";
import * as userRepository from "./user.repository.js";

export function create(
  email: string,
  login: string,
  password: string,
  tx?: Transaction,
): Promise<number | null> {
  return userRepository.create(email, login, password, tx);
}

export function findByEmail(
  email: string,
  tx?: Transaction,
): Promise<User | null> {
  return userRepository.findByEmail(email, tx);
}

export function findByLogin(
  login: string,
  tx?: Transaction,
): Promise<User | null> {
  return userRepository.findByLogin(login, tx);
}

export function findById(
  userId: number,
  tx?: Transaction,
): Promise<User | null> {
  return userRepository.findById(userId, tx);
}

export function getAuthDataByEmail(
  email: string,
  tx?: Transaction,
): Promise<AuthUser | null> {
  return userRepository.getAuthDataByEmail(email, tx);
}

export function getAuthDataByLogin(
  login: string,
  tx?: Transaction,
): Promise<AuthUser | null> {
  return userRepository.getAuthDataByLogin(login, tx);
}

export function getAuthDataById(
  userId: number,
  tx?: Transaction,
): Promise<AuthUser | null> {
  return userRepository.getAuthDataById(userId, tx);
}

export function getMyProfile(userId: number): Promise<User | null> {
  return findById(userId);
}

export async function changePassword(
  userId: number,
  oldPassword: string,
  newPassword: string,
): Promise<boolean> {
  const authData = await getAuthDataById(userId);
  if (!authData) {
    throw new AppError("INVALID_USER_ID");
  }

  const isCorrectPassword = await bcrypt.compare(
    oldPassword,
    authData.passwordHash,
  );
  if (!isCorrectPassword) {
    throw new AppError("INVALID_PASSWORD");
  }

  const newPasswordHash = await bcrypt.hash(newPassword, 10);

  return userRepository.changePassword(userId, newPasswordHash);
}

export async function changeLogin(
  userId: number,
  newLogin: string,
): Promise<boolean> {
  const authData = await getAuthDataById(userId);
  if (!authData) {
    throw new AppError("INVALID_USER_ID");
  }

  return userRepository.changeLogin(userId, newLogin);
}

export async function changeEmail(
  userId: number,
  newEmail: string,
): Promise<boolean> {
  const authData = await getAuthDataById(userId);
  if (!authData) {
    throw new AppError("INVALID_USER_ID");
  }

  return userRepository.changeLogin(userId, newEmail);
}
