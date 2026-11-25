import { Router } from "express";

import * as productController from "./product.controller.js";
import * as productMiddleware from "./product.middleware.js";

import {
  create as createReviewMiddleware,
  getByProductId as getByProductIdMiddleware,
} from "#app/modules/reviews/reviews.middleware";

import {
  create as createReviewController,
  getByProductId as getByProductIdController,
} from "#app/modules/reviews/reviews.controller";

import { requireAuth } from "#app/shared/middlewares/requireAuth.middleware";

const router = Router();

router.use(requireAuth);

router.post("/:id/reviews", createReviewMiddleware, createReviewController);
router.get("/:id/reviews", getByProductIdMiddleware, getByProductIdController);

router.get(
  "/:id",
  productMiddleware.getProductMiddleware,
  productController.getProductController,
);

router.get(
  "/",
  productMiddleware.getProductsMiddleware,
  productController.getProductsController,
);

router.post(
  "/",
  productMiddleware.createProductMiddleware,
  productController.createProductController,
);

router.patch(
  "/:id",
  productMiddleware.changeProductMiddleware,
  productController.changeProductController,
);

router.put(
  "/:id",
  productMiddleware.changeProductStockMiddleware,
  productController.changeProductStockController,
);

router.delete(
  "/:id",
  productMiddleware.deleteProductMiddleware,
  productController.deleteProductController,
);

export default router;
