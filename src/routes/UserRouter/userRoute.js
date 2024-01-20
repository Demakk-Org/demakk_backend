import express, { Router } from "express";

import getUser from "../../controllers/userControllers/getUser.js";
import loginUser from "../../controllers/userControllers/loginUser.js";
import registerUser from "../../controllers/userControllers/registerUser.js";
import requestResetPassword from "../../controllers/authControllers/requestResetPassword.js";
import resetPassword from "../../controllers/authControllers/resetPassword.js";

const userRoute = Router();

userRoute.use(express.json());

userRoute.get("/:id", getUser);
userRoute.post("/", registerUser);
userRoute.post("/login", loginUser);
userRoute.post("/requestResetPassword/:id", requestResetPassword);
userRoute.post("/resetPassword", resetPassword);

export default userRoute;