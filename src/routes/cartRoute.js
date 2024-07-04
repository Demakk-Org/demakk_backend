import { Router } from "express";

import UserAuthentication from "../middlewares/UserAuthentication.js";

import addOrderItem from "../controllers/cartControllers/addOrderItem.js";
import { getCart } from "../controllers/cartControllers/getCart.js";
import { deleteOrderItems } from "../controllers/cartControllers/deleteOrderItem.js";
import checkAllOrderItems from "../controllers/cartControllers/checkAllOrderItems.js";

const cartRoute = Router();

cartRoute.get("/", UserAuthentication, getCart);
cartRoute.post("/orderItems", UserAuthentication, addOrderItem);
cartRoute.delete("/orderItems", UserAuthentication, deleteOrderItems);
cartRoute.put("/orderItems/checkAll", UserAuthentication, checkAllOrderItems);

export default cartRoute;
