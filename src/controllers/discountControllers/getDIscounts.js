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
      .populate({
        path: "discountType",
        select: "name",
      })
      .select("-createdAt -updatedAt -__v");

    let discountList = [];

    discounts.forEach((discount) => {
      discountList.push({
        id: discount._id,
        discountType: discount.discountType?.name,
        discountAmount: discount.discountAmount,
        products: discount.products,
        status: discount.status,
        aboveAmount: discount.aboveAmount,
      });
    });

    return ResponseHandler(res, "common", 200, lang, discountList);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export default getDiscounts;
