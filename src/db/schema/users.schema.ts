import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("usersTable", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 255 }).notNull().unique(),
  login: varchar({ length: 144 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 64 }).notNull(),
});
