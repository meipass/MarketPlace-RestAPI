import type { NewReview } from "#app/interfaces/reviews/newReview.type";

import * as reviewRepository from "./reviews.repository.js";

export function create(data: NewReview) {
  return reviewRepository.create(data);
}

export function remove(userId: number, reviewId: number) {
  return reviewRepository.remove(userId, reviewId);
}

export function findById(reviewId: number) {
  return reviewRepository.findById(reviewId);
}

export function findByUserId(userId: number, page: number, limit: number) {
  return reviewRepository.findByUserId(userId, page, limit);
}
