import type { PaginatedResult } from "../interfaces/paginatedResult.interface.js";
import type { Product } from "../interfaces/product.interface.js"
import * as productRepository from "../repositories/product.repository.js"

export async function createProduct(sellerId: number, title: string, description: string, price: number, stock: number): Promise<Product | null> {
    return await productRepository.createProduct(sellerId, title, description, price, stock)
}

export async function getProducts(page?: number, limit?: number): Promise<PaginatedResult<Product>> {
    return await productRepository.getProducts(page, limit)
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
        throw new Error("Invalid product id")
    }

    const isOwner = product.sellerId === userId
    if (!isOwner) {
        throw new Error("Trying to change an product without ownership")
    }

    const updatedProduct = await productRepository.changeProduct(id, title, description, price, stock)

    return updatedProduct
}

export async function deleteProduct(id: number, userId: number) {
    const product = await getProduct(id)
    if (!product) {
        throw new Error("Invalid product id")
    }

    const isOwner = product.sellerId === userId
    if (!isOwner) {
        throw new Error("Trying to change an product without ownership")
    }

    await productRepository.deleteProduct(id)
}
