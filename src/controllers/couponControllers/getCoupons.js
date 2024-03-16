import { config } from "dotenv";
import Coupon from "../../models/couponSchema.js";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

const { LANG, LIMIT, PAGE, SORT } = config(process.cwd, ".env").parsed;

export const getCoupons = async (req, res) => {
  let { page, limit, lang, sort } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (sort === undefined) sort = SORT;
  if (page === undefined || typeof page !== "number") page = PAGE;
  if (limit === undefined || typeof limit !== "number") limit = LIMIT;

  let query = {};

  try {
    const count = await Coupon.countDocuments(query);

    Coupon.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort(sort)
      .populate({ path: "discountTypeId", select: "name aboveAmount" })
      .populate({
        path: "appliesToProductCategory",
        select: "name stockItem additionalPrice",
        // populate: { path: "stockItem", select: "name price" },
      })
      .then((data) => {
        let coupons = [];
        console.log(data[0].appliesToProductCategory[0]);
        data.forEach((coupon) => {
          let couponItem = {
            id: coupon._id,
            name: coupon.name,
            discountType: coupon.discountTypeId && {
              name: coupon.discountTypeId.name,
              above: coupon.discountTypeId.aboveAmount,
            },
            discountAmount: coupon.discountAmount,
            appliesToProductCategory:
              coupon.appliesToProductCategory &&
              coupon.appliesToProductCategory.map((item) => ({
                id: item._id,
                name:
                  item.name &&
                  (item.name.get(lang)
                    ? item.name.get(lang)
                    : item.name.get(LANG)
                    ? item.name.get(LANG)
                    : item.name.get("en")),
                additionalPrice: item.additionalPrice,
              })),
          };
          coupons.push(couponItem);
        });
        const result = {
          page: page.toString(),
          pages: Math.ceil(count / limit).toString(),
          limit: limit.toString(),
          count: count.toString(),
          data: coupons,
        };

        return ResponseHandler(res, "common", 200, lang, result);
      });
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
