import { Router } from "express";

import {
  loginController,
  logOutController,
  refreshTokenController,
  registerController,
} from "./auth.controller.js";

import {
  loginMiddleware,
  logOutMiddleware,
  refreshTokenMiddleware,
  registerMiddleware,
} from "./auth.middleware.js";

const router = Router();

router.post("/register", registerMiddleware, registerController);
router.post("/login", loginMiddleware, loginController);
router.post("/refresh", refreshTokenMiddleware, refreshTokenController);
router.post("/logout", logOutMiddleware, logOutController);

export default router;
