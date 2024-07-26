import { isValidObjectId } from "mongoose";
import { config, populate } from "dotenv";

import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

import OrderItem from "../../models/orderItemSchema.js";
import Cart from "../../models/cartSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const addOrderItem = async (req, res) => {
  let { productVariantId, quantity, couponCode, lang } = req.body;
  let cartId = req.user.cart;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!productVariantId || !quantity) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(productVariantId)) {
    return ResponseHandler(res, "product", 402, lang);
  }

  if (typeof quantity !== "number") {
    return ResponseHandler(res, "orderItem", 406, lang);
  }

  if (couponCode && !isValidObjectId(couponCode)) {
    return ResponseHandler(res, "couponCode", 402, lang);
  }

  try {
    let cart = await Cart.findById(cartId).populate({
      path: "orderItems",
      populate: { path: "productVariant", populate: "orders" },
    });

    if (!cart) {
      return ResponseHandler(res, "cart", 404, lang);
    }

    let productVariantsFromCart = cart.orderItems.map((oi) =>
      oi.productVariant._id.toString()
    );

    if (productVariantsFromCart.includes(productVariantId)) {
      let orderItem = cart.orderItems.find(
        (oi) => oi.productVariant._id.toString() == productVariantId
      );

      console.log(orderItem);

      let numberOfAvailableProducts = orderItem.productVariant.orders
        .filter((oi) => oi.isActive)
        .reduce(
          (acc, oi) => acc - oi.quantity,
          orderItem.productVariant.numberOfAvailable
        );

      if (numberOfAvailableProducts > orderItem.quantity) {
        OrderItem.findByIdAndUpdate(orderItem._id, {
          quantity: orderItem.quantity + 1,
        })
          .then(() => {
            return ResponseHandler(res, "orderItem", 200, lang, { orderItem });
          })
          .catch((err) => {
            console.log(err);
            return ResponseHandler(res, "common", 500, lang);
          });
      } else {
        return ResponseHandler(res, "common", 200, lang);
      }
    } else {
      const orderItem = await OrderItem.create({
        productVariant: productVariantId,
        quantity,
        couponCode,
      });

      cart.orderItems.push(orderItem);
      await cart.save();

      return ResponseHandler(res, "common", 201, lang, { cart });
    }
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
