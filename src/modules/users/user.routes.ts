import { Router } from "express";

import { requireAuth } from "#app/shared/middlewares/requireAuth.middleware";

import { getMyProfileMiddleware } from "./user.middleware.js";
import { getMyProfileController } from "./user.controller.js";

const router = Router();

router.get("/me", requireAuth, getMyProfileMiddleware, getMyProfileController);

export default router;
