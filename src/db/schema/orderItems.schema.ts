import { integer, pgTable } from "drizzle-orm/pg-core";
import { ordersTable } from "./orders.schema.js";
import { productsTable } from "./products.schema.js";

export const orderItems = pgTable("order_items", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  productQuantity: integer("product_quantity").notNull(),

  orderId: integer("order_id")
    .notNull()
    .references(() => ordersTable.id, { onDelete: "cascade" }),

  productId: integer("product_id")
    .notNull()
    .references(() => productsTable.id, { onDelete: "cascade" }),
});
