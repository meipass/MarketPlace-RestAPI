import { Router } from "express";
import { registerMiddleware } from "../../shared/middlewares/requireAuth.middleware.js";
import {
  loginController,
  logOutController,
  registerController,
} from "./auth.controller.js";
import { refreshTokenController } from "../../controllers/tokenRefresh.controller.js";

const router = Router();

router.post("/auth/register", registerMiddleware, registerController);
router.post("/auth/login", registerMiddleware, loginController);
router.post("/auth/refresh", refreshTokenController);
router.post("/auth/logout", logOutController);

export default router;
