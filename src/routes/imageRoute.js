import { Router } from "express";

import AdminAuthentication from "../middlewares/AdminAuthentication.js";
import { addOrUpdateImages } from "../controllers/imageControllers/addOrUpdateImage.js";
import UserAuthentication from "../middlewares/UserAuthentication.js";

const imageRoute = Router();

imageRoute.put(
  "/",
  (req, res, next) => {
    if (req.body.type == "user") {
      UserAuthentication(req, res, next);
    } else {
      AdminAuthentication(req, res, next);
    }
  },
  addOrUpdateImages
);

export { imageRoute };
