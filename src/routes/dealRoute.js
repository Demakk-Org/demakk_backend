import { Router } from "express";

import AdminAuthentication from "../middlewares/AdminAuthentication.js";

import addDeal from "../controllers/dealControllers/addDeal.js";
import deleteDeal from "../controllers/dealControllers/deleteDeal.js";

const dealRoute = Router();

dealRoute.post("/", AdminAuthentication, addDeal);
dealRoute.delete("/", AdminAuthentication, deleteDeal);

export default dealRoute;
