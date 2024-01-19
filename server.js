import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import userRoute from "./src/routes/UserRouter/userRoute.js";
import cartRoute from "./src/routes/CartRouter/cartRoute.js";
import authRoute from "./src/routes/AuthRouter/authRoute.js";

const PORT = dotenv.config(process.cwd, ".env").parsed.PORT;
const MONGODB_ULI = dotenv.config(process.cwd, ".env").parsed.MONGODB_URI;

console.log(PORT);

const app = express()

mongoose.connect(MONGODB_ULI)
  .then(() => {
    console.log("Database is connected successfully")
  })
  .catch((error) => {
    console.log(error.message)
  })

app.use("/api/v1/user", userRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/auth", authRoute)

app.listen(PORT, () => {
  console.log(`Server is running on port : ${PORT}`)
})
