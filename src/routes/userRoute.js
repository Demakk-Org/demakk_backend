import { Router } from "express";

import UserAuthentication from "../middlewares/UserAuthentication.js";

import getUser from "../controllers/userControllers/getUser.js";
import updateUser from "../controllers/userControllers/updateUser.js";
import { updateUserImage } from "../controllers/userControllers/updateUserImage.js";
import doesUserExist from "../controllers/userControllers/doesUserExist.js";

const userRoute = Router();

userRoute.get("/", UserAuthentication, getUser);
userRoute.put("/", UserAuthentication, updateUser);
userRoute.post("/exists", doesUserExist);
userRoute.post("/image", UserAuthentication, updateUserImage);

export default userRoute;
