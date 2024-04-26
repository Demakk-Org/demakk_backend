import { Router } from "express";

import AdminAuthentication from "../middlewares/AdminAuthentication.js";

import { addStockVarietyType } from "../controllers/stockVarietyTypeControllers/addStockVarietyType.js";
import { deleteStockVarietyType } from "../controllers/stockVarietyTypeControllers/deleteStockVarietyType.js";
import { updateStockVarietyType } from "../controllers/stockVarietyTypeControllers/updateStockVarietyType.js";

export const stockVarietyTypeRoute = Router();

stockVarietyTypeRoute.post("/", AdminAuthentication, addStockVarietyType);
stockVarietyTypeRoute.put("/", AdminAuthentication, updateStockVarietyType);
stockVarietyTypeRoute.delete("/", AdminAuthentication, deleteStockVarietyType);
