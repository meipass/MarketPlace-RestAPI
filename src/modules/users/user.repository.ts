import { db } from "#app/db/db";
import { usersTable } from "#app/db/schema/users.schema";
import type { AuthUser } from "#app/interfaces/auth/authUser.type";
import type { Transaction } from "#app/interfaces/transaction.type";
import type { User } from "#app/interfaces/user/user.type";
import { eq } from "drizzle-orm";

export async function findByLogin(
  login: string,
  tx?: Transaction,
): Promise<User | null> {
  const client = tx ?? db;

  const [result] = await client
    .select({
      id: usersTable.id,
      login: usersTable.login,
      email: usersTable.email,
    })
    .from(usersTable)
    .where(eq(usersTable.login, login));

  return result ?? null;
}

export async function findById(
  userId: number,
  tx?: Transaction,
): Promise<User | null> {
  const client = tx ?? db;

  const [result] = await client
    .select({
      id: usersTable.id,
      login: usersTable.login,
      email: usersTable.email,
    })
    .from(usersTable)
    .where(eq(usersTable.id, userId));

  return result ?? null;
}

export async function findByEmail(
  email: string,
  tx?: Transaction,
): Promise<User | null> {
  const client = tx ?? db;

  const [result] = await client
    .select({
      id: usersTable.id,
      login: usersTable.login,
      email: usersTable.email,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email));

  return result ?? null;
}

export async function create(
  email: string,
  login: string,
  passwordHash: string,
  tx?: Transaction,
): Promise<number | null> {
  const client = tx ?? db;

  const [userRow] = await client
    .insert(usersTable)
    .values({
      email,
      login,
      passwordHash,
    })
    .returning({ id: usersTable.id });

  return userRow?.id ?? null;
}

export async function changePassword(
  userId: number,
  newPasswordHash: string,
): Promise<boolean> {
  const [isChanged] = await db
    .update(usersTable)
    .set({
      passwordHash: newPasswordHash,
    })
    .where(eq(usersTable.id, userId))
    .returning({ id: usersTable.id });

  return isChanged !== undefined;
}

export async function getAuthDataByEmail(
  email: string,
  tx?: Transaction,
): Promise<AuthUser | null> {
  const client = tx ?? db;

  const [user] = await client
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  return user ?? null;
}

export async function getAuthDataById(
  userId: number,
  tx?: Transaction,
): Promise<AuthUser | null> {
  const client = tx ?? db;

  const [user] = await client
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId));

  return user ?? null;
}
