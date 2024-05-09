import { isValidObjectId } from "mongoose";
import { config } from "dotenv";

import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

import { ProductVariant } from "../../models/productVariantSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const getProductVariant = async (req, res) => {
  let productVariantId = req.params.id;
  let { lang } = req.query;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (!productVariantId) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(productVariantId)) {
    return ResponseHandler(res, "productVariant", 402, lang);
  }

  try {
    const productVariant = await ProductVariant.findById(
      productVariantId
    ).populate([
      {
        path: "product",
        select: "name description price stockVarietyTypeList tags",
        populate: { path: "stockVarietyTypeList", select: "name" },
      },
      {
        path: "stockVarieties",
        populate: { path: "type", select: "-createdAt -updatedAt -__v" },
      },
    ]);

    if (!productVariant) {
      return ResponseHandler(res, "productVariant", 404, lang);
    }

    console.log(productVariant);

    let data = {
      _id: productVariant._id,
      stockVarieties: productVariant.stockVarieties.map((v) => ({
        type: v.type.name,
        value: v.value,
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
      price: productVariant.product.price + productVariant.additionalPrice,
      numberOfAvailable: productVariant.numberOfAvailable,
    };

    return ResponseHandler(res, "common", 200, lang, data);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export default getProductVariant;
