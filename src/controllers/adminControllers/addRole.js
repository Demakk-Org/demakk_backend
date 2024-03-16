import { config } from "dotenv";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import Role from "../../models/roleSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const addRole = async (req, res) => {
  let { name, lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!name) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (typeof name !== "string") {
    return ResponseHandler(res, "role", 401, lang);
  }

  const role = await Role.findOne({ name });

  if (role) {
    return ResponseHandler(res, "role", 461, lang);
  } else {
    try {
      Role.create({ name }).then((data) => {
        return ResponseHandler(res, "common", 201, lang);
      });
    } catch (error) {
      console.log(error.message);
      return ResponseHandler(res, "common", 500, lang);
    }
  }
};
