import { config } from "dotenv";
import language from "../../../language.js";
import User from "../../models/userSchema.js";
import { ObjectId } from "bson";

const LANG = config(process.cwd, ".env").parsed.LANG;

const blockUser = (req, res) => {
  let { uid, block, lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (!uid || block == null) {
    return res.status(400).json({ message: language[lang].response[400] });
  }

  if (!ObjectId.isValid(uid)) {
    return res.status(400).json({ message: language[lang].response[418] });
  }

  User.findById(uid)
    .select("blocked")
    .then(async (user) => {
      if (!user) {
        return res.status(404).json({ message: language[lang].response[416] });
      }

      if (block && user.blocked) {
        return res.status(400).json({ message: language[lang].response[421] });
      }

      if (!block && !user.blocked) {
        return res.status(400).json({ message: language[lang].response[422] });
      }

      try {
        user.blocked = block;
        await user.save();
        return res.status(200).json({
          message: block
            ? language[lang].response[419]
            : language[lang].response[420],
        });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ message: language[lang].response[500] });
      }
    });
};

export default blockUser;
