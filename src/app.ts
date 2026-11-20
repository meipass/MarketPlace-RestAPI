import express from "express";
import "dotenv/config";
import { errorHandler } from "./modules/appError/appError.controller.js";

const PORT = process.env.PORT;

const app = express();

app.use(errorHandler);
app.use(express.json());

app.get("/users/me", authMiddleware, getMyProfileController);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`MarketPlace API is started on port ${PORT}`);
});
