import { config } from "dotenv";

import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import Cart from "../../models/cartSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const getCart = async (req, res) => {
  let { lang } = req.body;

  let cartId = req.user.cart;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  try {
    const cartResponse = await Cart.findById(cartId)
      .populate({
        path: "orderItems",
        select: "productVariant quantity isChecked",
        populate: {
          path: "productVariant",
          select: "-createdAt -updatedAt -__v",
          populate: {
            path: "product",
            select: "name price images",
            populate: {
              path: "images",
            },
          },
        },
      })
      .select("orderItems");

    if (!cartResponse) {
      return ResponseHandler(res, "cart", 404, lang);
    }

    let cart = {
      id: cartResponse._id,
      orderItems: cartResponse.orderItems.map((orderItem) => ({
        _id: orderItem._id,
        quantity: orderItem.quantity,
        couponCode: orderItem.couponCode,
        productVariant: {
          _id: orderItem.productVariant._id,
          stockVarieties: orderItem.productVariant.stockVarieties,
          product: {
            _id: orderItem.productVariant.product._id,
            name: orderItem.productVariant.product.name.get(lang)
              ? orderItem.productVariant.product.name.get(lang)
              : orderItem.productVariant.product.name.get(LANG)
              ? orderItem.productVariant.product.name.get(LANG)
              : orderItem.productVariant.product.name.get("en"),
          },
          imageIndex: orderItem.productVariant.imageIndex,
          numberOfAvailable: orderItem.productVariant.numberOfAvailable,
          price:
            orderItem.productVariant.additionalPrice +
            orderItem.productVariant.product.price,
          imageUrl:
            orderItem.productVariant.product.images.imageUrls[
              orderItem.productVariant.imageIndex
            ],
        },
        isChecked: orderItem.isChecked,
      })),
    };

    return ResponseHandler(res, "common", 200, lang, { cart });
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
