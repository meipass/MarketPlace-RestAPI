import type { Request, Response, NextFunction } from "express";
import { isNonEmptyString } from "#app/validators/isNonEmptyString.validator";
import {
  validateRegistrationBody,
  validateLoginBody,
} from "./auth.validator.js";

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
  if (!isNonEmptyString(req.cookies?.refreshToken)) {
    res.status(401).json({
      status: "error",
      message: "UNAUTHORIZED",
    });
    return;
  }

  next();
}

export function refreshTokenMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!isNonEmptyString(req.cookies?.refreshToken)) {
    res.status(401).json({
      status: "error",
      message: "UNAUTHORIZED",
    });
  }

  next();
}
