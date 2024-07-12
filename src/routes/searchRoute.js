import { Router } from "express";
import { autoComplete } from "../controllers/searchControllers/autoComplete.js";
import { searchProducts } from "../controllers/searchControllers/searchProducts.js";
import relatedProducts from "../controllers/searchControllers/relatedProducts.js";

const searchRoute = Router();

searchRoute.get("/autocomplete", autoComplete);
searchRoute.post("/", searchProducts);
searchRoute.post("/related", relatedProducts);

export { searchRoute };
