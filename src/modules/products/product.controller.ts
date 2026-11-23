import type { Response, Request } from "express";
import type { QueryFilter } from "#app/interfaces/search/queryFilter.type";

import * as productService from "./product.service.js";

export async function createProductController(req: Request, res: Response) {
  const { title, description, price, stock } = req.body;

  const product = await productService.create(
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
  const products = await productService.getMany(queryFilter);

  return res.status(200).json({
    status: "success",
    products,
  });
}

export async function getProductController(req: Request, res: Response) {
  const id = Number(req.params.id);

  const product = await productService.get(id);
  if (!product) {
    return res.status(404).json("Invalid product id");
  }

  return res.status(200).json(product);
}

export async function changeProductController(req: Request, res: Response) {
  const productId = Number(req.params.id);
  const { title, description, price, stock } = req.body;

  const changedProduct = await productService.change(
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

  return res.status(200).json({
    status: "success",
    changedProduct,
  });
}

export async function deleteProductController(req: Request, res: Response) {
  const productId = Number(req.params.id);

  const isDeleted = await productService.remove(productId, req.userId!);
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

export async function changeProductStockController(
  req: Request,
  res: Response,
) {
  const productId = Number(req.params.id);
  const newStock = Number(req.body.newStock);

  await productService.changeStock(req.userId!, productId, newStock);

  return res.status(200).json({
    status: "success",
    message: "SUCCESSFULLY_CHANGED_PRODUCT_STOCK",
  });
}
