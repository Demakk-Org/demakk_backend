import { Router } from "express";
import { addAddress } from "../controllers/addressControllers/addAddress.js";
import UserAuthentication from "../middlewares/UserAuthentication.js";
import { deleteAddress } from "../controllers/addressControllers/deleteAddress.js";
import { getAddresses } from "../controllers/addressControllers/getAddress.js";

const addressRoute = Router();

addressRoute.post("/", UserAuthentication, addAddress);
addressRoute.delete("/", UserAuthentication, deleteAddress);
addressRoute.get("/", UserAuthentication, getAddresses);

export { addressRoute };
