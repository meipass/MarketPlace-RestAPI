import type { NewReview } from "#app/interfaces/reviews/newReview.type";

import * as reviewRepository from "./reviews.repository.js";

export function create(data: NewReview) {
  return reviewRepository.create(data);
}

export function remove(userId: number, reviewId: number) {
  return reviewRepository.remove(userId, reviewId);
}

export function getById(reviewId: number) {
  return reviewRepository.getById(reviewId);
}

export function getByUserId(userId: number, page: number, limit: number) {
  return reviewRepository.getByUserId(userId, page, limit);
}

export function getByProductId(productId: number, page: number, limit: number) {
  return reviewRepository.getByProductId(productId, page, limit);
}
