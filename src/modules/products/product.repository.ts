import { db } from "#app/db/db";
import { productsTable } from "#app/db/schema/products.schema";
import { and, asc, count, desc, eq, gte, ilike, lte } from "drizzle-orm";
import type { QueryFilter } from "#app/interfaces/queryFilter.type";
import type { PaginatedResult } from "#app/interfaces/paginatedResult.type";
import type { Product } from "#app/interfaces/product.type";

export async function createProduct(
  sellerId: number,
  title: string,
  description: string,
  price: number,
  stock: number,
): Promise<Product | null> {
  const [product] = await db
    .insert(productsTable)
    .values({
      sellerId,
      title,
      description,
      price,
      stock,
    })
    .returning({
      id: productsTable.id,
      sellerId: productsTable.sellerId,
      title: productsTable.title,
      description: productsTable.description,
      price: productsTable.price,
      stock: productsTable.stock,
      updatedAt: productsTable.updatedAt,
      createdAt: productsTable.createdAt,
    });

  return product ?? null;
}

export async function getProducts(
  filters: QueryFilter,
): Promise<PaginatedResult<Product>> {
  const conditions = [];

  if (filters.minPrice !== undefined) {
    conditions.push(gte(productsTable.price, filters.minPrice));
  }

  if (filters.maxPrice !== undefined) {
    conditions.push(lte(productsTable.price, filters.maxPrice));
  }

  if (filters.search !== undefined && filters.search.length > 0) {
    conditions.push(ilike(productsTable.title, `%${filters.search}%`));
  }

  const where = conditions.length ? and(...conditions) : undefined;

  const sortColumns = {
    price: productsTable.price,
    title: productsTable.title,
  } as const;

  const sortColumn = sortColumns[filters.sortBy];
  const sortOrder = filters.order === "asc" ? asc : desc;

  const offset = (filters.page - 1) * filters.limit;

  const [items, totalResult] = await Promise.all([
    db
      .select()
      .from(productsTable)
      .where(where)
      .orderBy(sortOrder(sortColumn))
      .limit(filters.limit)
      .offset(offset),

    db.select({ total: count() }).from(productsTable).where(where),
  ]);

  return {
    items,
    page: filters.page,
    limit: filters.limit,
    total: totalResult[0]?.total ?? 0,
  };
}

export async function getProduct(id: number): Promise<Product | null> {
  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, id));

  return product ?? null;
}

export async function getProductOwner(id: number): Promise<number | null> {
  const [product] = await db
    .select({ sellerId: productsTable.sellerId })
    .from(productsTable)
    .where(eq(productsTable.id, id));

  return Number(product?.sellerId) ?? null;
}

export async function changeProduct(
  id: number,
  userId: number,
  title?: string,
  description?: string,
  price?: number,
  stock?: number,
): Promise<boolean> {
  const [success] = await db
    .update(productsTable)
    .set({
      title,
      description,
      price,
      stock,
    })
    .where(and(eq(productsTable.id, id), eq(productsTable.sellerId, userId)))
    .returning({ id: productsTable.id });

  return success !== undefined;
}

export async function deleteProduct(
  id: number,
  userId: number,
): Promise<boolean> {
  const [success] = await db
    .delete(productsTable)
    .where(and(eq(productsTable.id, id), eq(productsTable.sellerId, userId)))
    .returning({ id: productsTable.id });

  return success !== undefined;
}
