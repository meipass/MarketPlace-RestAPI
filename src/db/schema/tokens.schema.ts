import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./users.schema.js";

export const tokensTable = pgTable("refreshTokens", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  tokenHash: varchar("token_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  ownerId: integer("owner_id").references(() => usersTable.id),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
});
