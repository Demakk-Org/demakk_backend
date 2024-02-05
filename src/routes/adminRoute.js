import { Router } from "express";

import AdminAuthentication from "../middlewares/AdminAuthentication.js";

import { getUsers } from "../controllers/adminControllers/getUsers.js";
import { blockUser } from "../controllers/adminControllers/blockUser.js";
import { deleteUser } from "../controllers/adminControllers/deleteUser.js";
import { assignRole } from "../controllers/adminControllers/assignRole.js";

const adminRoute = Router();

adminRoute.get("/users", AdminAuthentication, getUsers);
adminRoute.post("/block", AdminAuthentication, blockUser);
adminRoute.delete("/user", AdminAuthentication, deleteUser);
adminRoute.put("/assignRole", AdminAuthentication, assignRole);

export default adminRoute;
