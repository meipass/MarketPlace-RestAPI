import { db } from "#app/db/db";
import { reviews } from "#app/db/schema/reviews.schema";
import type { NewReview } from "#app/interfaces/reviews/newReview.type";
import type { Review } from "#app/interfaces/reviews/review.type";
import type { PaginatedResult } from "#app/interfaces/search/paginatedResult.type";
import { and, count, eq } from "drizzle-orm";

export async function create(data: NewReview) {
  const [isCreated] = await db
    .insert(reviews)
    .values(data)
    .returning({ id: reviews.id });

  return isCreated !== undefined;
}

export async function remove(userId: number, reviewId: number) {
  const [isRemoved] = await db
    .delete(reviews)
    .where(and(eq(reviews.userId, userId), eq(reviews.id, reviewId)))
    .returning({ id: reviews.id });

  return isRemoved !== undefined;
}

export async function findById(reviewId: number): Promise<Review | null> {
  const [review] = await db
    .select()
    .from(reviews)
    .where(eq(reviews.id, reviewId));

  return review ?? null;
}

export async function findByUserId(
  userId: number,
  page: number,
  limit: number,
): Promise<PaginatedResult<Review>> {
  const userReviews = await db
    .select()
    .from(reviews)
    .where(eq(reviews.userId, userId))
    .limit(limit)
    .offset((page - 1) * limit);

  const [totalRows] = await db
    .select({ count: count() })
    .from(reviews)
    .where(eq(reviews.userId, userId));

  return {
    page: page,
    limit: limit,
    total: totalRows?.count ?? null,
    items: userReviews,
  };
}
