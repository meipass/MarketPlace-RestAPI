import { db } from "#app/db/db";
import { orderItems } from "#app/db/schema/orderItems.schema";

import { ordersTable } from "#app/db/schema/orders.schema";
import { productsTable } from "#app/db/schema/products.schema";

import type { NewOrder } from "#app/interfaces/orders/newOrder.type";
import type { NewOrderItem } from "#app/interfaces/orders/newOrderItem.type";
import type { Order } from "#app/interfaces/orders/order.type";
import type { Transaction } from "#app/interfaces/transaction.type";
import { eq } from "node_modules/drizzle-orm/index.js";

export async function create(
  data: NewOrder,
  tx?: Transaction,
): Promise<Order[]> {
  const client = tx ?? db;

  return client
    .insert(ordersTable)
    .values({
      status: "pending",
      customerId: data.customerId,
      deliveryCity: data.deliveryCity,
      deliveryStreet: data.deliveryStreet,
    })
    .returning();
}

export async function createMany(
  data: NewOrderItem[],
  tx?: Transaction,
): Promise<NewOrderItem[]> {
  const client = tx ?? db;

  return client.insert(orderItems).values(data).returning();
}

export async function get(orderId: number): Promise<Order | null> {
  const [order] = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.id, orderId));

  return order ?? null;
}

export async function getItems(orderId: number) {
  const items = await db
    .select({
      id: orderItems.id,
      quantity: orderItems.productQuantity,
      product: {
        id: productsTable.id,
        title: productsTable.title,
        description: productsTable.description,
      },
    })
    .from(orderItems)
    .innerJoin(productsTable, eq(orderItems.productId, productsTable.id))
    .where(eq(orderItems.orderId, orderId));

  return items;
}
