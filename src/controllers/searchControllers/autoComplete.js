import { config } from "dotenv";
import response from "../../../response.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { Product } from "../../models/productSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const autoComplete = async (req, res) => {
  let { text, lang } = req.body;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!text) {
    return ErrorHandler(res, 400, lang);
  }

  if (typeof text !== "string") {
    return ErrorHandler(res, 462, lang);
  }

  try {
    const products = await Product.aggregate([
      {
        $search: {
          index: "autocomplete",
          compound: {
            should: [
              {
                autocomplete: {
                  query: text,
                  path: "name.am",
                  tokenOrder: "sequential",
                },
              },
              {
                autocomplete: {
                  query: text,
                  path: "name.en",
                  tokenOrder: "sequential",
                },
              },
            ],
          },
        },
      },
      {
        $project: {
          _id: 0,
          name: {
            en: 1,
            am: 1,
          },
          // score: { $meta: "searchScore" },
        },
      },
    ]);

    let productList = [];

    products.forEach((product) => {
      productList.push(product.name.am || product.name.en);
    });

    return ErrorHandler(res, 200, lang, productList);
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};
