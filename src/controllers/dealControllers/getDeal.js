import { config } from "dotenv";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import Deal from "../../models/dealSchema.js";
import { isValidObjectId } from "mongoose";

const LANG = config(process.cwd, ".env").parsed.LANG;

const getDeal = async (req, res) => {
  let { id } = req.params;
  let { lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!id) {
    return ResponseHandler(res, "common", 400, lang);
  }

  console.log(id);

  if (!isValidObjectId(id)) {
    return ResponseHandler(res, "deal", 402, lang);
  }

  try {
    const deal = await Deal.findById(id).populate({
      path: "dealType",
      select: "name",
    });

    if (!deal) {
      return ResponseHandler(res, "deal", 404, lang);
    }

    return ResponseHandler(res, "common", 200, lang, deal);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export default getDeal;
