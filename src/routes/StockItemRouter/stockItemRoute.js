import { Router } from "express";

import AdminAuthentication from "../../middlewares/AdminAuthentication.js";

import addStockItem from "../../controllers/stockItemControllers/addStockItem.js";
import updateStockItem from "../../controllers/stockItemControllers/updateStockItem.js";
import deleteStockItem from "../../controllers/stockItemControllers/deleteStockItem.js";

const stockItemRoute = Router();

stockItemRoute.post("/", AdminAuthentication, addStockItem);
stockItemRoute.put("/", AdminAuthentication, updateStockItem);
stockItemRoute.delete("/", AdminAuthentication, deleteStockItem);

export { stockItemRoute };
