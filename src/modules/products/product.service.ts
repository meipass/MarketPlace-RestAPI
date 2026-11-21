import type { PaginatedResult } from "#app/interfaces/paginatedResult.type";
import type { Product } from "#app/interfaces/product.type";
import { AppError } from "#app/modules/appError/appError.class";
import * as productRepository from "#app/modules/products/product.repository";
import type { QueryFilter } from "#app/interfaces/queryFilter.type";

export function createProduct(
  sellerId: number,
  title: string,
  description: string,
  price: number,
  stock: number,
): Promise<Product | null> {
  return productRepository.createProduct(
    sellerId,
    title,
    description,
    price,
    stock,
  );
}

export function getProducts(
  filters: QueryFilter,
): Promise<PaginatedResult<Product>> {
  return productRepository.getProducts(filters);
}

export function getProduct(id: number): Promise<Product | null> {
  return productRepository.getProduct(id);
}

export function getProductOwner(id: number): Promise<number | null> {
  return productRepository.getProductOwner(id);
}

export async function changeProduct(
  id: number,
  userId: number,
  title?: string,
  description?: string,
  price?: number,
  stock?: number,
): Promise<boolean> {
  const product = await getProduct(id);
  if (!product) {
    throw new AppError("Invalid product id", 400);
  }

  const isOwner = product.sellerId === userId;
  if (!isOwner) {
    throw new AppError("Trying to change an product without ownership", 403);
  }

  const isUpdated = await productRepository.changeProduct(
    id,
    userId,
    title,
    description,
    price,
    stock,
  );

  return isUpdated;
}

export async function deleteProduct(
  id: number,
  userId: number,
): Promise<boolean> {
  return productRepository.deleteProduct(id, userId);
}
