import type { PaginatedResult } from "#app/interfaces/search/paginatedResult.type";
import type { Product } from "#app/interfaces/products/product.type";
import type { QueryFilter } from "#app/interfaces/search/queryFilter.type";
import type { NewProduct } from "#app/interfaces/products/newProduct.type";

import * as productRepository from "#app/modules/products/product.repository";

export function create(data: NewProduct): Promise<Product | null> {
  return productRepository.create(data);
}

export function getMany(
  filters: QueryFilter,
): Promise<PaginatedResult<Product>> {
  return productRepository.getMany(filters);
}

export function get(id: number): Promise<Product | null> {
  return productRepository.get(id);
}

export function getOwner(id: number): Promise<number | null> {
  return productRepository.getOwner(id);
}

export function change(
  id: number,
  userId: number,
  title?: string,
  description?: string,
  price?: number,
  stock?: number,
): Promise<boolean> {
  return productRepository.change(id, userId, title, description, price, stock);
}

export function remove(id: number, userId: number): Promise<boolean> {
  return productRepository.remove(id, userId);
}

export function changeStock(
  userId: number,
  productId: number,
  newStock: number,
) {
  return productRepository.changeStock(userId, productId, newStock);
}

export function decreaseStock(productId: number, quantity: number) {
  return productRepository.decreaseStock(productId, quantity);
}

export function increaseStock(productId: number, quantity: number) {
  return productRepository.increaseStock(productId, quantity);
}
