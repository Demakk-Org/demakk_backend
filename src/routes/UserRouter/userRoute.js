
import { Router } from "express";
import getUser from "../../controllers/userControllers/getUser.js";
import addUser from "../../controllers/userControllers/addUser.js";

const userRoute = Router()

userRoute.get('/:id', getUser)
userRoute.post('/add', addUser)

export default userRoute