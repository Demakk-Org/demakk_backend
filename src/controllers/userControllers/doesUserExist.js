import { config } from "dotenv";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import QueryByType from "../../utils/queryByType.js";
import User from "../../models/userSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const doesUserExist = async (req, res) => {
  let { phoneOrEmail, lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (!phoneOrEmail) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (QueryByType(phoneOrEmail).status == 403) {
    return ResponseHandler(res, "auth", 405, lang);
  }

  try {
    const user = await User.findOne(QueryByType(phoneOrEmail).searchQuery);

    if (!user) {
      return ResponseHandler(res, "user", 404, lang);
    }

    return ResponseHandler(res, "common", 200, lang);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export default doesUserExist;
