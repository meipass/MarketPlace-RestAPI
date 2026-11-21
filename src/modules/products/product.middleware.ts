import type { Request, Response, NextFunction } from "express";
import {
  validateFilters,
  validateProductId,
  validateProductData,
} from "./product.validator.js";

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
