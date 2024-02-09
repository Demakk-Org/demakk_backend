import { Router } from "express";
import { addOrderItem } from "../controllers/orderItemControllers/addOrderItem.js";
import UserAuthentication from "../middlewares/UserAuthentication.js";

const orderItemRoute = Router();

orderItemRoute.post("/", UserAuthentication, addOrderItem);

export { orderItemRoute };
