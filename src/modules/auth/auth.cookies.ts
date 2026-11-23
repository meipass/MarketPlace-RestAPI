import { ACCESS_COOKIE_OPTIONS, REFRESH_COOKIE_OPTIONS } from "#app/config";
import type { Tokens } from "#app/interfaces/tokens/tokens.type";
import type { Response } from "express";

export function setAuthCookies(res: Response, tokens: Tokens) {
  res.cookie("accessToken", tokens.access, ACCESS_COOKIE_OPTIONS);
  res.cookie("refreshToken", tokens.refresh, REFRESH_COOKIE_OPTIONS);
}
