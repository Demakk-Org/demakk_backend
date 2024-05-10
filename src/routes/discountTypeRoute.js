import { Router } from "express";

import AdminAuthentication from "../middlewares/AdminAuthentication.js";

import { addDiscountType } from "../controllers/discountTypeControllers/addDiscountType.js";
// import { updateDiscountType } from "../controllers/discountTypeControllers/updateDiscountType.js";
import { deleteDiscountType } from "../controllers/discountTypeControllers/deleteDiscountType.js";

export const discountTypeRoute = Router();

discountTypeRoute.post("/", AdminAuthentication, addDiscountType);
// discountTypeRoute.put("/", AdminAuthentication, updateDiscountType);
discountTypeRoute.delete("/", AdminAuthentication, deleteDiscountType);
