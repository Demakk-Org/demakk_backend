import { Router } from "express";
import ExpressFormidable from "express-formidable";

import AdminAuthentication from "../middlewares/AdminAuthentication.js";
import UserAuthentication from "../middlewares/UserAuthentication.js";

import { addProduct } from "../controllers/productControllers/addProduct.js";
import { updateProduct } from "../controllers/productControllers/updateProduct.js";
import { deleteProduct } from "../controllers/productControllers/deleteProduct.js";
import { getProducts } from "../controllers/productControllers/getProducts.js";
import { getProduct } from "../controllers/productControllers/getProduct.js";
import { addReview } from "../controllers/productControllers/addReview.js";
import { addFavourite } from "../controllers/productControllers/addFavourite.js";
import { addImages } from "../controllers/productControllers/addImages.js";

const productRoute = Router();

// productRoute.use(
//   ExpressFormidable({
//     multiples: true,
//   })
// );

productRoute.get("/:id", getProduct);
productRoute.get("/", getProducts);
productRoute.post("/", AdminAuthentication, addProduct);
productRoute.put("/", AdminAuthentication, updateProduct);
productRoute.delete("/", AdminAuthentication, deleteProduct);
productRoute.post("/review", UserAuthentication, addReview);
productRoute.post("/fav", UserAuthentication, addFavourite);
productRoute.post(
  "/images",
  ExpressFormidable({
    multiples: true,
  }),
  AdminAuthentication,
  addImages
);

export { productRoute };
