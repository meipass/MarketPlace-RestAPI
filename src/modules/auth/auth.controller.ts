import type { Response, Request } from "express";

import * as authService from "./auth.service.js";
import { validateRegistrationBody } from "#app/modules/auth/auth.validator";
import { setAuthCookies } from "./auth.cookies.js";

export async function registerController(req: Request, res: Response) {
  const registrationBody = validateRegistrationBody(req.body);

  const tokens = await authService.registerUser(
    registrationBody.email,
    registrationBody.login,
    registrationBody.password,
  );

  setAuthCookies(res, tokens);

  return res.status(201).json({
    status: "success",
    message: "Successfully created a new user",
  });
}

export async function logOutController(req: Request, res: Response) {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({
      message: "Refresh token is required",
    });
  }

  await authService.logOutUser(refreshToken);

  return res.status(204).json("Successfully logged out");
}

export async function loginController(req: Request, res: Response) {
  const { email, login, password } = req.body;

  const tokens = await authService.loginUser(email, password);
  if (!tokens) {
    return res.status(401).json("Unauthorized");
  }

  return res.status(201).json(tokens);
}
