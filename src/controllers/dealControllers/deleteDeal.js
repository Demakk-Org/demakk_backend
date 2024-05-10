import { config } from "dotenv";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import Deal from "../../models/dealSchema.js";
import { isValidObjectId } from "mongoose";

const LANG = config(process.cwd, ".env").parsed.LANG;

const deleteDeal = async (req, res) => {
  let { lang, dealId } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!dealId) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(dealId)) {
    return ResponseHandler(res, "deal", 402, lang);
  }

  try {
    const deal = await Deal.findByIdAndDelete(dealId);

    if (!deal) {
      return ResponseHandler(res, "deal", 404, lang, deal);
    }

    return ResponseHandler(res, "common", 203, lang, deal);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export default deleteDeal;
