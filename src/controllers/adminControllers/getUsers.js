import { config } from "dotenv";
import User from "../../models/userSchema.js";
import language from "../../../language.js";
import { isValidObjectId } from "mongoose";
import { ErrorHandler } from "../../utils/errorHandler.js";

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
    if (item == "role" && !isValidObjectId(req.body[item])) {
      return ErrorHandler(res, 426, lang);
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

  try {
    const count = await User.countDocuments(query);

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
    console.log(err.message);
    return ErrorHandler(res, 500, lang);
  }
};

export default getUsers;
