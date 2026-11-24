import type { Request, Response } from "express";

import * as cartService from "./cart.service.js";

export async function getCartItemsController(req: Request, res: Response) {
  // TODO: Add pagination
  const items = await cartService.getItems(req.userId!);

  return res.status(200).json({
    status: "success",
    items,
  });
}
