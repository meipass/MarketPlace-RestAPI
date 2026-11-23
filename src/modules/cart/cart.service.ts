import * as cartRepository from "./cart.repository.js";

export function create(customerId: number) {
  return cartRepository.create(customerId);
}

export function getByUserId(customerId: number) {
  return cartRepository.getByUserId(customerId);
}

export async function add(
  cartId: number,
  productId: number,
  productQuantity: number,
) {
  await cartRepository.add(cartId, productId, productQuantity);
}

export async function addByUserId(
  userId: number,
  productId: number,
  productQuantity: number,
) {
  let cart = await getByUserId(userId);
  if (!cart) {
    cart = await create(userId);
  }

  await add(userId, productId, productQuantity);
}
