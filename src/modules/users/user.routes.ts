import { Router } from "express";

import { requireAuth } from "#app/shared/middlewares/requireAuth.middleware";
import { changePasswordMiddleware } from "./user.middleware.js";

import {
  changePasswordController,
  getMyProfileController,
} from "./user.controller.js";

const router = Router();

router.get("/me", requireAuth, getMyProfileController);
router.put(
  "/me/password",
  requireAuth,
  changePasswordMiddleware,
  changePasswordController,
);

export default router;
