import { config } from "dotenv";
import language from "../../../language.js";
import Address from "../../models/addressSchema.js";
import { decode } from "jsonwebtoken";

const { LANG, LIMIT, PAGE, SORT } = config(process.cwd, ".env").parsed;

const getAddresses = async (req, res) => {
  let { page, limit, lang, sort } = req.body;

  const token = req.headers.authorization.split(" ")[1];
  const { uid } = decode(token, "your_secret_key");

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

  query.uid = uid;

  console.log(query);

  const count = await Address.countDocuments(query);

  try {
    Address.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort(sort)
      .then((addresses) => {
        return res.status(200).json({
          page: page.toString(),
          pages: Math.ceil(count / limit).toString(),
          limit: limit.toString(),
          count: count.toString(),
          users: addresses,
        });
      });
  } catch (err) {
    return res.status(500).json({ error: language[lang].response[500] });
  }
};

export { getAddresses };