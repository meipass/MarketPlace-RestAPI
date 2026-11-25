import type { Request, Response, NextFunction } from "express";

import { isValidPassword } from "#app/validators/isValidPassword.validator";
import { isValidEmail } from "#app/validators/isValidEmail.validator";
import { isValidLogin } from "#app/validators/isValidLogin.validator";

export function changePassword(
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

export function changeEmail(req: Request, res: Response, next: NextFunction) {
  const { newEmail } = req.body;

  if (!isValidEmail(newEmail)) {
    res.status(422).json({
      status: "error",
      message: "INVALID_CREDENTIALS",
    });

    return;
  }

  next();
}

export function changeLogin(req: Request, res: Response, next: NextFunction) {
  const { newLogin } = req.body;

  if (!isValidLogin(newLogin)) {
    res.status(422).json({
      status: "error",
      message: "INVALID_CREDENTIALS",
    });

    return;
  }

  next();
}
