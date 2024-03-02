import { Router } from "express";

import AdminAuthentication from "../middlewares/AdminAuthentication.js";

import { addStockVarietyType } from "../controllers/stockVarietyType/addStockVarietyType.js";
import { deleteStockVarietyType } from "../controllers/stockVarietyType/deleteStockVarietyType.js";
import { updateStockVarietytype } from "../controllers/stockVarietyType/updateStockVarietyType.js";

export const stockVarietyTypeRoute = Router();

stockVarietyTypeRoute.post("/", AdminAuthentication, addStockVarietyType);
stockVarietyTypeRoute.put("/", AdminAuthentication, updateStockVarietytype);
stockVarietyTypeRoute.delete("/", AdminAuthentication, deleteStockVarietyType);
