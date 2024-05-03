import { config } from "dotenv";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import Discount from "../../models/discountSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const getDiscounts = async (req, res) => {
  let { lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  try {
    const discounts = await Discount.find({})
      .populate([
        {
          path: "discountType",
        },
        {
          path: "products",
        },
      ])
      .populate({
        path: "deal",
        select: "-_id -__v",
        populate: "dealType",
      })
      .select("-createdAt -updatedAt -__v");

    return ResponseHandler(res, "common", 200, lang, discounts);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export default getDiscounts;
