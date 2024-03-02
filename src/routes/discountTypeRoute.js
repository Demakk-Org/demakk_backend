import { Router } from "express";
import { addDiscount } from "../controllers/discountTypecontrollers/addDiscount.js";

export const discountTypeRoute = Router();

discountTypeRoute.get("/:name", addDiscount);
