import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import userRoute from "./src/routes/userRoute.js";
import cartRoute from "./src/routes/cartRoute.js";
import authRoute from "./src/routes/authRoute.js";
import adminRoute from "./src/routes/adminRoute.js";
import { stockTypeRoute } from "./src/routes/stockTypeRoute.js";
import { stockItemRoute } from "./src/routes/stockItemRoute.js";
import { productCategoryRoute } from "./src/routes/ProductCategoryRoute.js";
import { productRoute } from "./src/routes/ProductRoute.js";
import { addressRoute } from "./src/routes/addressRoute.js";
import { faker } from "@faker-js/faker";
import { Product } from "./src/models/productSchema.js";
import { orderItemRoute } from "./src/routes/orderItemRoute.js";
import { orderRoute } from "./src/routes/orderRoute.js";
import { searchRoute } from "./src/routes/searchRoute.js";
import { couponRoute } from "./src/routes/couponRoute.js";
import { stockVarietyTypeRoute } from "./src/routes/stockVarietyTypeRoute.js";
import { stockVarietyRoute } from "./src/routes/stockVarietyRoute.js";
import responsse from "./responsse.js";
import { discountTypeRoute } from "./src/routes/discountTypeRoute.js";

// const cors = require('cors')
import cors from "cors";
import dealTypeRoute from "./src/routes/dealTypeRoute.js";
import dealRoute from "./src/routes/dealRoute.js";
import discountRoute from "./src/routes/discountRoute.js";
// import bcrypt from "bcryptjs";

const PORT = dotenv.config(process.cwd, ".env").parsed.PORT;
const MONGODB_ULI = dotenv.config(process.cwd, ".env").parsed.MONGODB_URI;

console.log(PORT);

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
  })
);

mongoose
  .connect(MONGODB_ULI)
  .then(() => {
    console.log("Database is connected successfully");
  })
  .catch((error) => {
    console.log(error.message);
  });

app.use("/api/v1/user", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/address", addressRoute);
app.use("/api/v1/stockType", stockTypeRoute);
app.use("/api/v1/stockItem", stockItemRoute);
app.use("/api/v1/productCategory", productCategoryRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/orderItem", orderItemRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/search", searchRoute);
app.use("/api/v1/coupon", couponRoute);
app.use("/api/v1/stockVarietyType", stockVarietyTypeRoute);
app.use("/api/v1/stockVariety", stockVarietyRoute);
app.use("/api/v1/discountType", discountTypeRoute);
app.use("/api/v1/dealType", dealTypeRoute);
app.use("/api/v1/deal", dealRoute);
app.use("/api/v1/discount", discountRoute);

app.get("/addProducts", async (req, res) => {
  function createRandomProduct() {
    return {
      name: { en: faker.commerce.productName() },
      description: { en: faker.commerce.productDescription() },
      productCategory: new mongoose.Types.ObjectId(),
      tags: faker.helpers.multiple(faker.commerce.productMaterial),
      price: faker.commerce.price({ min: 100, max: 10000 }),
    };
  }

  const Products = faker.helpers.multiple(createRandomProduct, {
    count: 20,
  });

  console.log(Products);

  Product.create(Products).then((products) => {
    return res.json(products);
  });
});

app.get("/", (req, res) => {
  res.send("Hello, this is demakk your most trusted ecommerce site");
});

app.listen(PORT, () => {
  console.log(`Server is running on port : ${PORT}`);
});

console.log(responsse["en"].response["common"]["203"]);

export { app };

// console.log(await bcrypt.hash("Melka7141", 10));
// 11128847;
