import type { Request, Response, NextFunction } from "express";

import { isNonEmptyString } from "#app/validators/isNonEmptyString.validator";
import { isValidInteger } from "#app/validators/isValidNumber.validator";

export function create(req: Request, res: Response, next: NextFunction) {
  const productId = Number(req.params.id);
  const { rating, comment } = req.body!;

  if (
    !isValidInteger(productId) ||
    !isValidInteger(rating) ||
    !isNonEmptyString(comment)
  ) {
    return res.status(422).json({
      status: "error",
      message: "INVALID_PARAMS",
    });
  }

  next();
}

export function getByProductId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const productId = Number(req.params.id);

  const page = Number(req.query.page);
  const limit = Number(req.query.limit);

  if (
    !isValidInteger(productId) ||
    !isValidInteger(page) ||
    !isValidInteger(limit)
  ) {
    return res.status(422).json({
      status: "error",
      message: "INVALID_PARAMS",
    });
  }

  next();
}

export function remove(req: Request, res: Response, next: NextFunction) {
  const reviewId = Number(req.params.id);
  if (!isValidInteger(reviewId)) {
    return res.status(422).json({
      status: "error",
      message: "INVALID_PARAMS",
    });
  }

  next();
}
