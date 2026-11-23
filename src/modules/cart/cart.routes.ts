import { Router } from "express";
import { requireAuth } from "#app/shared/middlewares/requireAuth.middleware";

import * as cartMiddleware from "./cart.middleware.js";
import * as cartController from "./cart.controller.js";

const router = Router();

router.use(requireAuth);

router.get(
  "/",
  cartMiddleware.getCartItemsMiddleware,
  cartController.getCartItemsController,
);

export default router;
