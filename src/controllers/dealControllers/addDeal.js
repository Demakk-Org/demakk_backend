import { config } from "dotenv";
import { isValidObjectId } from "mongoose";

import { isArr, isDateValid } from "../../utils/validate.js";
import Deal from "../../models/dealSchema.js";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import isDiscountInOtherDeal from "../../utils/isDiscountInOtherDeal.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const addDeal = async (req, res) => {
  let { lang, dealTypeId, discounts, startDate, endDate } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!dealTypeId || !discounts || !startDate || !endDate) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(dealTypeId)) {
    return ResponseHandler(res, "dealType", 402, lang);
  }

  if (!isArr(discounts, "string")) {
    return ResponseHandler(res, "deal", 406, lang);
  }

  discounts?.forEach((element) => {
    if (!isValidObjectId(element)) {
      return ResponseHandler(res, "discount", 402, lang);
    }
  });

  if (!isDateValid(startDate) || !isDateValid(endDate)) {
    return ResponseHandler(res, "common", 405, lang);
  }

  try {
    const exists = await isDiscountInOtherDeal(discounts);
    console.log(exists, "here");

    if (exists) {
      return ResponseHandler(res, "deal", 408, lang);
    }

    const deal = await Deal.create({
      dealType: dealTypeId,
      discounts,
      startDate,
      endDate,
    });

    return ResponseHandler(res, "common", 201, lang, deal);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export default addDeal;
