import { config } from "dotenv";
import { isValidObjectId } from "mongoose";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import User from "../../models/userSchema.js";
import Role from "../../models/roleSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const assignRole = async (req, res) => {
  let { lang, role, uid } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!role || !uid) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(uid)) {
    return ResponseHandler(res, "user", 402, lang);
  }

  try {
    const role = await Role.findOne({ name: role });

    if (!role) {
      return ResponseHandler(res, "role", 404, lang);
    }

    console.log(role);

    const user = await User.findByIdAndUpdate(
      uid,
      { role: data._id },
      { returnDocument: "after" }
    )
      .populate("role")
      .select("role");

    return ResponseHandler(res, "common", 202, lang, user);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export { assignRole };
