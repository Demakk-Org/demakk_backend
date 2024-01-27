import { Router } from "express";

import AdminAuthentication from "../middlewares/AdminAuthentication.js";

import { addProductCategory } from "../controllers/productCategoryControllers/addProductCategory.js";
import { deleteProductCategory } from "../controllers/productCategoryControllers/deleteProductCategory.js";
import { updateProductCategory } from "../controllers/productCategoryControllers/updateProductCategory.js";
import { getProductCategories } from "../controllers/productCategoryControllers/getProductCategory.js";

const productCategoryRoute = Router();

productCategoryRoute.get("/", getProductCategories);
productCategoryRoute.post("/", AdminAuthentication, addProductCategory);
productCategoryRoute.delete("/", AdminAuthentication, deleteProductCategory);
productCategoryRoute.put("/", AdminAuthentication, updateProductCategory);

export { productCategoryRoute };
