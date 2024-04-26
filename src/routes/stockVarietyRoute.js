import { Router } from "express";

import AdminAuthentication from "../middlewares/AdminAuthentication.js";

import { addStockVariety } from "../controllers/stockVarietyControllers/addStockVariety.js";
import { updateStockVariety } from "../controllers/stockVarietyControllers/updateStockVariety.js";
import { deleteStockVariety } from "../controllers/stockVarietyControllers/deleteStockVariety.js";
// import { addStockVarietyImages } from "../controllers/stockVarietyControllers/addStockVarietyImage.js";

export const stockVarietyRoute = Router();

stockVarietyRoute.post("/", AdminAuthentication, addStockVariety);
stockVarietyRoute.put("/", AdminAuthentication, updateStockVariety);
stockVarietyRoute.delete("/", AdminAuthentication, deleteStockVariety);
// stockVarietyRoute.post("/image", AdminAuthentication, addStockVarietyImages);
