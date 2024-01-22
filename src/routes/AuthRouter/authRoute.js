import { Router } from "express";

import sendVerification from "../../controllers/authControllers/sendVerification.js";
import veriftyOTP from "../../controllers/authControllers/veriftyOTP.js";
import loginUser from "../../controllers/authControllers/loginUser.js";
import registerUser from "../../controllers/authControllers/registerUser.js";
import requestResetPassword from "../../controllers/authControllers/requestResetPassword.js";
import resetPassword from "../../controllers/authControllers/resetPassword.js";

const authRoute = Router()

authRoute.post('/sendVerification', sendVerification)
authRoute.post('/verifyOTP', veriftyOTP)
authRoute.post("/", registerUser);
authRoute.post("/login", loginUser);
authRoute.post("/requestResetPassword/:id", requestResetPassword);
authRoute.post("/resetPassword", resetPassword);

export default authRoute;