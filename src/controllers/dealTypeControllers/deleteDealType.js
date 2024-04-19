import { isValidObjectId } from "mongoose";
import { config } from "dotenv";

import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

import DealType from "../../models/dealTypeSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const deleteDealType = async (req, res) => {
  let { dealTypeId, lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }
  if (!dealTypeId) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(dealTypeId)) {
    return ResponseHandler(res, "dealType", 402, lang);
  }

  try {
    const dealType = await DealType.findByIdAndDelete(dealTypeId);

    if (!dealType) {
      return ResponseHandler(res, "dealType", 404, lang);
    }

    return ResponseHandler(res, "common", 203, lang);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
