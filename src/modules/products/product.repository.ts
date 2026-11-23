import { db } from "#app/db/db";
import { productsTable } from "#app/db/schema/products.schema";
import { and, asc, count, desc, eq, gte, ilike, lte, sql } from "drizzle-orm";
import type { QueryFilter } from "#app/interfaces/search/queryFilter.type";
import type { PaginatedResult } from "#app/interfaces/search/paginatedResult.type";
import type { Product } from "#app/interfaces/products/product.type";

export async function create(
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

export async function getMany(
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

export async function get(id: number): Promise<Product | null> {
  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, id));

  return product ?? null;
}

export async function getOwner(id: number): Promise<number | null> {
  const [product] = await db
    .select({ sellerId: productsTable.sellerId })
    .from(productsTable)
    .where(eq(productsTable.id, id));

  return Number.isNaN(Number(product?.sellerId))
    ? null
    : Number(product?.sellerId);
}

export async function change(
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

export async function remove(id: number, userId: number): Promise<boolean> {
  const [success] = await db
    .delete(productsTable)
    .where(and(eq(productsTable.id, id), eq(productsTable.sellerId, userId)))
    .returning({ id: productsTable.id });

  return success !== undefined;
}

export async function changeStock(
  userId: number,
  id: number,
  newStock: number,
) {
  await db
    .update(productsTable)
    .set({
      stock: newStock,
    })
    .where(and(eq(productsTable.id, id), eq(productsTable.sellerId, userId)));
}

export async function increaseStock(
  id: number,
  quantity: number,
): Promise<boolean> {
  const [success] = await db
    .update(productsTable)
    .set({
      stock: sql`${productsTable.stock} + ${quantity}`,
    })
    .where(eq(productsTable.id, id))
    .returning({ id: productsTable.id });

  return success !== undefined;
}

export async function decreaseStock(
  id: number,
  quantity: number,
): Promise<boolean> {
  const [success] = await db
    .update(productsTable)
    .set({
      stock: sql`${productsTable.stock} - ${quantity}`,
    })
    .where(and(gte(productsTable.stock, quantity), eq(productsTable.id, id)))
    .returning({ id: productsTable.id });

  return success !== undefined;
}
