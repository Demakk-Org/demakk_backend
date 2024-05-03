import { config, populate } from "dotenv";

import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import Deal from "../../models/dealSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const getDeals = async (req, res) => {
  let { lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  try {
    const deals = await Deal.find({})
      .populate({
        path: "dealType",
        select: "name subTitle",
      })
      .populate({
        path: "images",
        select: "-__v -_id -createdAt -updatedAt",
      })
      .populate({
        path: "discounts",
        select: "-updatedAt -createdAt -__v",
        populate: { path: "products", populate: "images" },
      });

    return ResponseHandler(res, "common", 200, lang, deals);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export default getDeals;
