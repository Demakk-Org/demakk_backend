import { Router } from "express";
import { addOrder } from "../controllers/orderControllers/addOrder.js";
import UserAuthentication from "../middlewares/UserAuthentication.js";
import { updateOrder } from "../controllers/orderControllers/updateOrder.js";
import { getOrder } from "../controllers/orderControllers/getOrder.js";
import { getOrders } from "../controllers/orderControllers/getOrders.js";

const orderRoute = Router();

orderRoute.get("/", UserAuthentication, getOrder);
orderRoute.get("/orders", UserAuthentication, getOrders);
orderRoute.post("/", UserAuthentication, addOrder);
orderRoute.put("/", UserAuthentication, updateOrder);

export { orderRoute };
