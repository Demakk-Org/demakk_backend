import { isValidObjectId } from "mongoose";
import { config } from "dotenv";
import responsse from "../../../responsse.js";
import User from "../../models/userSchema.js";
import Cart from "../../models/cartSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const deleteUser = (req, res) => {
  let { uid, lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!uid) {
    return ResponseHandler(res, "user", 400, lang);
  }

  if (!isValidObjectId(uid)) {
    return ResponseHandler(res, "user", 402, lang);
  }

  try {
    User.findById(uid, "cart")
      .then((user) => {
        if (!user) {
          return ResponseHandler(res, "user", 404, lang);
        }

        Cart.findByIdAndDelete(user.cart)
          .then((cart) => {
            if (!cart) {
              return ResponseHandler(res, "cart", 404, lang);
            }
          })
          .catch((error) => {
            console.log(error.message);
            return ResponseHandler(res, "common", 500, lang);
          });
      })
      .finally(async () => {
        try {
          const user = await User.findByIdAndDelete(uid);
          if (user) {
            return ResponseHandler(res, "common", 203, lang);
          }
        } catch (error) {
          console.log(error.message);
          return ResponseHandler(res, "common", 500, lang);
        }
      });
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export { deleteUser };
