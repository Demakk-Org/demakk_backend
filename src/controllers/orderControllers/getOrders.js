import { config } from "dotenv";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import OrderStatus from "../../models/orderStatusSchema.js";
import Order from "../../models/orderSchema.js";

const { LIMIT, PAGE, LANG, SORT } = config(process.cwd, ".env").parsed;

export const getOrders = async (req, res) => {
  let { page, limit, lang, sort, orderStatus } = req.body;
  let uid = req.uid;

  if (!lang || !(lang in responsse)) {
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
    return ResponseHandler(res, "orderStatus", 401, lang);
  }

  const order = await OrderStatus.findOne({ name: orderStatus });

  if (orderStatus && !order) {
    return ResponseHandler(res, "orderStatus", 404, lang);
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
      .select("-updatedAt -createdAt -__v")
      .populate({
        path: "orderItems",
        select: "product quantity -_id",
        populate: { path: "product", select: "name price -_id" },
      })
      .populate({ path: "orderStatus", select: "name -_id" })
      .then((order) => {
        const data = {
          page: page.toString(),
          pages: Math.ceil(count / limit).toString(),
          limit: limit.toString(),
          count: count.toString(),
          data: order,
        };
        return ResponseHandler(res, "common", 200, lang, data);
      });
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
