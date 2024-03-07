import { config } from "dotenv";
import response from "../../../response.js";
import Role from "../../models/roleSchema.js";
import { ErrorHandler } from "../../utils/errorHandler.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const addRole = async (req, res) => {
  let { name, lang } = req.body;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!name) {
    return ErrorHandler(res, 400, lang);
  }

  if (typeof name !== "string") {
    return ErrorHandler(res, 462, lang);
  }

  const role = await Role.findOne({ name });

  if (role) {
    return ErrorHandler(res, 461, lang); // the role already exists
  } else {
    try {
      Role.create({ name }).then((data) => {
        return ErrorHandler(res, 201, lang, data);
      });
    } catch (error) {
      console.log(error.message);
      return ErrorHandler(res, 500, lang);
    }
  }
};
