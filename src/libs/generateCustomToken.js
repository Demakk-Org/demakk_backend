import { readFileSync } from "fs";
import JWT from "jsonwebtoken";

let privateKey = readFileSync("src/firebase/private.pem", "utf8");

const generateCustomToken = ({ user, account, lang, time }) => {
  const token = JWT.sign(
    {
      aud: "https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit",
      iss: "firebase-adminsdk-kbeki@demakk-customer-site.iam.gserviceaccount.com",
      from: "Demakk Printing Enterprise",
      sub: "firebase-adminsdk-kbeki@demakk-customer-site.iam.gserviceaccount.com",
      uid: user._id.toString(),
      ...account,
      iat: Math.floor(Date.now() / 1000),
      lang: user.lang ? user.lang : lang,
      alg: "RS256",
    },
    privateKey,
    {
      expiresIn: time || 3600,
      algorithm: "RS256",
    }
  );

  return token;
};

export default generateCustomToken;
