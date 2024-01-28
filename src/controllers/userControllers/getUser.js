import User from "../../models/userSchema.js";
import Jwt from "jsonwebtoken";
import language from "../../../language.js";

async function getUser(req, res) {
  let { lang } = req.body;
  const token = req.headers.authorization.split(" ")[1];
  const { uid } = Jwt.decode(token, "your_secret_key");
  const taken = Jwt.decode(token, "your_secret_key");
  console.log(taken);

  console.log(uid);

  if (!lang || !(lang in language)) {
    lang = "en";
  }

  try {
    const user = await User.findById(uid)
      .select(
        "email phoneNumber firstName lastName role shippingAddress billingAddress cart"
      )
      .populate("role shippingAddress billingAddress cart");
    console.log(user);
    return res.json(user);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: language[lang].error[500] });
  }
}

export default getUser;
