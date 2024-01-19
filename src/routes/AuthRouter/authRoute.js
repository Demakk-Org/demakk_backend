import { Router } from "express";
import getUserByEmail from "../../controllers/authControllers/getUserByEmail.js";
import sendVerification from "../../controllers/authControllers/sendVerification.js";
import veriftyOTP from "../../controllers/authControllers/veriftyOTP.js";

const authRoute = Router()

authRoute.get('/getUserByEmail', getUserByEmail)
authRoute.post('/sendVerification', sendVerification)
authRoute.post('/verifyOTP', veriftyOTP)


export default authRoute;