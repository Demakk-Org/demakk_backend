import admin from "firebase-admin";

import { config } from "dotenv";

let serviceAccount;

try {
  serviceAccount = JSON.parse(config(process.cwd, ".env").parsed.PRIVATE_KEY);
} catch (error) {
  console.error(error);
}

export const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
