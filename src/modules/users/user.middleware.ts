import type { Request, Response, NextFunction } from "express";
import { isValidPassword } from "#app/validators/isValidPassword.validator";

export function changePasswordMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { oldPassword, newPassword } = req.body;

  if (!isValidPassword(oldPassword) || !isValidPassword(newPassword)) {
    res.status(422).json({
      status: "error",
      message: "INVALID_CREDENTIALS",
    });

    return;
  }

  next();
}
