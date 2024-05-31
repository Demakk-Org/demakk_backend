import { Router } from "express";

import UserAuthentication from "../middlewares/UserAuthentication.js";

import { addOrder } from "../controllers/orderControllers/addOrder.js";
import { updateOrder } from "../controllers/orderControllers/updateOrder.js";
import { getOrder } from "../controllers/orderControllers/getOrder.js";
import { getOrders } from "../controllers/orderControllers/getOrders.js";
import getAllOrderIds from "../controllers/orderControllers/getAllOrderIds.js";

const orderRoute = Router();

orderRoute.get("/ids", getAllOrderIds);
orderRoute.get("/:id", UserAuthentication, getOrder);
orderRoute.get("/", UserAuthentication, getOrders);
orderRoute.post("/", UserAuthentication, addOrder);
orderRoute.put("/", UserAuthentication, updateOrder);

export { orderRoute };
