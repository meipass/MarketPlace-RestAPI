import * as tokenService from "#app/modules/tokens/tokens.service";
import type { Response, Request, NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const accessToken = req.cookies?.accessToken;
  if (!accessToken) {
    res.status(401).json({
      status: "error",
      message: "UNAUTHORIZED",
    });
    return;
  }

  const payload = tokenService.verifyAccessToken(accessToken);
  req.userId = payload.userId;

  next();
}
