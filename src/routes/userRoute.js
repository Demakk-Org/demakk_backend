import { Router } from "express";
import UserAuthentication from "../middlewares/UserAuthentication.js";

import getUser from "../controllers/userControllers/getUser.js";
// import updateAddress from "../controllers/userControllers/updateAddress.js";
import updateUser from "../controllers/userControllers/updateUser.js";

const userRoute = Router();

userRoute.get("/", UserAuthentication, getUser);
// userRoute.put("/address", UserAuthentication, updateAddress);
userRoute.put("/", UserAuthentication, updateUser);

export default userRoute;
