import { config } from "dotenv";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import DealType from "../../models/dealTypeSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const getDealTypes = async (req, res) => {
  let { lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  try {
    const dealTypes = await DealType.find({});

    return ResponseHandler(res, "common", 200, lang, dealTypes);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export default getDealTypes;
