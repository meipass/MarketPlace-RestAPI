import { Router } from "express";

import {
  changeProductController,
  createProductController,
  deleteProductController,
  getProductController,
  getProductsController,
} from "./product.controller.js";

import {
  createProductMiddleware,
  getProductMiddleware,
  getProductsMiddleware,
} from "./product.middleware.js";

import { requireAuth } from "#app/shared/middlewares/requireAuth.middleware";

const router = Router();

router.use(requireAuth);

router.get("/:id", getProductMiddleware, getProductController);
router.get("/", getProductsMiddleware, getProductsController);
router.post("/", createProductMiddleware, createProductController);
router.patch("/:id", changeProductController);
router.delete("/:id", deleteProductController);

export default router;
