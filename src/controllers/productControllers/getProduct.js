import { isValidObjectId } from "mongoose";
import { config } from "dotenv";
import Jwt from "jsonwebtoken";

import language from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

import { Product } from "../../models/productSchema.js";
import User from "../../models/userSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const getProduct = async (req, res) => {
  let productId = req.params?.id;
  let { lang } = req.body;
  let uid;

  const token = req.headers?.authorization?.split(" ")[1];

  if (token && Jwt.verify(token, "your_secret_key")) {
    uid = Jwt.decode(token, "your_secret_key")?.uid;
  }

  if (uid && !isValidObjectId(uid)) {
    uid = "";
  }

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (!productId) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(productId)) {
    return ResponseHandler(res, "product", 402, lang);
  }

  try {
    try {
      if (uid) {
        const user = await User.findById(uid);

        let viewed = false;
        let index;
        user.views.forEach((prod, ind) => {
          if (prod.pid == productId) {
            viewed = true;
            index = ind;
          }
        });

        if (!viewed) {
          user.views.push({
            pid: productId,
          });
          await user.save();
        } else {
          user.views = user.views.map((p) => {
            if (p.pid == productId) {
              return {
                pid: productId,
                count: p.count + 1,
              };
            } else {
              return p;
            }
          });

          await user.save();
        }
      }
    } catch (error) {
      console.log(error.message);
    }

    const product = await Product.findByIdAndUpdate(
      productId,
      {
        $inc: {
          popularity: 1,
        },
      },
      {
        returnDocument: "after",
      }
    )
      .populate({ path: "images", select: "-updatedAt -createdAt -__v" })
      .populate({
        path: "productCategory",
        select: "name additionalPrice stockItem",
        populate: {
          path: "stockItem",
          populate: {
            path: "stockType",
            select: "name availableVarieties",
            populate: {
              path: "availableVarieties",
              populate: {
                path: "stockVarietyType",
              },
            },
          },
          select: "name price",
        },
      })
      .populate({
        path: "reviews",
        select: "user rating text -_id",
        populate: {
          path: "user",
          select: "username email phoneNumber -_id",
        },
      });

    if (!product) {
      return ResponseHandler(res, "product", 404, lang);
    }

    let data = {
      id: product._id,
      name: product.name.get(lang)
        ? product.name.get(lang)
        : product.name.get(LANG)
        ? product.name.get(LANG)
        : product.name.get("en"),
      description: product.description.get(lang)
        ? product.description.get(lang)
        : product.description.get(LANG)
        ? product.description.get(LANG)
        : product.description.get("en"),
      tags: product.tags,
      price: product.price,
      reviews: product.reviews,
      rating: product.ratings,
      sold: product.sold,
      images: product?.images,
      popularity: product?.popularity,
      productCategory: product?.productCategory && {
        id: product.productCategory._id,
        name: product.productCategory.name.get(lang)
          ? product.productCategory.name.get(lang)
          : product.productCategory.name.get(LANG)
          ? product.productCategory.name.get(LANG)
          : product.productCategory.name.get("en"),
        additionalPrice: product.productCategory.additionalPrice,
        stockItem: product?.productCategory?.stockItem && {
          id: product.productCategory.stockItem._id,
          name: product.productCategory.stockItem.name.get(lang)
            ? product.productCategory.stockItem.name.get(lang)
            : product.productCategory.stockItem.name.get(LANG)
            ? product.productCategory.stockItem.name.get(LANG)
            : product.productCategory.stockItem.name.get("en"),
          stockType: product?.productCategory?.stockItem?.stockType && {
            id: product.productCategory.stockItem.stockType._id,
            name: product.productCategory.stockItem.stockType.name.get(lang)
              ? product.productCategory.stockItem.stockType.name.get(lang)
              : product.productCategory.stockItem.stockType.name.get(LANG)
              ? product.productCategory.stockItem.stockType.name.get(LANG)
              : product.productCategory.stockItem.stockType.name.get("en"),
            availableVarieties:
              product?.productCategory?.stockItem?.stockType
                ?.availableVarieties &&
              //  {
              // value:
              product.productCategory?.stockItem?.stockType?.availableVarieties,
            // },
          },
          price: product.productCategory.stockItem.price,
        },
      },
    };

    return ResponseHandler(res, "common", 200, lang, data);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export { getProduct };
