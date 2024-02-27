import { Router } from "express";

import UserAuthentication from "../middlewares/UserAuthentication.js";

import addCart from "../controllers/cartControllers/addCart.js";
import addOrderItem from "../controllers/cartControllers/addOrderItem.js";
import { getCart } from "../controllers/cartControllers/getCart.js";
import { deleteOrderItems } from "../controllers/cartControllers/deleteOrderItem.js";

const cartRoute = Router();

cartRoute.get("/", UserAuthentication, getCart);
cartRoute.post("/", addCart);
cartRoute.post("/orderItems", UserAuthentication, addOrderItem);
cartRoute.delete("/orderItems", UserAuthentication, deleteOrderItems);

export default cartRoute;
