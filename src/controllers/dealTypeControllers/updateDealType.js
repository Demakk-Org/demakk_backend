import { config } from "dotenv";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import DealType from "../../models/dealTypeSchema.js";
import { isValidObjectId } from "mongoose";

const LANG = config(process.cwd, ".env").parsed.LANG;

const updateDealType = async (req, res) => {
  let { lang, name, subTitle, dealTypeId } = req.body;

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

  if (!name && !subTitle) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (name && typeof name !== "string") {
    return ResponseHandler(res, "dealType", 401, lang);
  }

  if (subTitle && typeof subTitle !== "string") {
    return ResponseHandler(res, "dealTYpe", 407, lang);
  }

  try {
    const dealType = await DealType.findById(dealTypeId);

    if (!dealType) {
      return ResponseHandler(res, "dealType", 404, lang);
    }

    if (name) dealType.name = name;
    if (subTitle) dealType.subTitle = subTitle;

    dealType
      .save()
      .then((res) => {
        return ResponseHandler(res, "common", 202, lang, res);
      })
      .catch((error) => {
        console.log(error.message);
        return ResponseHandler(res, "common", 500, lang);
      });
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export default updateDealType;
