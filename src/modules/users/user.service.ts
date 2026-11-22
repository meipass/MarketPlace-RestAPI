import type { AuthUser } from "#app/interfaces/authUser.type";
import type { Transaction } from "#app/interfaces/transaction.type";
import type { User } from "#app/interfaces/user.type";

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

export function getAuthData(
  email: string,
  tx?: Transaction,
): Promise<AuthUser | null> {
  return userRepository.getAuthData(email, tx);
}

export function getMyProfile(userId: number): Promise<User | null> {
  return findById(userId);
}
