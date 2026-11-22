import type { Response, Request } from "express";
import * as userService from "./user.service.js";

export async function getMyProfileController(req: Request, res: Response) {
  const userId = req.userId!;

  const user = await userService.getMyProfile(userId);
  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "INVALID_USER",
    });
  }

  return res.status(200).json({
    status: "success",
    user,
  });
}
