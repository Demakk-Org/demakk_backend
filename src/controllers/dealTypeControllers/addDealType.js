import { config } from "dotenv";

import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

import DealType from "../../models/dealTypeSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const addDealType = async (req, res) => {
  let { name, subTitle, lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!name) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (typeof name !== "string") {
    return ResponseHandler(res, "dealType", 401, lang);
  }

  if (!subTitle) {
    return ResponseHandler(res, "dealType", 407, lang);
  }

  if (typeof subTitle !== "string") {
    return ResponseHandler(res, "dealType", 407, lang);
  }

  try {
    const dealType = await DealType.findOne({ name });

    if (dealType) {
      return ResponseHandler(res, "dealType", 406, lang);
    }

    DealType.create({ name, subTitle }).then((data) => {
      return ResponseHandler(res, "common", 201, lang, data);
    });
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
