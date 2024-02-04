response:{
  common:{
    200:"Creation completed successfully",
    201:"Update completed successfully",
    202:"Deletion completed successfully",
    203:"Deletion completed successfully",
    400: "Missing required fields",

  },
  auth:{
    204:"Logged in successfilly",
    205:"Logged out successfilly",
    206:"OTP has been sent to your email",
    207:"Reset message is sent",
    208:"",
    400: "Account already exists",
    401: "Request has expired, Please try again!",
    402: "Your email is already verified",
    403: "Your phone number is already verified",
    414: "Your OTP has expired",
    
    },
  user: {
    201: "User is blocked",
    202: "User is unblocked",

    400: "Please provide user id",
    401: "User not found",
    402: "Invalid user id",
    403: "User is already blocked",
  }
}

const TaskSchema = new Schema({
  name: String,
  type: String,
  description: String,
  color: String,
  price: Number,
});

const Task = mongoose.model("Task", TaskSchema);

const { LANG, LIMIT, PAGE, SORT } = config(process.cwd, ".env").parsed;

export function createRandomProduct() {
  return {
    name: faker.commerce.productName(),
    type: faker.commerce.productMaterial(),
    description: faker.commerce.productDescription(),
    color: faker.color.human(),
    price: faker.commerce.price({ min: 100, max: 2000 }),
  };
}

export const Products = faker.helpers.multiple(createRandomProduct, {
  count: 10,
});


export const aggregateProducts = async (req, res) => {
  const agg = [
    {
      $lookup: {
        from: "productcategories",
        localField: "productCategory",
        foreignField: "_id",
        as: "productCategory",
      },
    },
    {
      $addFields: {
        productCategory: {
          $first: "$productCategory",
        },
      },
    },
    {
      $lookup: {
        from: "stockitems",
        localField: "productCategory.stockItem",
        foreignField: "_id",
        as: "productCategory.stockItem",
      },
    },
    {
      $addFields: {
        "productCategory.stockItem": {
          $first: "$productCategory.stockItem",
        },
      },
    },
    {
      $lookup: {
        from: "stocktypes",
        localField: "productCategory.stockItem.stockType",
        foreignField: "_id",
        as: "productCategory.stockItem.stockType",
        pipeline: [
          {
            $search: {
              text: {
                query: "melka",
                path: {
                  wildcard: "*",
                },
              },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        "productCategory.stockItem.stockType": {
          $first: "$productCategory.stockItem.stockType",
        },
      },
    },
  ];

  try {
    const products = await Product.aggregate(agg).search({
      text: {
        query: "baseball",
        path: {
          wildcard: "*",
        },
      },
    });
    console.log(products);
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const addProducts = async (req, res) => {
  try {
    const products = await Task.create(Products);
    // const products = await Task.deleteMany({});

    res.json(products);
  } catch (error) {
    console.log(error);
    res.json({ error: error.message });
  }
};

import Jwt from "jsonwebtoken";
import User from "../../models/userSchema.js";
import language from "../../../language.js";
import { ObjectId } from "bson";
import Address from "../../models/addressSchema.js";

const updateAddress = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  let { addressId, type, lang } = req.body;

  const { uid } = Jwt.decode(token, "your_secret_key");

  if (!lang || !(lang in language)) {
    lang = "en";
  }

  if (!ObjectId.isValid(addressId)) {
    return res.status(400).json({
      message: language[lang].response[407],
    });
  }

  if (type != "billingAddress" && type != "shippingAddress") {
    return res.status(400).json({
      message: language[lang].response[400],
    });
  }

  var query;
  if (type == "shippingAddress") {
    query = { shippingAddress: addressId };
  } else if (type == "billingAddress") {
    query = { billingAddress: addressId };
  }

  const address = await Address.findById(addressId);

  if (!address) {
    return res.status(404).json({
      message: language[lang].response[407],
    });
  }

  console.log(query);

  try {
    const user = await User.findByIdAndUpdate(uid, query, {
      returnDocument: "after",
    })
      .populate(type, "-updatedAt -createdAt -uid")
      .select(type);
    res.status(200).json({
      message: language[lang].response[203],
      data: user,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: language[lang].response[500] });
  }
};

export default updateAddress;
