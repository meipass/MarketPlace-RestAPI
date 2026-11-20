import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("usersTable", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 255 }).notNull(),
  login: varchar({ length: 144 }).notNull(),
  passwordHash: varchar("password_hash", { length: 64 }).notNull(),
});
