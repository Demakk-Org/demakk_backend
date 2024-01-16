
import express, { Router } from "express";
import getUser from "../../controllers/userControllers/getUser.js";
import addUser from "../../controllers/userControllers/addUser.js";

const userRoute = Router()

userRoute.use(express.json())

userRoute.get('/:id', getUser)
userRoute.post('/add', addUser)

export default userRoute