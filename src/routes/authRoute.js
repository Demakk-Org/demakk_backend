import { Router } from "express";

import UserAuthentication from "../middlewares/UserAuthentication.js";

import sendVerification from "../controllers/authControllers/sendVerification.js";
import veriftyOTP from "../controllers/authControllers/veriftyOTP.js";
import loginUser from "../controllers/authControllers/loginUser.js";
import registerUser from "../controllers/authControllers/registerUser.js";
import requestResetPassword from "../controllers/authControllers/requestResetPassword.js";
import resetPassword from "../controllers/authControllers/resetPassword.js";
import changePassword from "../controllers/authControllers/changePassword.js";

const authRoute = Router();

authRoute.post("/sendVerification", UserAuthentication, sendVerification);
authRoute.post("/verifyOTP", veriftyOTP);
authRoute.post("/", registerUser);
authRoute.post("/login", loginUser);
authRoute.post("/requestResetPassword", requestResetPassword);
authRoute.post("/resetPassword", resetPassword);
authRoute.post("/changePassword", UserAuthentication, changePassword);

export default authRoute;
