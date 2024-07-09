import { config } from "dotenv";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";

import { camelize } from "../../utils/validate.js";
import QueryByType from "../../utils/queryByType.js";
import responsse from "../../../responsse.js";

import Cart from "../../models/cartSchema.js";
import User from "../../models/userSchema.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import { Image } from "../../models/imageSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const registerUser = async (req, res) => {
  console.log(req.body);
  let { account, firstName, lastName, password, provider, lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (!account || !provider) {
    return ResponseHandler(res, "common", 400, lang);
  }

  var queryAndType = QueryByType(account, lang);

  if (queryAndType.status == 403) {
    return ResponseHandler(res, "auth", 405, lang);
  }

  const user = await User.findOne(queryAndType.searchQuery);

  if (user) {
    return ResponseHandler(res, "auth", 400, lang);
  }

  try {
    let cartRequest = Cart.create({});
    let imageRequest = Image.create({
      type: "user",
    });

    const [cartResponse, imageResponse] = await Promise.all([
      cartRequest,
      imageRequest,
    ]);

    var query = {
      firstName: firstName ? camelize(firstName) : "",
      lastName: lastName ? camelize(lastName) : "",
      password: password ? await bcrypt.hash(password, 10) : "",
      role: "65a6ee8675aa7a6c6924c260",
      cart: cartResponse._id,
      image: imageResponse._id,
      providers: [provider],
      lang,
    };

    if (queryAndType.type == "email") {
      query.email = account;
    } else {
      query.phoneNumber = account;
    }

    const user = await User.create(query);
    cartResponse.user = user._id;
    imageResponse.userId = user._id;

    Promise.all([cartResponse.save(), imageResponse.save()]).then(() => {
      const token = Jwt.sign(
        {
          from: "Demakk Printing Enterprise",
          uid: user._id,
          email: user.email,
          name: user.firstName,
          ...queryAndType.searchQuery,
          iat: Date.now(),
          lang: user.lang ? user.lang : lang,
        },
        "your_secret_key",
        { expiresIn: 1000 * 60 * 60 * 24 * 30 }
      );

      return ResponseHandler(res, "common", 201, lang, { token });
    });
  } catch (error) {
    console.log(error);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export default registerUser;
