import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./users.schema.js";

export const productsTable = pgTable("products", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  sellerId: integer("seller_id")
    .notNull()
    .references(() => usersTable.id),
  title: varchar({ length: 64 }).notNull(),
  description: varchar({ length: 256 }).notNull(),
  price: integer().notNull(),
  stock: integer().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
