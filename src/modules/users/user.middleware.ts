import type { Request, Response, NextFunction } from "express";
import { isValidInteger } from "#app/validators/isValidNumber.validator";

export function getMyProfileMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const isValidUserId = isValidInteger(req.userId);
  if (!isValidUserId) {
    res.status(404).json({
      status: "error",
      message: "INVALID_USER",
    });

    return;
  }

  next();
}
