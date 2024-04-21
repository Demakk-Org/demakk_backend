import { Router } from "express";
import ExpressFormidable from "express-formidable";

import AdminAuthentication from "../middlewares/AdminAuthentication.js";

import addDeal from "../controllers/dealControllers/addDeal.js";
import deleteDeal from "../controllers/dealControllers/deleteDeal.js";
import updateDeal from "../controllers/dealControllers/updateDeal.js";
import getDeals from "../controllers/dealControllers/getDeals.js";
import getDeal from "../controllers/dealControllers/getDeal.js";
import addDealImages from "../controllers/dealControllers/addDealImage.js";

const dealRoute = Router();

dealRoute.post("/", AdminAuthentication, addDeal);
dealRoute.post(
  "/images",
  ExpressFormidable({
    multiples: true,
  }),
  AdminAuthentication,
  addDealImages
);
dealRoute.delete("/", AdminAuthentication, deleteDeal);
dealRoute.put("/", AdminAuthentication, updateDeal);
dealRoute.get("/", getDeals);
dealRoute.get("/:id", getDeal);

export default dealRoute;
