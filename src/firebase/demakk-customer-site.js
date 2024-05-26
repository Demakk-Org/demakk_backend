import { config } from "dotenv";
import { readFileSync } from "fs";

const { PRIVATE_KEY_ID } = config(process.cwd, ".env").parsed;

let privateKey = readFileSync("src/firebase/private.pem", "utf8");

export default {
  type: "service_account",
  project_id: "demakk-customer-site",
  private_key_id: PRIVATE_KEY_ID,
  private_key: privateKey,
  client_email:
    "firebase-adminsdk-kbeki@demakk-customer-site.iam.gserviceaccount.com",
  client_id: "115910301497318918951",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-k5kho%40demakk-backend.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};
