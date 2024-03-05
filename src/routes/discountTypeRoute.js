import { Router } from "express";
import { addDiscount } from "../controllers/discountTypecontrollers/addDiscount.js";
import AdminAuthentication from "../middlewares/AdminAuthentication.js";
import { updateDiscount } from "../controllers/discountTypecontrollers/updateDiscountType.js";
import { deleteDiscount } from "../controllers/discountTypecontrollers/deleteDiscount.js";

export const discountTypeRoute = Router();

discountTypeRoute.post("/", AdminAuthentication, addDiscount);
discountTypeRoute.put("/", AdminAuthentication, updateDiscount);
discountTypeRoute.delete("/", AdminAuthentication, deleteDiscount);
