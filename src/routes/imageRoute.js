import { Router } from "express";

import AdminAuthentication from "../middlewares/AdminAuthentication.js";
import { addOrUpdateProductImages } from "../controllers/imageControllers/addOrUpdateProductImage.js";

const imageRoute = Router();

imageRoute.put("/", AdminAuthentication, addOrUpdateProductImages);

export { imageRoute };
