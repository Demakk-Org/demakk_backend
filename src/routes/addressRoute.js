import { Router } from "express";

import UserAuthentication from "../middlewares/UserAuthentication.js";

import { addAddress } from "../controllers/addressControllers/addAddress.js";
import { deleteAddress } from "../controllers/addressControllers/deleteAddress.js";
import { getAddresses } from "../controllers/addressControllers/getAddress.js";
import { updateAddress } from "../controllers/addressControllers/updateAddress.js";

const addressRoute = Router();

addressRoute.post("/", UserAuthentication, addAddress);
addressRoute.delete("/", UserAuthentication, deleteAddress);
addressRoute.get("/", UserAuthentication, getAddresses);
addressRoute.put("/", UserAuthentication, updateAddress);

export { addressRoute };
