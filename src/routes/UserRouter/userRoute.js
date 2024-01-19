
import express, { Router } from "express";
import getUser from "../../controllers/userControllers/getUser.js";
import addUser from "../../controllers/userControllers/addUser.js";
import loginUser from "../../controllers/userControllers/loginUser.js";
import registerUser from "../../controllers/userControllers/registerUser.js";

const userRoute = Router()

userRoute.use(express.json())

userRoute.get('/:id', getUser)
userRoute.post('/add', addUser)
userRoute.post('/register', registerUser)
userRoute.post('/login', loginUser)

export default userRoute