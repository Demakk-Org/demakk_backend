import { Router } from "express";

import AdminAuthentication from "../middlewares/AdminAuthentication.js";

import { addDiscountType } from "../controllers/discountTypecontrollers/addDiscountType.js";
import { updateDiscountType } from "../controllers/discountTypecontrollers/updateDiscountType.js";
import { deleteDiscountType } from "../controllers/discountTypecontrollers/deleteDiscountType.js";

export const discountTypeRoute = Router();

discountTypeRoute.post("/", AdminAuthentication, addDiscountType);
discountTypeRoute.put("/", AdminAuthentication, updateDiscountType);
discountTypeRoute.delete("/", AdminAuthentication, deleteDiscountType);
