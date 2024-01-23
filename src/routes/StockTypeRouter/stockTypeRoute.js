import { Router } from "express";

import AdminAuthentication from "../../middlewares/AdminAuthentication.js";
import renameStockType from "../../controllers/stockTypeControllers/renameStockType.js";
import addStockType from "../../controllers/stockTypeControllers/addStockType.js";
import deleteStockType from "../../controllers/stockTypeControllers/deleteStockType.js";

const stockTypeRoute = Router();

stockTypeRoute.post("/", AdminAuthentication, addStockType);
stockTypeRoute.put("/", AdminAuthentication, renameStockType);
stockTypeRoute.delete("/", AdminAuthentication, deleteStockType);

export { stockTypeRoute };
