export interface Product {
    id: number, // auto assign
    price: number,
    sellerId: number, // req.user.userId
    title: string,
    description: string,
    createdAt: Date,
    updatedAt: Date,
    stock: number
}
