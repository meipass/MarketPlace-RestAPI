import type { reviews } from "#app/db/schema/reviews.schema";

export type NewReview = typeof reviews.$inferInsert;
