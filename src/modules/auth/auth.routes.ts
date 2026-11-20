import { Router } from "express";
import {
  loginController,
  logOutController,
  registerController,
} from "./auth.controller.js";
import { refreshTokenController } from "#app/controllers/tokenRefresh.controller";
import { loginMiddleware, registerMiddleware } from "./auth.middleware.js";

const router = Router();

router.post("/auth/register", registerMiddleware, registerController);
router.post("/auth/login", loginMiddleware, loginController);
router.post("/auth/refresh", refreshTokenController);
router.post("/auth/logout", logOutController);

export default router;
