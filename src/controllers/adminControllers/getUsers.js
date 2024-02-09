import { config } from "dotenv";
import User from "../../models/userSchema.js";
import response from "../../../response.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import Role from "../../models/roleSchema.js";

const { LANG, LIMIT, PAGE, SORT } = config(process.cwd, ".env").parsed;

const getUsers = async (req, res) => {
  let { page, limit, lang, sort } = req.body;

  if (!lang || !(lang in response)) {
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
      item != "sort" &&
      item != "role"
    ) {
      query[item] = req.body[item];
    }
  });

  console.log(query);

  try {
    Role.findOne({ name: req.body.role }).then(async (role) => {
      console.log(role);
      if (req.body.role == "admin" || req.body.role == "user") {
        query.role = role._id.toString();
      }
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
        .populate(
          "shippingAddress billingAddress",
          "country city subCity woreda"
        )
        .then((users) => {
          const data = {
            page: page.toString(),
            pages: Math.ceil(count / limit).toString(),
            limit: limit.toString(),
            count: count.toString(),
            users: users,
          };
          return ErrorHandler(res, 200, lang, data);
        });
    });
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};

export { getUsers };
