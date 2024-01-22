import express, { Router } from "express";

import getUser from "../../controllers/userControllers/getUser.js";
import addAddress from "../../controllers/userControllers/addAndSetAddress.js";
import updateAddress from "../../controllers/userControllers/updateAddress.js";

const userRoute = Router();

userRoute.get("/", getUser);
userRoute.post("/addAndSetAddress", addAddress)
userRoute.put("/address",updateAddress)

export default userRoute;