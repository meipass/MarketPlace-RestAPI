import { db } from "#app/db/db";
import { AppError } from "#app/modules/appError/appError.class";

import type { NewOrderItem } from "#app/interfaces/orders/newOrderItem.type";

import * as orderRepository from "./orders.repository.js";

export async function create(
  customerId: number,
  deliveryCity: string,
  deliveryStreet: string,
  items: NewOrderItem[],
) {
  return db.transaction(async (tx) => {
    const [order] = await orderRepository.create(
      {
        customerId,
        deliveryCity,
        deliveryStreet,
      },
      tx,
    );
    if (!order?.id) {
      throw new AppError("UNKNOWN_SERVER_ERROR");
    }

    await orderRepository.createMany(
      items.map((item) => ({
        ...item,
        orderId: order.id,
      })),
      tx,
    );

    return order;
  });
}

export function get(orderId: number) {
  return orderRepository.get(orderId);
}
