import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

import { usersTable } from "./users.schema.js";

export const ordersTable = pgTable("orders", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),

  status: varchar({ length: 50 }).default("pending"),

  customerId: integer("customer_id")
    .notNull()
    .references(() => usersTable.id),

  deliveryCity: varchar("delivery_city", { length: 64 }).notNull(),
  deliveryStreet: varchar("delivery_street", { length: 100 }).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
