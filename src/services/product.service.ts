import type { PaginatedResult } from "../interfaces/paginatedResult.interface.js";
import type { Product } from "../interfaces/product.interface.js"
import { AppError } from "../errors/AppError.js"
import * as productRepository from "../repositories/product.repository.js"
import type { QueryFilter } from "../interfaces/queryFilter.interface.js";

export async function createProduct(sellerId: number, title: string, description: string, price: number, stock: number): Promise<Product | null> {
    return await productRepository.createProduct(sellerId, title, description, price, stock)
}

export async function getProducts(filters: QueryFilter): Promise<PaginatedResult<Product>> {
    return await productRepository.getProducts(filters)
}

export async function getProduct(id: number): Promise<Product | null> {
    return await productRepository.getProduct(id)
}

export async function getProductOwner(id: number): Promise<number | null> {
    return await productRepository.getProductOwner(id)
}

export async function changeProduct(id: number, userId: number, title?: string, description?: string, price?: number, stock?: number): Promise<Product | null> {
    const product = await getProduct(id)
    if (!product) {
        throw new AppError("Invalid product id", 400)
    }

    console.log(product.sellerId, userId, product)
    const isOwner = product.sellerId === userId
    if (!isOwner) {
        throw new AppError("Trying to change an product without ownership", 403)
    }

    const updatedProduct = await productRepository.changeProduct(id, title, description, price, stock)

    return updatedProduct
}

export async function deleteProduct(id: number, userId: number) {
    const product = await getProduct(id)
    if (!product) {
        throw new AppError("Invalid product id", 400)
    }

    const isOwner = product.sellerId === userId
    if (!isOwner) {
        throw new AppError("Trying to change an product without ownership", 403)
    }

    await productRepository.deleteProduct(id)
}
