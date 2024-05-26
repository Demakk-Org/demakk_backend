import { config } from "dotenv";
import bcrypt from "bcryptjs";

import User from "../../models/userSchema.js";
import queryByType from "../../utils/queryByType.js";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
// import { app } from "../../firebase/firebase.js";
// import generateCustomToken from "../../libs/generateCustomToken.js";

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
      // app
      //   .auth()
      //   .createCustomToken(user._id.toString())
      //   .then(() => {
      //     const token = generateCustomToken({
      //       user,
      //       account: queryAndType.searchQuery,
      //       lang,
      //     });
      //     return ResponseHandler(res, "auth", 200, lang, token);
      //   })
      //   .catch((error) => {
      //     console.log("Error creating custom token:", error);
      //     return ResponseHandler(res, "common", 500, lang);
      //   });
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
