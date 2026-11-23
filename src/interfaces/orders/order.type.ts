import type { ordersTable } from "#app/db/schema/orders.schema";

export type Order = typeof ordersTable.$inferSelect;
