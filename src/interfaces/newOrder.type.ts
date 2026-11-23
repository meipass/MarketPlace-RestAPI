import type { NewOrderItem } from "../newOrderItem.type.jstype.js";

export interface NewOrder {
  customerId: number;
  deliveryCity: string;
  deliveryStreet: string;
  items: NewOrderItem[];
}
