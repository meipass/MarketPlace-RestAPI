import express from "express"
import "dotenv/config"

import { authMiddleware, registerMiddleware } from "./middlewares/auth.middleware.js"

import { registerController, logOutController, loginController } from "./controllers/auth.controller.js"
import { refreshTokenController } from "./controllers/tokenRefresh.controller.js"
import { getMyProfileController } from "./controllers/profile.controller.js";
import { changeProductController, createProductController, deleteProductController, getProductController, getProductsController } from "./controllers/product.controller.js";
import { errorHandler } from "./controllers/errorHandler.js";

const PORT = process.env.PORT

const app = express()
app.use(express.json())

app.post("/auth/register", registerMiddleware, registerController)
app.post("/auth/login", registerMiddleware, loginController)
app.post("/auth/refresh", refreshTokenController)
app.post("/auth/logout", logOutController)

app.get("/products/:id", getProductController)
app.get("/products", getProductsController)
app.post("/products", authMiddleware, createProductController)
app.patch("/products/:id", authMiddleware, changeProductController)
app.delete("/products/:id", authMiddleware, deleteProductController)

app.get("/users/me", authMiddleware, getMyProfileController)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`MarketPlace API is started on port ${PORT}`)
})
