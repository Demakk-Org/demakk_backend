import ResetPassword from "../../models/resetPassword.js";
import User from "../../models/userSchema.js";
import bcrypt from "bcryptjs";
import language from "../../../language.js";
import dotenv from "dotenv";
import { ObjectId } from "bson";

const LANG = dotenv.config(process.cwd, ".env").parsed.LANG;

const resetPassword = async (req, res) => {
  let { id, newPassword, password, lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (!id || !newPassword || !password) {
    return res.status(400).json({ message: language[lang].response[400] });
  }

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: language[lang].response[407] });
  }

  if (newPassword !== password) {
    return res.status(400).json({ message: language[lang].response[402] });
  }
  console.log(id);
  const reset = await ResetPassword.findById(id);
  console.log(reset);

  if (!reset) {
    return res.status(400).json({ message: language[lang].response[404] });
  }

  if (reset.status == "complete") {
    return res.status(400).json({ message: language[lang].response[406] });
  }

  const now = new Date(Date.now() - reset.expiresIn);
  const time = reset.requestedAt;

  if (now > time) {
    return res.status(400).json({ message: language[lang].response[406] });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  console.log("why here");

  try {
    User.findByIdAndUpdate(
      reset.uid,
      {
        password: hashedPassword,
      },
      {
        returnDocument: "after",
      }
    )
      .then((user) => {
        console.log(user);
        return res.status(200).json({ message: language[lang].response[203] });
      })
      .finally(() => {
        reset.status = "complete";
        reset.save();
      });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: language[lang].response[500] });
  }
};

export default resetPassword;
