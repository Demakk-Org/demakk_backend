import { isValidObjectId } from "mongoose";
import { config } from "dotenv";

import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

import { ProductVariant } from "../../models/productVariantSchema.js";
import { Product } from "../../models/productSchema.js";
import { deepEqual } from "../../utils/validate.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const updateProductVariant = async (req, res) => {
  let {
    productVariantId,
    stockVarieties,
    productId,
    additionalPrice,
    numberOfAvailable,
    imageIndex,
    lang,
  } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (
    !productVariantId ||
    (!stockVarieties &&
      !additionalPrice &&
      !productId &&
      !numberOfAvailable &&
      !imageIndex &&
      imageIndex != 0)
  ) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(productVariantId)) {
    return ResponseHandler(res, "productVariant", 402, lang);
  }

  if (productId && !isValidObjectId(productId)) {
    return ResponseHandler(res, "product", 402, lang);
  }

  if (
    additionalPrice &&
    (typeof additionalPrice !== "number" || additionalPrice <= 0)
  ) {
    return ResponseHandler(res, "common", 407, lang);
  }

  if (
    numberOfAvailable &&
    (typeof numberOfAvailable !== "number" || numberOfAvailable < 0)
  ) {
    return ResponseHandler(res, "productVariant", 407, lang);
  }

  if (imageIndex && typeof imageIndex != "number") {
    return ResponseHandler(res, "productVariant", 412, lang);
  }

  let validStockVarieties = true;

  stockVarieties?.forEach((item) => {
    if (!isValidObjectId(item.type) || typeof item.value !== "string") {
      validStockVarieties = false;
    }
  });

  if (!validStockVarieties) {
    return ResponseHandler(res, "productVariant", 408, lang);
  }

  try {
    const productVariant = await ProductVariant.findById(productVariantId);

    if (!productVariant) {
      return ResponseHandler(res, "productVariant", 404, lang);
    }

    if (productId) {
      Product.findById(productId)
        .populate({ path: "productVariants" })
        .then(async (product) => {
          if (!product) {
            return ResponseHandler(res, "product", 404, lang);
          }

          if (
            deepEqual(
              productVariant.stockVarieties,
              product.productVariants.stockVarieties
            )
          ) {
            return ResponseHandler(res, "productVariant", 411, lang);
          }

          const initialProduct = await Product.findById(
            productVariant.product
          ).select("productVariants");

          const variantList = initialProduct?.productVariants.filter(
            (variant) => variant != productVariantId
          );
          initialProduct.productVariants = variantList;
          await initialProduct.save();

          product.productVariants.push(productVariant);
          await product.save();
        })
        .finally(async () => {
          if (additionalPrice) productVariant.additionalPrice = additionalPrice;
          if (numberOfAvailable)
            productVariant.numberOfAvailable = numberOfAvailable;
          if (imageIndex || imageIndex == 0)
            productVariant.imageIndex = imageIndex;
          productVariant.product = productId;
          await productVariant.save();

          return ResponseHandler(res, "common", 202, lang, productVariant);
        });
    } else {
      if (additionalPrice) productVariant.additionalPrice = additionalPrice;
      if (numberOfAvailable)
        productVariant.numberOfAvailable = numberOfAvailable;
      if (imageIndex || imageIndex == 0) productVariant.imageIndex = imageIndex;
      await productVariant.save();

      return ResponseHandler(res, "common", 202, lang, productVariant);
    }
  } catch (error) {
    console.error(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
