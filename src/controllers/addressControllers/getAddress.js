import { config } from "dotenv";
import { ResponseHandler } from "../../utils/responseHandler.js";
import Address from "../../models/addressSchema.js";
import responsse from "../../../responsse.js";

const { LANG, LIMIT, PAGE, SORT } = config(process.cwd, ".env").parsed;

const getAddresses = async (req, res) => {
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

  Array.from(Object.keys(req.body)).forEach((item) => {
    if (
      item != null &&
      item != "page" &&
      item != "limit" &&
      item != "lang" &&
      item != "sort"
    ) {
      query[item] = req.body[item];
    }
  });

  query.uid = req.uid;

  console.log(query);

  try {
    const count = await Address.countDocuments(query);

    Address.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      // .sort(sort)
      .then((addresses) => {
        let data = {
          page: page.toString(),
          pages: Math.ceil(count / limit).toString(),
          limit: limit.toString(),
          count: count.toString(),
          users: addresses,
        };
        return ResponseHandler(res, "common", 200, lang, data);
      });
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export { getAddresses };
