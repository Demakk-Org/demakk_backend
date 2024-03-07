import User from "../../models/userSchema.js";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
import queryByType from "../../utils/queryByType.js";
import { config } from "dotenv";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

async function loginUser(req, res) {
  let { account, password, lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!account || !password) {
    return ResponseHandler(res, "common", 400, lang);
  }

  const queryAndType = queryByType(account, lang);

  if (queryAndType.status == 403) {
    return ResponseHandler(res, "auth", 405, lang);
  }

  try {
    const user = await User.findOne(queryAndType.searchQuery).select(
      "_id email firstName password lang"
    );

    if (!user) {
      return ResponseHandler(res, "user", 404, lang);
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = Jwt.sign(
        {
          from: "Demakk Printing Enterprise",
          uid: user._id,
          name: user.firstName,
          ...queryAndType.searchQuery,
          iat: Date.now(),
          lang: user.lang ? user.lang : lang,
        },
        "your_secret_key",
        { expiresIn: 1000 * 60 * 60 * 24 * 30 }
      );
      return ResponseHandler(res, "auth", 200, lang, token);
    } else {
      return ResponseHandler(res, "auth", 410, lang);
    }
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
}

export default loginUser;
