import { Router } from "express";

import UserAuthentication from "../middlewares/UserAuthentication.js";

import getUser from "../controllers/userControllers/getUser.js";
import updateUser from "../controllers/userControllers/updateUser.js";
import { addUserImage } from "../controllers/userControllers/addUserImage.js";
import ExpressFormidable from "express-formidable";
import doesUserExist from "../controllers/userControllers/doesUserExist.js";
// import updateFirebaseUser from "../controllers/userControllers/updateFirebaseUser.js";

const userRoute = Router();

userRoute.get("/", UserAuthentication, getUser);
userRoute.put("/", UserAuthentication, updateUser);
userRoute.post("/exists", doesUserExist);
// userRoute.put("/firebase", updateFirebaseUser);
userRoute.post(
  "/image",
  ExpressFormidable({
    multiples: false,
  }),
  UserAuthentication,
  addUserImage
);

export default userRoute;
