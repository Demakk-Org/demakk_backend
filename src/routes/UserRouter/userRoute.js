
import { Router } from "express";
import getUser from "../../controllers/userControllers/getUser.js";

const userRoute = Router()

userRoute.get('/', getUser)

export default userRoute