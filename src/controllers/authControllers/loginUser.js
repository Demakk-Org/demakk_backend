import User from "../../models/userSchema.js";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
import queryByType from "../../utils/queryByType.js";
import language from "../../../language.js";
import { config } from "dotenv";

const LANG = config(process.cwd, ".env").parsed.LANG;

async function loginUser(req, res) {
  console.log(req.body);
  let { account, password, lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  const queryAndType = queryByType(account);

  if (queryAndType.status == 400) {
    return res.status(400).json({ message: queryAndType.message });
  }

  try {
    const user = await User.findOne(queryAndType.searchQuery).select(
      "_id email firstName password"
    );

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = Jwt.sign(
        {
          from: "Demakk Printing Enterprise",
          uid: user._id,
          email: user.email,
          name: user.firstName,
          phoneNumber: user.phoneNumber,
          iat: Date.now(),
          lang,
        },
        "your_secret_key",
        { expiresIn: 1000 * 60 * 60 * 24 * 30 }
      );
      return res.json({ token, message: language[lang].response[205] });
    } else {
      return res.status(401).json({ message: language[lang].response[402] });
    }
  } catch (error) {
    return res.status(500).json({ message: language[lang].response[500] });
  }
}

export default loginUser;
