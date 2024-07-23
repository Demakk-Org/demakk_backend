import { config } from "dotenv";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import Order from "../../models/orderSchema.js";

const { LANG, LIMIT, SORT, PAGE } = config(process.cwd, ".env").parsed;

const getDeletedOrders = (req, res) => {
  let { page, limit, lang, sort } = req.query;
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

  try {
    Order.find({ user: uid })
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
      .populate({
        path: "deliveryAddress",
        select: "-__v -createdAt -updatedAt",
      })
      .populate({ path: "orderStatus", select: "name -_id" })
      .then((orders) => {
        let orderList = [];

        orders.forEach((order) => {
          if (
            order.orderItems.filter((oi) => oi.isActive == false).length == 0
          ) {
            return;
          }

          orderList.push({
            _id: order._id,
            orderItems: order.orderItems
              .filter((oi) => oi.isActive == false)
              .map((orderItem) => ({
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
                    description:
                      orderItem.productVariant.product.description.get(lang)
                        ? orderItem.productVariant.product.description.get(lang)
                        : orderItem.productVariant.product.description.get(LANG)
                        ? orderItem.productVariant.product.description.get(LANG)
                        : orderItem.productVariant.product.description.get(
                            "en"
                          ),
                    tags: orderItem.productVariant.product.tags,
                    price: orderItem.productVariant.product.price,
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
            deliveryAddress: order.deliveryAddress,
          });
        });

        const data = {
          page: page.toString(),
          pages: Math.ceil(orderList.length / limit).toString(),
          limit: limit.toString(),
          count: orderList.length.toString(),
          list: orderList,
        };
        return ResponseHandler(res, "common", 200, lang, { orders: data });
      });
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export default getDeletedOrders;
