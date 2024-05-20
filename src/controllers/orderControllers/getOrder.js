import { isValidObjectId } from "mongoose";
import { config } from "dotenv";

import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

import Order from "../../models/orderSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const getOrder = async (req, res) => {
  let { lang } = req.body;
  let orderId = req.params.id;
  let uid = req.uid;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!orderId) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(orderId)) {
    return ResponseHandler(res, "order", 402, lang);
  }

  try {
    const order = await Order.findById(orderId)
      .select("-updatedAt -__v")
      .populate({
        path: "user",
        select: "firstName lastName email phoneNumber",
      })
      .populate({
        path: "orderStatus",
        select: "name",
      })
      .populate({
        path: "orderItems",
        // select: "productVariant quantity",
        populate: {
          path: "productVariant",
          // select: "name product price imageIndex images stockVarieties",
          populate: {
            path: "product",
            // select: "name price images",
            populate: "images",
          },
        },
      });

    console.log(order);

    if (!order) {
      return ResponseHandler(res, "order", 404, lang);
    }

    if (order.user?._id.toString() != uid) {
      return ResponseHandler(res, "order", 405, lang);
    }

    let orderData = {
      _id: order._id,
      orderItems: order.orderItems.map((orderItem) => ({
        _id: orderItem._id,
        quantity: orderItem.quantity,
        couponCode: orderItem.couponCode,
        productVariant: {
          _id: orderItem.productVariant._id,
          stockVarieties: orderItem.productVariant.stockVarieties.map((v) => ({
            type: v.type.name,
            value: v.value,
            class: v.class,
          })),
          product: {
            _id: orderItem.productVariant.product._id,
            name: orderItem.productVariant.product.name.get(lang)
              ? orderItem.productVariant.product.name.get(lang)
              : orderItem.productVariant.product.name.get(LANG)
              ? orderItem.productVariant.product.name.get(LANG)
              : orderItem.productVariant.product.name.get("en"),
            description: orderItem.productVariant.product.description.get(lang)
              ? orderItem.productVariant.product.description.get(lang)
              : orderItem.productVariant.product.description.get(LANG)
              ? orderItem.productVariant.product.description.get(LANG)
              : orderItem.productVariant.product.description.get("en"),
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
    };

    return ResponseHandler(res, "common", 200, lang, orderData);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
