import { Router } from "express";

import AdminAuthentication from "../../middlewares/AdminAuthentication.js";

import { addProduct } from "../../controllers/productControllers/addProduct.js";
import { updateProduct } from "../../controllers/productControllers/updateProduct.js";
import { deleteProduct } from "../../controllers/productControllers/deleteProduct.js";

const productRoute = Router();

productRoute.post("/", AdminAuthentication, addProduct);
productRoute.put("/", AdminAuthentication, updateProduct);
productRoute.delete("/", AdminAuthentication, deleteProduct);

export { productRoute };
