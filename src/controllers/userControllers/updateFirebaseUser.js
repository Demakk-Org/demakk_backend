import { getAuth } from "firebase-admin/auth";
import { app } from "../../firebase/firebase.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import responsse from "../../../responsse.js";
import { config } from "dotenv";

const LANG = config(process.cwd, ".env").parsed.LANG;

const updateFirebaseUser = (req, res) => {
  let { email, uid, lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  getAuth(app)
    .updateUser(uid, {
      email,
    })
    .then((resp) => {
      console.log(resp);
      return ResponseHandler(res, "common", 200, lang, resp);
    })
    .catch((err) => {
      return ResponseHandler(res, "common", 500, lang);
    });
};

export default updateFirebaseUser;
