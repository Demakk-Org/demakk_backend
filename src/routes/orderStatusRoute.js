import { Router } from "express";

import AdminAuthentication from "../middlewares/AdminAuthentication.js";

import addOrderStatus from "../controllers/orderStatusControllers/addOrderStatus.js";
import deleteOrderStatus from "../controllers/orderStatusControllers/deleteOrderStatus.js";
import getOrderStatuses from "../controllers/orderStatusControllers/getOrderStatuses.js";

const orderStatusRoute = Router();

orderStatusRoute.post("/", AdminAuthentication, addOrderStatus);
orderStatusRoute.delete("/", AdminAuthentication, deleteOrderStatus);
orderStatusRoute.get("/", AdminAuthentication, getOrderStatuses);

export default orderStatusRoute;
