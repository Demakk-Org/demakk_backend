import { Router } from "express";

import AdminAuthentication from "../middlewares/AdminAuthentication.js";

import addDiscount from "../controllers/discountControllers/addDiscount.js";
import deleteDiscount from "../controllers/discountControllers/deleteDiscount.js";
import updateDiscount from "../controllers/discountControllers/updateDiscount.js";

const discountRoute = Router();

discountRoute.post("/", AdminAuthentication, addDiscount);
discountRoute.delete("/", AdminAuthentication, deleteDiscount);
discountRoute.put("/", AdminAuthentication, updateDiscount);

export default discountRoute;
