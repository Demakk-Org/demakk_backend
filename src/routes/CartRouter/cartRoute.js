import express, { Router } from "express";
import addCart from "../../controllers/cartControllers/addCart.js";

const cartRoute = Router();

cartRoute.use(express.json());

cartRoute.post("/", addCart)

export default cartRoute;