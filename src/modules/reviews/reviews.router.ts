import { Router } from "express";
import { requireAuth } from "#app/shared/middlewares/requireAuth.middleware";

import * as reviewMiddleware from "./reviews.middleware.js";
import * as reviewController from "./reviews.controller.js";

const router = Router();
router.use(requireAuth);

router.delete("/:reviewId", reviewMiddleware.remove, reviewController.remove);

export default router;
