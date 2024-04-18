import { config } from "dotenv";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import DealType from "../../models/dealTypeSchema.js";
import { isValidObjectId } from "mongoose";

const LANG = config(process.cwd, ".env").parsed.LANG;

const updateDealType = async (req, res) => {
  let { lang, name, dealTypeId } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!dealTypeId || !name) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(dealTypeId)) {
    return ResponseHandler(res, "dealType", 402, lang);
  }

  if (typeof name !== "string") {
    return ResponseHandler(res, "common", 401, lang);
  }

  try {
    const dealType = await DealType.findById(dealTypeId);

    if (!dealType) {
      return ResponseHandler(res, "dealType", 404, lang);
    }

    DealType.find({ name }).then((data) => {
      if (data) {
        return ResponseHandler(res, "dealType", 406, lang);
      }

      dealType.name = name;

      dealType
        .save()
        .then((res) => {
          return ResponseHandler(res, "common", 202, lang, res);
        })
        .catch((error) => {
          console.log(error.message);
          return ResponseHandler(res, "common", 500, lang);
        });
    });
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export default updateDealType;
