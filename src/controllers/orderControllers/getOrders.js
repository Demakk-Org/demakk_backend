import { config, populate } from "dotenv";

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
        populate: [
          {
            path: "productVariant",
            populate: [
              {
                path: "product",
                select: "name description images price",
                populate: "images",
              },
              {
                path: "stockVarieties",
                populate: "type",
              },
            ],
          },
        ],
      })
      .populate({ path: "orderStatus", select: "name -_id" })
      .then((orders) => {
        let orderList = [];

        orders.forEach((order) => {
          orderList.push({
            _id: order._id,
            orderItems: order.orderItems.map((orderItem) => ({
              _id: orderItem._id,
              quantity: orderItem.quantity,
              couponCode: orderItem.couponCode,
              productVariant: {
                _id: orderItem.productVariant._id,
                stockVarieties: orderItem.productVariant.stockVarieties.map(
                  (v) => ({
                    type: v.type.name,
                    value: v.value,
                    class: v.class,
                  })
                ),
                product: {
                  _id: orderItem.productVariant.product._id,
                  name: orderItem.productVariant.product.name.get(lang)
                    ? orderItem.productVariant.product.name.get(lang)
                    : orderItem.productVariant.product.name.get(LANG)
                    ? orderItem.productVariant.product.name.get(LANG)
                    : orderItem.productVariant.product.name.get("en"),
                  description: orderItem.productVariant.product.description.get(
                    lang
                  )
                    ? orderItem.productVariant.product.description.get(lang)
                    : orderItem.productVariant.product.description.get(LANG)
                    ? orderItem.productVariant.product.description.get(LANG)
                    : orderItem.productVariant.product.description.get("en"),
                  tags: orderItem.productVariant.product.tags,
                  price: orderItem.productVariant.product.price,
                  // stockVarietyTypeList:
                  //   orderItem.productVariant.product.stockVarietyTypeList.map(
                  //     (l) => l.name
                  //   ),
                },

                imageUrl:
                  orderItem.productVariant.product.images.imageUrls[
                    orderItem.productVariant.imageIndex
                  ],
                price:
                  orderItem.productVariant.product.price +
                  orderItem.productVariant.additionalPrice,
                numberOfAvailable: orderItem.productVariant.numberOfAvailable,
              },
            })),
            orderDate: order.orderDate,
            deliveryDate: order.deliveryDate,
            orderStatus: order.orderStatus.name,
          });
        });

        const data = {
          page: page.toString(),
          pages: Math.ceil(count / limit).toString(),
          limit: limit.toString(),
          count: count.toString(),
          data: orderList,
        };
        return ResponseHandler(res, "common", 200, lang, data);
      });
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
