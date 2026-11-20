import { Router } from "express";
import {
  changeProductController,
  createProductController,
  deleteProductController,
  getProductController,
  getProductsController,
} from "./product.controller.js";
import { getProductsMiddleware } from "./product.middleware.js";

const router = Router();

router.get("/:id", getProductController);
router.get("/", getProductsMiddleware, getProductsController);
router.post("/", requireAuth, createProductController);
router.patch("/:id", requireAuth, changeProductController);
router.delete("/:id", requireAuth, deleteProductController);

export default router;
