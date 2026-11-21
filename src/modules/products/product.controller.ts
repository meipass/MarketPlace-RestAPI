import type { Response, Request } from "express";
import type { QueryFilter } from "#app/interfaces/queryFilter.type";
import * as productService from "./product.service.js";

export async function createProductController(req: Request, res: Response) {
  const { title, description, price, stock } = req.body;

  const product = await productService.createProduct(
    req.userId!,
    title,
    description,
    price,
    stock,
  );

  return res.status(201).json(product);
}

export async function getProductsController(req: Request, res: Response) {
  const queryFilter = res.locals.productFilters as QueryFilter;
  const products = await productService.getProducts(queryFilter);

  return res.status(200).json({
    status: "success",
    products,
  });
}

export async function getProductController(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!id || Number.isNaN(id) || id <= 0) {
    return res.status(400).json("Incorrect id");
  }

  const product = await productService.getProduct(id);
  if (!product) {
    return res.status(404).json("Invalid product id");
  }

  return res.status(200).json(product);
}

export async function changeProductController(req: Request, res: Response) {
  const productId = Number(req.params.id);
  if (!productId) {
    return res.status(400).json("Incorrect product id");
  }

  if (productId < 0) {
    return res.status(400).json("Incorrect product id");
  }

  if (!Number.isInteger(productId)) {
    return res.status(400).json("Incorrect product id");
  }

  const { title, description, price, stock } = req.body;

  const changedProduct = await productService.changeProduct(
    productId,
    req.userId!,
    title,
    description,
    price,
    stock,
  );

  if (!changedProduct) {
    res.status(500).json({
      status: "error",
      message: "UNKNOWN_SERVER_ERROR",
    });
    return;
  }

  return res.json(changedProduct);
}

export async function deleteProductController(req: Request, res: Response) {
  const productId = Number(req.params.id);
  if (!productId) {
    return res.status(400).json("Incorrect product id");
  }

  const isDeleted = await productService.deleteProduct(productId, req.userId!);
  if (!isDeleted) {
    res.status(500).json({
      status: "error",
      message: "UNKNOWN_SERVER_ERROR",
    });
    return;
  }

  return res.status(200).json({
    status: "success",
    message: "SUCCESSFULLY_DELETED_PRODUCT",
  });
}
