import { config } from "dotenv";

import { isDateValid } from "../../utils/validate.js";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

import Order from "../../models/orderSchema.js";
import Cart from "../../models/cartSchema.js";
import { ProductVariant } from "../../models/productVariantSchema.js";
import { isValidObjectId } from "mongoose";
import { Product } from "../../models/productSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const addOrder = async (req, res) => {
  let { deliveryDate, deliveryAddressId, lang } = req.body;
  let uid = req.uid;
  let user = req.user;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!deliveryAddressId || !deliveryDate) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(deliveryAddressId)) {
    return ResponseHandler(res, "address", 402, lang);
  }

  if (deliveryDate && !isDateValid(deliveryDate)) {
    return ResponseHandler(res, "common", 405, lang);
  }

  try {
    let cart = await Cart.findById(user.cart).populate({
      path: "orderItems",
      select: "productVariant isChecked",
      populate: {
        path: "productVariant",
        select: "product",
        populate: {
          path: "product",
          select: "name",
        },
      },
    });

    if (!cart) {
      return ResponseHandler(res, "cart", 404, lang);
    }

    let checkedOrderItems = cart.orderItems.filter((oi) => oi.isChecked);

    console.log(checkedOrderItems);

    if (checkedOrderItems.length == 0) {
      return ResponseHandler(res, "common", 400, lang);
    }

    let productIds = checkedOrderItems.map(
      (oi) => oi.productVariant.product._id
    );

    let increaseProductSellCount = productIds.map((p) =>
      Product.findByIdAndUpdate(p, {
        $inc: {
          sold: 1,
        },
      })
    );

    let promises = checkedOrderItems.map((oi) =>
      ProductVariant.findOneAndUpdate(
        { _id: oi.productVariant },
        {
          $push: {
            orders: oi._id,
          },
        }
      )
    );

    Order.create({
      user: uid,
      orderItems: cart.orderItems
        .filter((oi) => oi.isChecked)
        .map((oi) => oi._id),
      deliveryAddress: deliveryAddressId,
      deliveryDate,
      orderStatus: "663fd0f4f89e8b403ab77c90",
    }).then(async (data) => {
      user.orders.push(data._id);
      cart.orderItems = cart.orderItems.filter((oi) => !oi.isChecked);

      Promise.all([
        user.save(),
        cart.save(),
        ...promises,
        ...increaseProductSellCount,
      ])
        .then(() => {
          return ResponseHandler(res, "common", 201, lang, { order: data });
        })
        .catch((err) => {
          console.log(err);
          return ResponseHandler(res, "common", 500, lang);
        });
    });
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
