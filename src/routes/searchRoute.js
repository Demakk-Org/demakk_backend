import { Router } from "express";
import { autoComplete } from "../controllers/searchControllers/autoComplete.js";
import { searchProducts } from "../controllers/searchControllers/searchProducts.js";

const searchRoute = Router();

searchRoute.get("/autocomplete", autoComplete);
searchRoute.get("/", searchProducts);

export { searchRoute };
