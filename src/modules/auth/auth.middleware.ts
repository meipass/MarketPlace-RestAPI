import type { Request, Response, NextFunction } from "express";
import {
  validateRegistrationBody,
  validateLoginBody,
} from "./auth.validator.js";
import { isNonEmptyString } from "#app/validators/isNonEmptyString.validator";

export function registerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  validateRegistrationBody(req.body);
  next();
}

export function loginMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  validateLoginBody(req.body);
  next();
}

export function logOutMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!isNonEmptyString(req.cookies?.refresh)) {
    res.status(401).json({
      status: "error",
      message: "UNAUTHORIZED",
    });
    return;
  }

  next();
}
