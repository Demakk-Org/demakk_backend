import DiscountType from "../../models/discountTypeSchema.js";
import { config } from "dotenv";
import response from "../../../response.js";
import { ErrorHandler } from "../../utils/errorHandler.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const addDiscount = async (req, res) => {
  let { above, lang } = req.body;
  let name = req.params.name;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!name) {
    return ErrorHandler(res, 400, lang);
  }

  if (typeof name !== "string") {
    return ErrorHandler(res, 492, lang);
  }
  if (above && typeof above !== "number") {
    return ErrorHandler(res, 493, lang);
  }

  try {
    const discountType = await DiscountType.findOne({ name });
    if (discountType) {
      return ErrorHandler(res, 491, lang);
    }
    DiscountType.create({ name, aboveAmount: above }).then((data) => {
      return ErrorHandler(res, 201, lang, data);
    });
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};
