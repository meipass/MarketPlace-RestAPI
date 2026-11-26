import type { productsTable } from "#app/db/schema/products.schema";

export type NewProduct = typeof productsTable.$inferInsert;
