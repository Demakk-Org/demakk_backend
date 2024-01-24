import User from "../../models/userSchema.js";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
import queryByType from "../../utils/queryByType.js";

async function loginUser(req, res) {
  console.log(req.body);
  const { account, password } = req.body;

  const queryAndType = queryByType(account);

  if (queryAndType.status == 400) {
    return res.status(400).json({ message: queryAndType.message });
  }

  try {
    const user = await User.findOne(queryAndType.searchQuery).select(
      "_id email firstName password"
    );
    // console.log(user, await bcrypt.hash("Tole7141", 10));

    if (user && (await bcrypt.compare(password, user.password))) {
      console.log("I am here");
      const token = Jwt.sign(
        {
          from: "Demakk Printing Enterprise",
          uid: user._id,
          email: user.email,
          name: user.firstName,
          iat: Date.now(),
        },
        "your_secret_key",
        { expiresIn: 1000 * 60 * 60 * 24 * 30 }
      );
      return res.json({ token });
    } else {
      return res.status(401).json({ message: "Invalid credential" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error, Try again!" });
  }
}

export default loginUser;
