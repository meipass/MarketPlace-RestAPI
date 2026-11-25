import type { NewReview } from "#app/interfaces/reviews/newReview.type";
import type { Request, Response } from "express";

import * as reviewService from "./reviews.service.js";

export async function create(req: Request<{ id: string }>, res: Response) {
  const productId = Number(req.params.id);
  const { rating, comment } = req.body!;

  const review: NewReview = {
    productId: productId,
    userId: req.userId!,
    rating,
    comment,
  };

  await reviewService.create(review);

  return res.status(201).json({
    status: "success",
    message: "REVIEW_CREATED",
  });
}

export async function getByProductId(
  req: Request<{ id: string; limit: string; page: string }>,
  res: Response,
) {
  const productId = Number(req.params.id);

  const page = Number(req.query.id);
  const limit = Number(req.query.id);

  const reviews = await reviewService.getByProductId(productId, page, limit);

  return res.status(200).json({
    status: "success",
    reviews,
  });
}

export async function remove(
  req: Request<{ id: string; limit: string; page: string }>,
  res: Response,
) {
  const reviewId = Number(req.params.id);

  await reviewService.remove(req.userId!, reviewId);

  return res.status(200).json({
    status: "success",
    message: "REVIEW_DELETED",
  });
}
