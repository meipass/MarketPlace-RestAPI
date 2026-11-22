import express from "express";
import "dotenv/config";

import { errorHandler } from "#app/modules/appError/appError.controller.js";

import authRoutes from "#app/modules/auth/auth.routes";
import productRoutes from "#app/modules/products/product.routes";
import userRoutes from "#app/modules/users/user.routes";

const PORT = process.env.PORT;

const app = express();

app.use(errorHandler);
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`MarketPlace API is started on port ${PORT}`);
});
