import admin from "firebase-admin";

import demakkCustomerSite from "./demakk-customer-site.js";

export const app = admin.initializeApp({
  credential: admin.credential.cert(demakkCustomerSite),
});
