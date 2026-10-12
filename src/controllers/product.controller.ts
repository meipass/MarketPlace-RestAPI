import type { Response, Request } from "express"
import * as productService from "../services/product.service.js"

export async function createProductController(req: Request, res: Response) {
    if (!req.user) {
        return res.status(401).json("Unauthorized")
    }

    const { title, description, price, stock } = req.body

    const product = await productService.createProduct(req.user.userId, title, description, price, stock)

    return res.status(201).json(product)
}

export async function getProductsController(req: Request, res: Response) {
    const page = Number(req.query.page)
    const limit = Number(req.query.limit)

    if (Number.isNaN(page) || page <= 0 || Number.isNaN(limit) || limit <= 0) {
        return res.status(400).json("Incorrect page or limit")
    }

    const products = await productService.getProducts(page, limit)

    return res.json(products)
}

export async function getProductController(req: Request, res: Response) {
    const id = Number(req.params.id)
    if (!id || Number.isNaN(id) || id <= 0) {
        return res.status(400).json("Incorrect id")
    }

    const product = await productService.getProduct(id)
    if (!product) {
        return res.status(404).json("Invalid product id")
    }

    return res.status(200).json(product)
}

export async function changeProductController(req: Request, res: Response) {
    const userId = req.user?.userId
    if (!userId) {
        return res.status(400).json("Incorrect access token")
    }
    
    const productId = Number(req.params.id)
    if (!productId) {
        return res.status(400).json("Incorrect product id")
    }

    if (productId < 0) {
        return res.status(400).json("Incorrect product id")
    }

    const { title, description, price, stock } = req.body

    const changedProduct = await productService.changeProduct(productId, userId, title, description, price, stock)

    return res.json(changedProduct)
}

export async function deleteProductController(req: Request, res: Response) {
    const userId = req.user?.userId
    if (!userId) {
        return res.status(400).json("Incorrect access token")
    }
    
    const productId = Number(req.params.id)
    if (!productId) {
        return res.status(400).json("Incorrect product id")
    }

    await productService.deleteProduct(productId, userId)

    return res.status(200).json("Successfully deleted")
}
