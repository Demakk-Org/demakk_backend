import { config } from "dotenv";

import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

import { ProductVariant } from "../../models/productVariantSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const getProductVariants = async (req, res) => {
  let { lang } = req.query;
  let { id } = req.params;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  try {
    const productVariants = await ProductVariant.find({
      product: id,
    }).populate([
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
    ]);

    let productVariantList = [];

    productVariants.forEach((productVariant) => {
      productVariantList.push({
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

        image:
          productVariant.product.images.imageUrls[productVariant.imageIndex],
        price: productVariant.product.price + productVariant.additionalPrice,
        numberOfAvailable: productVariant.numberOfAvailable,
      });
    });

    return ResponseHandler(res, "common", 200, lang, productVariantList);
  } catch (error) {
    console.log(err.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export { getProductVariants };
