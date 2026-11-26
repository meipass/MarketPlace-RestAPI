import type { productsTable } from "#app/db/schema/products.schema";

export type Product = typeof productsTable.$inferSelect;

// export interface Product {
//     id: number, // auto assign
//     price: number,
//     sellerId: number, // req.user.userId
//     title: string,
//     description: string,
//     createdAt: Date,
//     updatedAt: Date,
//     stock: number
// }
