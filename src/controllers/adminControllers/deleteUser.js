import { config } from "dotenv";
import language from "../../../language.js";
import Cart from "../../models/cartSchema.js";
import User from "../../models/userSchema.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";

const LANG = config(process.cwd, ".env").parsed.LANG;

const deleteUser = (req, res) => {
  let { uid, lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (!uid) {
    return ErrorHandler(res, 415, lang);
  }

  if (!isValidObjectId(uid)) {
    return ErrorHandler(res, 418, lang);
  }

  User.findById(uid, "cart")
    .then((user) => {
      if (!user) {
        return ErrorHandler(res, 416, lang);
      }

      Cart.findByIdAndDelete(user.cart)
        .then((cart) => {
          if (!cart) {
            return ErrorHandler(res, 417, lang);
          }
        })
        .catch((error) => {
          console.log(error);
          return ErrorHandler(res, 500, lang);
        });
    })
    .catch((error) => {
      console.log(error);
      return ErrorHandler(res, 500, lang);
    })
    .finally(async () => {
      try {
        const user = await User.findByIdAndDelete(uid);
        if (user) {
          return ErrorHandler(res, 204, lang);
        }
      } catch (error) {
        console.log(error);
        return ErrorHandler(res, 500, lang);
      }
    });
};

export default deleteUser;
