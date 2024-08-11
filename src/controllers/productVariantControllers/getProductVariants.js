import { config } from "dotenv";

import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

import { ProductVariant } from "../../models/productVariantSchema.js";
import { isValidObjectId } from "mongoose";

const LANG = config(process.cwd, ".env").parsed.LANG;

const getProductVariants = async (req, res) => {
  let { productVariantIds, lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (!productVariantIds || !Array.isArray(productVariantIds)) {
    return ResponseHandler(res, "common", 400, lang);
  }

  let isValid = true;

  productVariantIds.forEach((pv) => {
    if (!isValidObjectId(pv)) {
      isValid = false;
    }
  });

  if (!isValid) {
    return ResponseHandler(res, "common", 400, lang);
  }

  let query = { _id: { $in: productVariantIds } };

  try {
    const productVariants = await ProductVariant.find(query).populate([
      {
        path: "product",
        select: "name description price stockVarietyTypeList tags images",
        populate: [
          { path: "stockVarietyTypeList", select: "name" },
          {
            path: "images",
            select: "-createdAt -updatedAt -__v",
          },
        ],
      },
      {
        path: "stockVarieties",
        populate: { path: "type", select: "-createdAt -updatedAt -__v" },
      },
      {
        path: "orders",
      },
    ]);

    console.log(productVariants);
    let productVariantList = [];

    productVariants.forEach((productVariant) => {
      productVariantList.push({
        _id: productVariant._id,
        stockVarieties: productVariant.stockVarieties.map((v) => ({
          type: v.type.type,
          value: v.value,
          class: v.class,
        })),
        product: {
          _id: productVariant.product._id,
          name: productVariant.product.name.get(lang)
            ? productVariant.product.name.get(lang)
            : productVariant.product.name.get(LANG)
            ? productVariant.product.name.get(LANG)
            : productVariant.product.name.get("en"),
          description: productVariant.product.description.get(lang)
            ? productVariant.product.description.get(lang)
            : productVariant.product.description.get(LANG)
            ? productVariant.product.description.get(LANG)
            : productVariant.product.description.get("en"),
          tags: productVariant.product.tags,
          price: productVariant.product.price,
          stockVarietyTypeList: productVariant.product.stockVarietyTypeList.map(
            (l) => l.name
          ),
        },
        imageIndex: productVariant.imageIndex,
        imageUrl:
          productVariant.product.images.imageUrls[productVariant.imageIndex],
        price: productVariant.product.price + productVariant.additionalPrice,
        numberOfAvailable: productVariant.orders
          .filter((oi) => oi.isActive)
          .reduce(
            (acc, oi) => acc - oi.quantity,
            productVariant.numberOfAvailable
          ),
      });
    });

    return ResponseHandler(res, "common", 200, lang, {
      productVariants: productVariantList,
    });
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export { getProductVariants };
