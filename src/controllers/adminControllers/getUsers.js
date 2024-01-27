import { config } from "dotenv";
import User from "../../models/userSchema.js";
import language from "../../../language.js";
import { ObjectId } from "bson";

const { LANG, LIMIT, PAGE, SORT } = config(process.cwd, ".env").parsed;

const getUsers = async (req, res) => {
  let { page, limit, lang, sort } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (sort === undefined) sort = SORT;

  if (page === undefined) page = PAGE;
  if (limit === undefined) limit = LIMIT;

  let query = {};

  Array.from(Object.keys(req.body)).forEach((item) => {
    if (item == "role" && !ObjectId.isValid(req.body[item])) {
      return res.status(400).json({ message: language[lang].response[426] });
    } else if (
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

  const count = await User.countDocuments(query);

  try {
    User.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort(sort)
      .select(
        "email phoneNumber firstName lastName role shippingAddress billingAddress cart blocked"
      )
      .populate("role", "name")
      .populate("cart", "orderItems")
      .populate("shippingAddress billingAddress", "country city subCity woreda")
      .then((users) => {
        return res.status(200).json({
          page: page.toString(),
          pages: Math.ceil(count / limit).toString(),
          limit: limit.toString(),
          count: count.toString(),
          users: users,
        });
      });
  } catch (err) {
    return res.status(500).json({ error: language[lang].response[500] });
  }
};

export default getUsers;
