import { Router } from "express";
import {
  loginController,
  logOutController,
  refreshTokenController,
  registerController,
} from "./auth.controller.js";
import { loginMiddleware, registerMiddleware } from "./auth.middleware.js";

const router = Router();

router.post("/register", registerMiddleware, registerController);
router.post("/login", loginMiddleware, loginController);
router.post("/refresh", refreshTokenController);
router.post("/logout", logOutController);

export default router;
