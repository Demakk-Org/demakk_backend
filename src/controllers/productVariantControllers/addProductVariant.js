import { isValidObjectId } from "mongoose";
import { config } from "dotenv";

import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

import { Product } from "../../models/productSchema.js";
import { ProductVariant } from "../../models/productVariantSchema.js";
import { deepEqual } from "../../utils/validate.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const addProductVariant = async (req, res) => {
  let {
    lang,
    stockVarieties,
    productId,
    additionalPrice,
    imageIndex,
    numberOfAvailable,
  } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!stockVarieties || !productId || !numberOfAvailable) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(productId)) {
    return ResponseHandler(res, "product", 402, lang);
  }

  if (typeof additionalPrice != "number") {
    return ResponseHandler(res, "common", 407, lang);
  }

  if (typeof numberOfAvailable != "number") {
    return ResponseHandler(res, "productVariant", 405, lang);
  }

  if (imageIndex && typeof imageIndex != "number") {
    return ResponseHandler(res, "productVariant", 406, lang);
  }

  if (!Array.isArray(stockVarieties)) {
    return ResponseHandler(res, "stockVariety", 407, lang);
  }

  if (!stockVarieties.length) {
    return ResponseHandler(res, "productVariant", 412, lang);
  }

  let validStockVarieties = true;
  let classType = 0;

  stockVarieties.forEach((item) => {
    if (
      !isValidObjectId(item.type) ||
      typeof item.value !== "string" ||
      (item.class != "Main" && item.class != "Sub")
    ) {
      validStockVarieties = false;
    }

    if (item.class == "Main") classType++;
  });

  if (classType == 2) {
    return ResponseHandler(res, "productVariant", 413, lang);
  }

  if (!validStockVarieties) {
    return ResponseHandler(res, "productVariant", 408, lang);
  }

  try {
    const product = await Product.findById(productId).populate(
      "productVariants"
    );

    if (!product) {
      return ResponseHandler(res, "product", 404, lang);
    }

    console.log("from product variant", product);

    if (!product.stockVarietyTypeList) {
      return ResponseHandler(res, "product", 410, lang);
    }

    let validStockVarieties = true;
    let validStockVarietiesList = [];

    product.stockVarietyTypeList
      .map((v) => v.toString())
      .forEach((variant) => {
        if (!stockVarieties.map((v) => v.type).includes(variant)) {
          validStockVarieties = false;
          return;
        }
        validStockVarietiesList.push({
          type: variant,
          value: stockVarieties.find((v) => v.type === variant).value,
          class: stockVarieties.find((v) => v.type === variant).class,
        });
      });

    if (!validStockVarieties) {
      return ResponseHandler(res, "productVariant", 409, lang);
    }

    let exists = false;

    product.productVariants.forEach((variant) => {
      if (
        deepEqual(
          stockVarieties,
          variant.stockVarieties.map((v) => ({
            type: v.type.toString(),
            value: v.value,
            class: v.class,
          }))
        )
      ) {
        exists = true;
      }
    });

    if (exists) {
      return ResponseHandler(res, "productVariant", 411, lang);
    }

    ProductVariant.create({
      stockVarieties: validStockVarietiesList,
      product: productId,
      additionalPrice,
      numberOfAvailable,
      imageIndex,
    }).then(async (data) => {
      let variantList = [...product.productVariants, data._id];
      product.productVariants = variantList;
      await product.save();

      return ResponseHandler(res, "common", 201, lang, data);
    });
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
