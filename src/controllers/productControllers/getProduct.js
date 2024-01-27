import { config } from "dotenv";
import { Product } from "../../models/productSchema.js";
import language from "../../../language.js";

const { LANG, LIMIT, PAGE, SORT } = config(process.cwd, ".env").parsed;

const getProducts = async (req, res) => {
  let { page, limit, lang, sort } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (sort === undefined) sort = SORT;

  if (page === undefined) page = PAGE;
  if (limit === undefined) limit = LIMIT;

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

  console.log(query);

  const count = await Product.countDocuments(query);

  try {
    Product.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort(sort)
      .populate("productCategory")
      .then((products) => {
        return res.status(200).json({
          page: page.toString(),
          pages: Math.ceil(count / limit).toString(),
          limit: limit.toString(),
          count: count.toString(),
          users: products,
        });
      });
  } catch (err) {
    return res.status(500).json({ error: language[lang].response[500] });
  }
};

export { getProducts };
