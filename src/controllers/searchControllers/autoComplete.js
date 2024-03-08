import { config } from "dotenv";
import response from "../../../response.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { Product } from "../../models/productSchema.js";
import User from "../../models/userSchema.js";
import Jwt from "jsonwebtoken";
import { isValidObjectId } from "mongoose";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const autoComplete = async (req, res) => {
  let { text, lang } = req.body;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  let uid;

  const token = req.headers?.authorization?.split(" ")[1];

  if (token && Jwt.verify(token, "your_secret_key")) {
    uid = Jwt.decode(token, "your_secret_key")?.uid;
  }

  if (uid && !isValidObjectId(uid)) {
    uid = "";
  }

  if (!text) {
    return ErrorHandler(res, 400, lang);
  }

  if (typeof text !== "string") {
    return ErrorHandler(res, 462, lang);
  }

  try {
    let previousSearch = [];
    try {
      if (uid) {
        const searchTerms = await User.aggregate([
          {
            $search: {
              text: {
                query: text,
                path: "searchTerms",
                fuzzy: {},
              },
            },
          },
          {
            $project: {
              _id: 1,
              firstName: 1,
              searchTerms: 1,
            },
          },
        ]);

        console.log(searchTerms, uid);

        if (searchTerms) {
          let userSearchs = searchTerms.filter((term) => {
            console.log(
              "term id",
              term._id.toString(),
              term._id.toString() == uid
            );
            return term._id.toString() == uid;
          })[0].searchTerms;
          console.log("userSearchs", userSearchs);

          previousSearch = userSearchs.filter((term) => {
            return term.match(`${text}`, "i");
          });

          console.log("previousSearch", previousSearch);
        }
      }
    } catch (error) {
      console.log(error.message);
    }

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

    return ErrorHandler(res, 200, lang, [...previousSearch, ...productList]);
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};