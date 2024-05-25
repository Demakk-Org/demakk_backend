import { config } from "dotenv";

const { PRIVATE_KEY_ID, PRIVATE_KEY } = config(process.cwd, ".env").parsed;

export default {
  type: "service_account",
  project_id: "demakk-backend",
  private_key_id: PRIVATE_KEY_ID,
  private_key: PRIVATE_KEY,
  client_email:
    "firebase-adminsdk-k5kho@demakk-backend.iam.gserviceaccount.com",
  client_id: "103709148264299666808",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-k5kho%40demakk-backend.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};
