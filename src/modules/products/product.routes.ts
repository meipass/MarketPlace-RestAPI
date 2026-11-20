import { Router } from "express";
import {
  changeProductController,
  createProductController,
  deleteProductController,
  getProductController,
  getProductsController,
} from "./product.controller.js";
import { getProductsMiddleware } from "./product.middleware.js";
import { requireAuth } from "#app/shared/middlewares/requireAuth.middleware";

const router = Router();

router.use(requireAuth);

router.get("/:id", getProductController);
router.get("/", getProductsMiddleware, getProductsController);
router.post("/", createProductController);
router.patch("/:id", changeProductController);
router.delete("/:id", deleteProductController);

export default router;
