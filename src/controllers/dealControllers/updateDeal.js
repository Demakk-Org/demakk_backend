import { config } from "dotenv";
import responsse from "../../../responsse.js";
import { isValidObjectId } from "mongoose";
import { ResponseHandler } from "../../utils/responseHandler.js";
import Deal from "../../models/dealSchema.js";
import { isArr, isDateValid } from "../../utils/validate.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const updateDeal = async (req, res) => {
  let { lang, dealId, dealTypeId, subTitle, discounts, startDate, endDate } =
    req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!dealId) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!dealTypeId && !subTitle && !discounts && !startDate && !endDate) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(dealId)) {
    return ResponseHandler(res, "deal", 402, lang);
  }

  if (dealTypeId && !isValidObjectId(dealTypeId)) {
    return ResponseHandler(res, "dealType", 402, lang);
  }

  if (subTitle && typeof subTitle !== "string") {
    return ResponseHandler(res, "deal", 401, lang);
  }

  if (discounts && !isArr(discounts, "string")) {
    return ResponseHandler(res, "deal", 406, lang);
  }

  if (discounts && discounts.length == 0) {
    return ResponseHandler(res, "deal", 407, lang);
  }

  discounts?.forEach((element) => {
    if (!isValidObjectId(element)) {
      return ResponseHandler(res, "discount", 402, lang);
    }
  });

  if (
    (startDate && !isDateValid(startDate)) ||
    (endDate && !isDateValid(endDate))
  ) {
    return ResponseHandler(res, "common", 405, lang);
  }

  try {
    const deal = await Deal.findById(dealId);

    if (!deal) {
      return ResponseHandler(res, "deal", 404, lang);
    }

    if (dealTypeId) deal.dealType = dealTypeId;
    if (subTitle) deal.subTitle = subTitle;
    if (discounts) deal.discounts = discounts;
    if (startDate) deal.startDate = startDate;
    if (endDate) deal.endDate = endDate;

    await deal.save();

    return ResponseHandler(res, "common", 202, lang, deal);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export default updateDeal;
