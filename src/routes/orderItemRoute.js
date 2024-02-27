import { Router } from "express";

import UserAuthentication from "../middlewares/UserAuthentication.js";

import { addOrderItem } from "../controllers/orderItemControllers/addOrderItem.js";
import { UpdateOrderItem } from "../controllers/orderItemControllers/updateOrderItem.js";
import { deleteOrderItem } from "../controllers/orderItemControllers/deleteOrderItem.js";
import { getOrderItem } from "../controllers/orderItemControllers/getOrderItem.js";

const orderItemRoute = Router();

orderItemRoute.get("/", UserAuthentication, getOrderItem);
orderItemRoute.post("/", UserAuthentication, addOrderItem);
orderItemRoute.put("/", UserAuthentication, UpdateOrderItem);
orderItemRoute.delete("/", UserAuthentication, deleteOrderItem);

export { orderItemRoute };
