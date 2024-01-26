import User from "../../models/userSchema.js";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
import language from "../../../language.js";
import { config } from "dotenv";
import { ObjectId } from "bson";

const LANG = config(process.cwd, ".env").parsed.LANG;

const changePassword = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  const { uid } = Jwt.decode(token, "your_secret_key");

  let { password, confirmPassword, lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (!ObjectId.isValid(uid)) {
    return res.status(400).json({ message: language[lang].response[407] });
  }

  if (!password || !confirmPassword) {
    return res.status(400).json({ message: language[lang].reseponse[400] });
  }

  if (password != confirmPassword) {
    return res.status(400).json({ message: language[lang].response[402] });
  }

  try {
    const user = await User.findById(uid).select("password");

    if (!user) {
      return res.status(404).json({ message: language[lang].response[404] });
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    return res.status(200).json({ message: language[lang].response[203] });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: language[lang].response[500] });
  }
};

export default changePassword;
