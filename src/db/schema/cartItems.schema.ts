import { integer, pgTable } from "drizzle-orm/pg-core";
import { carts } from "./cart.schema.js";
import { productsTable } from "./products.schema.js";

export const cartItems = pgTable("cart_items", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),

  cartId: integer("cart_id")
    .notNull()
    .references(() => carts.id),

  productId: integer("product_id")
    .notNull()
    .references(() => productsTable.id),

  productQuantity: integer("product_quantity").notNull(),
});
