import { integer, pgTable, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users.schema.js";

export const carts = pgTable("carts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  customerId: integer("customer_id")
    .notNull()
    .references(() => usersTable.id),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
