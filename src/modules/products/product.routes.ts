import { Router } from "express";

import * as productController from "./product.controller.js";
import * as productMiddleware from "./product.middleware.js";

import { requireAuth } from "#app/shared/middlewares/requireAuth.middleware";

const router = Router();

router.use(requireAuth);

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
