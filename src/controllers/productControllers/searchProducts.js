import { config } from "dotenv";
import { Product } from "../../models/productSchema.js";
import language from "../../../language.js";
import { ErrorHandler } from "../../utils/errorHandler.js";

const { LANG, LIMIT, PAGE, SORT } = config(process.cwd, ".env").parsed;

const searchProducts = async (req, res) => {
  let { page, limit, lang, sort, text } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (sort === undefined) sort = SORT;
  if (page === undefined || typeof page !== "number") page = PAGE;
  if (limit === undefined || typeof limit !== "number") limit = LIMIT;

  if (!text) {
    return ErrorHandler(res, 400, lang);
  }

  if (typeof text !== "string") {
    return ErrorHandler(res, 446, lang);
  }

  try {
    const products = await Product.find({
      $text: {
        $search: text,
        $caseSensitive: false,
      },
    })
      .limit(limit)
      .skip((page - 1) * limit)
      .sort(sort)
      .populate({
        path: "productCategory",
        populate: {
          path: "stockItem",
          populate: "stockType",
        },
      });

    return ErrorHandler(res, 200, lang, products);
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};

export { searchProducts };
