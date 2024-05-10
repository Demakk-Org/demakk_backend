import { isValidObjectId } from "mongoose";
import { config } from "dotenv";

import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

import { Product } from "../../models/productSchema.js";
import { ProductVariant } from "../../models/productVariantSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const deleteProductVariant = async (req, res) => {
  let { productVariantId, lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!productVariantId) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(productVariantId)) {
    return ResponseHandler(res, "productVariant", 402, lang);
  }

  try {
    const productVariant = await ProductVariant.findByIdAndDelete(
      productVariantId
    );

    if (!productVariant) {
      return ResponseHandler(res, "productVariant", 404, lang);
    }

    const product = await Product.findById(productVariant.product).select(
      "productVariants"
    );

    const variantList = product?.productVariants.filter(
      (variant) => variant != productVariantId
    );

    product.productVariants = variantList;
    await product.save();

    return ResponseHandler(res, "common", 203, lang, productVariant);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
