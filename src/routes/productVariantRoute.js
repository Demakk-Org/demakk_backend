import { Router } from "express";

import AdminAuthentication from "../middlewares/AdminAuthentication.js";

import { addProductVariant } from "../controllers/productVariantControllers/addProductVariant.js";
import { deleteProductVariant } from "../controllers/productVariantControllers/deleteProductVariant.js";
import getProductVariant from "../controllers/productVariantControllers/getProductVariant.js";
import { updateProductVariant } from "../controllers/productVariantControllers/updateProductVariant.js";
import { getProductVariants } from "../controllers/productVariantControllers/getProductVariants.js";

export const productVariantRoute = Router();

productVariantRoute.get("/:id", getProductVariant);
productVariantRoute.get("/product/:id", getProductVariants);
productVariantRoute.post("/", AdminAuthentication, addProductVariant);
productVariantRoute.put("/", AdminAuthentication, updateProductVariant);
productVariantRoute.delete("/", AdminAuthentication, deleteProductVariant);
