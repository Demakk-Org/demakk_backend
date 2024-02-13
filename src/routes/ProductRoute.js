import { Router } from "express";

import AdminAuthentication from "../middlewares/AdminAuthentication.js";

import { addProduct } from "../controllers/productControllers/addProduct.js";
import { updateProduct } from "../controllers/productControllers/updateProduct.js";
import { deleteProduct } from "../controllers/productControllers/deleteProduct.js";
import { getProducts } from "../controllers/productControllers/getProducts.js";
import { getProduct } from "../controllers/productControllers/getProduct.js";

const productRoute = Router();

productRoute.get("/:id", getProduct);
productRoute.get("/", getProducts);
productRoute.post("/", AdminAuthentication, addProduct);
productRoute.put("/", AdminAuthentication, updateProduct);
productRoute.delete("/", AdminAuthentication, deleteProduct);

export { productRoute };
