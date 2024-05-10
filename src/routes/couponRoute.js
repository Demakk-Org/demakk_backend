import { Router } from "express";

import AdminAuthentication from "../middlewares/AdminAuthentication.js";

import { addCoupon } from "../controllers/couponControllers/addCoupon.js";
import { updateCoupon } from "../controllers/couponControllers/updateCoupon.js";
import { deleteCoupon } from "../controllers/couponControllers/deleteCoupon.js";
import { getCoupon } from "../controllers/couponControllers/getCoupon.js";
import { getCoupons } from "../controllers/couponControllers/getCoupons.js";

const couponRoute = Router();

couponRoute.get("/:id", AdminAuthentication, getCoupon);
couponRoute.get("/", AdminAuthentication, getCoupons);
couponRoute.post("/", AdminAuthentication, addCoupon);
couponRoute.put("/", AdminAuthentication, updateCoupon);
couponRoute.delete("/", AdminAuthentication, deleteCoupon);

export { couponRoute };
