import { Router } from "express";

import AdminAuthentication from "../middlewares/AdminAuthentication.js";

import { updateStockType } from "../controllers/stockTypeControllers/updateStockType.js";
import { addStockType } from "../controllers/stockTypeControllers/addStockType.js";
import { deleteStockType } from "../controllers/stockTypeControllers/deleteStockType.js";
import getStockTypes from "../controllers/stockTypeControllers/getStockTypes.js";

const stockTypeRoute = Router();

stockTypeRoute.get("/", getStockTypes);
stockTypeRoute.post("/", AdminAuthentication, addStockType);
stockTypeRoute.put("/", AdminAuthentication, updateStockType);
stockTypeRoute.delete("/", AdminAuthentication, deleteStockType);

export { stockTypeRoute };
