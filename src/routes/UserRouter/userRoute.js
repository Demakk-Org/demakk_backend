import express, { Router } from "express";

import getUser from "../../controllers/userControllers/getUser.js";
import requestResetPassword from "../../controllers/authControllers/requestResetPassword.js";
import resetPassword from "../../controllers/authControllers/resetPassword.js";
import addAddress from "../../controllers/userControllers/addAndSetAddress.js";

const userRoute = Router();

userRoute.use(express.json());

userRoute.get("/:id", getUser);
userRoute.post("/requestResetPassword/:id", requestResetPassword);
userRoute.post("/resetPassword", resetPassword);
userRoute.post("/addAndSetAddress", addAddress)

export default userRoute;