import { Router } from "express";
import { requireAuth } from "#app/shared/middlewares/requireAuth.middleware";

import * as userMiddleware from "./user.middleware.js";
import * as userController from "./user.controller.js";

const router = Router();

router.get("/me", requireAuth, userController.getMyProfile);

router.put(
  "/me/password",
  requireAuth,
  userMiddleware.changePassword,
  userController.changePassword,
);

router.put(
  "/me/email",
  requireAuth,
  userMiddleware.changeEmail,
  userController.changeEmail,
);

router.put(
  "/me/login",
  requireAuth,
  userMiddleware.changeLogin,
  userController.changeLogin,
);

export default router;
