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

export async function changePasswordController(req: Request, res: Response) {
  const userId = req.userId!;
  const { oldPassword, newPassword } = req.body;

  const isChanged = await userService.changePassword(
    userId,
    oldPassword,
    newPassword,
  );
  if (!isChanged) {
    res.status(409).json({
      status: "error",
      message: "PASSWORD_CHANGE_CONFLICT",
    });

    return;
  }

  return res.status(200).json({
    status: "success",
    message: "PASSWORD_CHANGE_SUCCESS",
  });
}
