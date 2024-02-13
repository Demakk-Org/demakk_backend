import { config } from "dotenv";
import OrderStatus from "../../models/orderStatusSchema.js";
import Order from "../../models/orderSchema.js";
import response from "../../../response.js";
import { ErrorHandler } from "../../utils/errorHandler.js";

const { LIMIT, PAGE, LANG, SORT } = config(process.cwd, ".env").parsed;

export const getOrders = async (req, res) => {
  let { page, limit, lang, sort, orderStatus } = req.body;
  let uid = req.uid;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (sort === undefined) sort = SORT;
  if (page === undefined || typeof page !== "number") page = PAGE;
  if (limit === undefined || typeof limit !== "number") limit = LIMIT;

  let query = { user: uid };

  if (orderStatus && typeof orderStatus !== "string") {
    return ErrorHandler(res, 470, lang);
  }

  const order = await OrderStatus.findOne({ name: orderStatus });

  if (orderStatus && !order) {
    return ErrorHandler(res, 473, lang);
  }

  if (orderStatus) {
    query.orderStatus = order._id;
  }

  console.log(query, req?.language);

  try {
    const count = await Order.countDocuments(query);
    Order.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort(sort)
      .populate("OrderItem OrderStatus")
      .then((order) => {
        const data = {
          page: page.toString(),
          pages: Math.ceil(count / limit).toString(),
          limit: limit.toString(),
          count: count.toString(),
          data: order,
        };
        return ErrorHandler(res, 200, lang, data);
      });
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};
