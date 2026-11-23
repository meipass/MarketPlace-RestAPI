import { db } from "#app/db/db";
import { eq } from "drizzle-orm";
import { carts } from "#app/db/schema/cart.schema";
import { cartItems } from "#app/db/schema/cartItems.schema";
import { productsTable } from "#app/db/schema/products.schema";

export async function create(customerId: number) {
  const [cart] = await db
    .insert(carts)
    .values({ customerId })
    .returning({ id: carts.id });

  return cart ?? null;
}

export async function getByUserId(customerId: number) {
  const [cart] = await db
    .select({ id: carts.id })
    .from(carts)
    .where(eq(carts.customerId, customerId));

  return cart ?? null;
}

export async function add(
  cartId: number,
  productId: number,
  productQuantity: number,
) {
  await db.insert(cartItems).values({
    cartId,
    productId,
    productQuantity,
  });
}

export async function getItems(cartId: number) {
  return await db
    .select({
      id: cartItems.id,
      quantity: cartItems.productQuantity,
      product: productsTable,
    })
    .from(cartItems)
    .innerJoin(productsTable, eq(cartItems.productId, productsTable.id))
    .where(eq(cartItems.cartId, cartId));
}
