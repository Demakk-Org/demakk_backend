import { config } from "dotenv";
import response from "../../../response.js";
import Role from "../../models/roleSchema.js";
import User from "../../models/userSchema.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";

const LANG = config(process.cwd, ".env").parsed.LANG;

const assignRole = (req, res) => {
  let { lang, role, uid } = req.body;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!role || !uid) {
    return ErrorHandler(res, 400, lang);
  }

  if (!isValidObjectId(uid)) {
    return ErrorHandler(res, 418, lang);
  }

  Role.findOne({ name: role }).then((data) => {
    if (!role) {
      return ErrorHandler(res, 436, lang);
    }

    console.log(data);

    try {
      User.findByIdAndUpdate(
        uid,
        { role: data._id },
        { returnDocument: "after" }
      )
        .populate("role")
        .select("role")
        .then((user) => {
          return ErrorHandler(res, 203, lang, user);
        });
    } catch (error) {
      console.log(error.message);
      return ErrorHandler(res, 500, lang);
    }
  });
};

export { assignRole };
