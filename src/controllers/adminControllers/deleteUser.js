import { config } from "dotenv";
import language from "../../../language.js";
import Cart from "../../models/cartSchema.js";
import User from "../../models/userSchema.js";
import { ObjectId } from "bson";

const LANG = config(process.cwd, ".env").parsed.LANG;

const deleteUser = (req, res) => {
  let { uid, lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (!uid) {
    return res.status(400).json({
      message: language[lang].response[415],
    });
  }

  if (!ObjectId.isValid(uid)) {
    return res.status(400).json({
      message: language[lang].response[418],
    });
  }

  User.findById(uid, "cart")
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: language[lang].response[416],
        });
      }

      Cart.findByIdAndDelete(user.cart)
        .then((cart) => {
          if (!cart) {
            res.status(404).json({
              message: language[lang].response[417],
            });
          }
        })
        .catch((error) => {
          console.log(error);
          return res.status(500).json({
            message: language[lang].response[500],
          });
        });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        message: language[lang].response[500],
      });
    })
    .finally(async () => {
      try {
        const user = await User.findByIdAndDelete(uid);
        if (user) {
          return res.status(200).json({
            message: language[lang].response[204],
          });
        }
      } catch (error) {
        return res.status(500).json({ message: language[lang].response[500] });
      }
    });
};

export default deleteUser;
