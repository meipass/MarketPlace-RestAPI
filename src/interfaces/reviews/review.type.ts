import type { reviews } from "#app/db/schema/reviews.schema";

export type Review = typeof reviews.$inferSelect;
