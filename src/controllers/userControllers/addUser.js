import dotenv from "dotenv";
import mongoose from "mongoose";
import { UserSchema } from "../../models/userSchema.js";

const MONGODB_ULI = dotenv.config(process.cwd, ".env").parsed.MONGODB_URI;


async function addUser(req, res) {
  
  await mongoose.connect(MONGODB_ULI)

  const User = mongoose.model("User", UserSchema);

  const user = await User.create({
    email:"solentolessa@gmail.com",
    phoneNumber:"9999-9999-99",
    firstName:"Melka",
    lastName:"Tole",
  })

  res.json(user)
  
}

export default addUser;
