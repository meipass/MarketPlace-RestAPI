import type { Request, Response, NextFunction } from "express";

import {
  validateFilters,
  validateProductId,
  validateProductData,
} from "./product.validator.js";

import { isValidInteger } from "#app/validators/isValidNumber.validator";
import { isNonEmptyString } from "#app/validators/isNonEmptyString.validator";

export function getProductMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.locals.id = validateProductId(req.params);
  next();
}

export function getProductsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.locals.productFilters = validateFilters(req.query);
  next();
}

export function createProductMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.locals.productData = validateProductData(req.body);
  next();
}

export function changeProductMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const productId = Number(req.params.id);
  if (!isValidInteger(productId)) {
    res.status(422).json({
      status: "error",
      message: "INVALID_PARAMS",
    });

    return;
  }

  const { title, description, price, stock } = req.body;
  if (
    !isNonEmptyString(title) ||
    !isNonEmptyString(description) ||
    !isValidInteger(price) ||
    !isValidInteger(stock)
  ) {
    res.status(422).json({
      status: "error",
      message: "INVALID_BODY",
    });

    return;
  }

  next();
}

export function deleteProductMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const productId = Number(req.params.id);
  if (!isValidInteger(productId)) {
    res.status(422).json({
      status: "error",
      message: "INVALID_PARAMS",
    });

    return;
  }

  next();
}

export function changeProductStockMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const productId = Number(req.params.id);
  if (!isValidInteger(productId)) {
    res.status(422).json({
      status: "error",
      message: "INVALID_PARAMS",
    });

    return;
  }

  const { newStock } = req.body;
  if (!isValidInteger(newStock)) {
    res.status(422).json({
      status: "error",
      message: "INVALID_PARAMS",
    });

    return;
  }

  next();
}
