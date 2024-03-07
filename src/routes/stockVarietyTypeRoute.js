import { Router } from "express";

import AdminAuthentication from "../middlewares/AdminAuthentication.js";

import { addStockVarietyType } from "../controllers/stockVarietyTypeControllers/addStockVarietyType.js";
import { deleteStockVarietyType } from "../controllers/stockVarietyTypeControllers/deleteStockVarietyType.js";
import { updateStockVarietytype } from "../controllers/stockVarietyTypeControllers/updateStockVarietyType.js";

export const stockVarietyTypeRoute = Router();

stockVarietyTypeRoute.post("/", AdminAuthentication, addStockVarietyType);
stockVarietyTypeRoute.put("/", AdminAuthentication, updateStockVarietytype);
stockVarietyTypeRoute.delete("/", AdminAuthentication, deleteStockVarietyType);
