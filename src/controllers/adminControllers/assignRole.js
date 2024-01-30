import { config } from "dotenv";
import language from "../../../language.js";
import Role from "../../models/roleSchema.js";
import { ObjectId } from "bson";
import User from "../../models/userSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const assignRole = (req, res) => {
  let { lang, role, uid } = req.body;

  if (!lang || !Object.keys(lang) != lang) {
    lang = LANG;
  }

  if (!role || !uid) {
    return res.status(404).json({ message: language[lang].response[400] });
  }

  if (!ObjectId.isValid(uid)) {
    return res.status(404).json({ message: language[lang].response[418] });
  }

  Role.findOne({ name: role }).then((data) => {
    if (!role) {
      return res.status(404).json({ message: language[lang].response[436] });
    }

    console.log(data);

    try {
      User.findByIdAndUpdate(
        uid,
        { role: data._id },
        { returnDocument: "after" }
      ).then((user) => {
        return res
          .status(200)
          .json({ message: language[lang].response[203], user });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: language[lang].response[500] });
    }
  });
};

export { assignRole };
