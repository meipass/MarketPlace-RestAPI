import type { Response, Request } from "express";

import * as authService from "./auth.service.js";
import { setAuthCookies } from "./auth.cookies.js";

export async function registerController(req: Request, res: Response) {
  const { email, login, password } = req.body;

  const tokens = await authService.registerUser(email, login, password);

  setAuthCookies(res, tokens);

  return res.status(201).json({
    status: "success",
    message: "Successfully created a new user",
  });
}

export async function loginController(req: Request, res: Response) {
  const { email, password } = req.body;

  const tokens = await authService.loginUser(email, password);
  if (!tokens) {
    return res.status(401).json("UNAUTHORIZED");
  }

  return res.sendStatus(201);
}

export async function logOutController(req: Request, res: Response) {
  const refreshToken = req.cookies.refreshToken!;

  await authService.logOutUser(refreshToken);

  return res.status(200).json("Successfully logged out");
}

export async function refreshTokenController(req: Request, res: Response) {
  const refreshToken = req.cookies.refreshToken!;

  const tokens = await authService.refreshUserTokens(refreshToken);
  setAuthCookies(res, tokens);

  return res.sendStatus(200);
}
