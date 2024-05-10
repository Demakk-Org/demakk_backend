import { Router } from "express";

import AdminAuthentication from "../middlewares/AdminAuthentication.js";

import { addDealType } from "../controllers/dealTypeControllers/addDealType.js";
import { deleteDealType } from "../controllers/dealTypeControllers/deleteDealType.js";
import updateDealType from "../controllers/dealTypeControllers/updateDealType.js";
import getDealTypes from "../controllers/dealTypeControllers/getDealTypes.js";

const dealTypeRoute = Router();

dealTypeRoute.post("/", AdminAuthentication, addDealType);
dealTypeRoute.delete("/", AdminAuthentication, deleteDealType);
dealTypeRoute.put("/", AdminAuthentication, updateDealType);
dealTypeRoute.get("/", AdminAuthentication, getDealTypes);

export default dealTypeRoute;
