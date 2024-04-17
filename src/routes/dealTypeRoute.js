import { Router } from "express";

import AdminAuthentication from "../middlewares/AdminAuthentication.js";

import { addDealType } from "../controllers/dealTypeControllers/addDealType.js";
import { deleteDealType } from "../controllers/dealTypeControllers/deleteDealType.js";

const dealTypeRoute = Router();

dealTypeRoute.post("/", AdminAuthentication, addDealType);
dealTypeRoute.delete("/", AdminAuthentication, deleteDealType);

export default dealTypeRoute;
