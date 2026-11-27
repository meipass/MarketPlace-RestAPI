import express from "express";
import cookieParser from "cookie-parser";

import "dotenv/config";

import { errorHandler } from "#app/modules/appError/appError.controller";

import authRoutes from "#app/modules/auth/auth.routes";
import productRoutes from "#app/modules/products/product.routes";
import userRoutes from "#app/modules/users/user.routes";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/users", userRoutes);

app.use(errorHandler);

export default app;
