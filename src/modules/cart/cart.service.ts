import { AppError } from "#app/modules/appError/appError.class";

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

export async function findOrCreateCart(userId: number) {
  let cart = await getByUserId(userId);
  if (!cart) {
    cart = await create(userId);
  }

  return cart;
}

export async function addByUserId(
  userId: number,
  productId: number,
  productQuantity: number,
) {
  const cart = await findOrCreateCart(userId);
  if (!cart) {
    throw new AppError("INVALID_CREDENTIALS");
  }

  await add(cart.id, productId, productQuantity);
}

export async function getItems(userId: number, page: number, limit: number) {
  const cart = await findOrCreateCart(userId);
  if (!cart) {
    throw new AppError("INVALID_CREDENTIALS");
  }

  return cartRepository.getItems(cart.id, page, limit);
}
