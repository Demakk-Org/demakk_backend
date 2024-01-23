import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import userRoute from "./src/routes/UserRouter/userRoute.js";
import cartRoute from "./src/routes/CartRouter/cartRoute.js";
import authRoute from "./src/routes/AuthRouter/authRoute.js";
import adminRoute from "./src/routes/AdminRouter/adminRoute.js";
import { stockTypeRoute } from "./src/routes/StockTypeRouter/stockTypeRoute.js";
import { stockItemRoute } from "./src/routes/StockItemRouter/stockItemRoute.js";
import { productCategoryRoute } from "./src/routes/ProductCategoryRouter/ProductCategoryRoute.js";
import { productRoute } from "./src/routes/ProductRouter/ProductRoute.js";

const PORT = dotenv.config(process.cwd, ".env").parsed.PORT;
const MONGODB_ULI = dotenv.config(process.cwd, ".env").parsed.MONGODB_URI;

console.log(PORT);

const app = express();
app.use(express.json());

mongoose
  .connect(MONGODB_ULI)
  .then(() => {
    console.log("Database is connected successfully");
  })
  .catch((error) => {
    console.log(error.message);
  });

app.use("/api/v1/user", userRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/stockItem", stockItemRoute);
app.use("/api/v1/stockType", stockTypeRoute);
app.use("/api/v1/productCategory", productCategoryRoute);
app.use("/api/v1/product", productRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port : ${PORT}`);
});
