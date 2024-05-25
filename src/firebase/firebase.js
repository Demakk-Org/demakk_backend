import admin from "firebase-admin";

import { config } from "dotenv";

let serviceAccount = config(process.cwd, ".env").parsed.PRIVATE_KEY;

export const app = admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceAccount)),
});
