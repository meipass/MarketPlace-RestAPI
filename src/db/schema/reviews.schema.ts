import { sql } from "drizzle-orm";

import {
  pgTable,
  integer,
  text,
  unique,
  check,
  timestamp,
} from "drizzle-orm/pg-core";

import { usersTable } from "./users.schema.js";
import { productsTable } from "./products.schema.js";

export const reviews = pgTable(
  "reviews",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),

    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),

    productId: integer("product_id")
      .notNull()
      .references(() => productsTable.id, { onDelete: "cascade" }),

    rating: integer().notNull(),
    comment: text(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },

  (table) => [
    unique().on(table.productId, table.userId),

    check("reviews_rating_check", sql`${table.rating} BETWEEN 1 AND 5`),
  ],
);
