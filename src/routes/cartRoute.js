import express, { Router } from "express";
import addCart from "../controllers/cartControllers/addCart.js";

const cartRoute = Router();

cartRoute.post("/", addCart);

export default cartRoute;
