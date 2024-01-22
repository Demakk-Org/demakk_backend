import { Router } from "express";

import sendVerification from "../../controllers/authControllers/sendVerification.js";
import veriftyOTP from "../../controllers/authControllers/veriftyOTP.js";
import loginUser from "../../controllers/authControllers/loginUser.js";
import registerUser from "../../controllers/authControllers/registerUser.js";

const authRoute = Router()

authRoute.post('/sendVerification', sendVerification)
authRoute.post('/verifyOTP', veriftyOTP)
authRoute.post("/", registerUser);
authRoute.post("/login", loginUser);


export default authRoute;