const resoponse = {
  response: {
    common: {
      200: "OK",
      201: "Creation completed successfully",
      202: "Update completed successfully",
      203: "Deletion completed successfully",

      400: "Missing required fields",
      401: "Unauthorized",
      404: "Not Found",
      405: "Invalid date provided",

      500: "Internal Server Error, please try again!",
      501: "Not Implemented: it is under development",
    },
    auth: {
      200: "Logged in successfilly",
      201: "Logged out successfilly",
      202: "OTP has been sent to your email",
      203: "Reset message is sent",
      204: "Your email is verified",
      205: "OTP has been sent to your phone number",
      206: "Your phone number is verified",
      207: "Your email is already verified",

      400: "Account already exists",
      401: "Request has expired, Please try again!",
      403: "Your phone number is already verified",
      404: "Passwords don't match",
      405: "Please enter valid phone number or email address!",
      406: "OTP doesn't match",
      407: "Your OTP has expired",
      408: "Your OTP has expired",
      409: "Invalid OTP id",
      410: "The password is incorrect!",
      411: "Authentication failed: No token provided",
      412: "Authentication failed: Invalid token",
      413: "Authentication failed: Token has expired",
      414: "Authentication failed: User not admin",
      415: "Phone number is not registered in your account",
      416: "Email address is not registered in your account",
      417: "Message was not sent successfully",
      418: "The email is already in use",
      419: "The password is already in use",
    },
    user: {
      201: "User is blocked",
      202: "User is unblocked",

      400: "Please provide user id",
      401: "User not found",
      402: "Invalid user id",
      403: "User is already blocked",
      404: "User not found",
      405: "User is already unblocked",
      406: "This order does not belong to this user",
      407: "This address does not belong to this user", //----
    },
    cart: {
      400: "Cart not found",
    },
    product: {
      200: "You liked this product",
      201: "You unliked this product",
      402: "Invalid product id",
      400: "Invalid product name value!",
      401: "Invalid product description value!",
      404: "Product is not found",
      405: "Invalid tag value",
      406: "At least one tag is required",
    },
    address: {
      400: "Address is not found",
      401: "Invalid address id",
    },
    stockType: {
      400: "Stock type name is invalid",
      401: "Invalid stock type id",
      404: "Stock type is not found",
    },
    role: {
      400: "Invalid role id",
      401: "The role already exists",
      402: "Role name is type of string",
      404: "Role is not found",
    },
    stockItem: {
      400: "Invalid stock item id",
      401: "Stock item name is invalid",
      404: "Stock item is not found",
    },
    productCategory: {
      400: "Invalid product category id",
      401: "Invalid product category id",
      402: "Invalid product category name value!",

      404: "Product category is not found",
    },
    order: {
      400: "Invalid order id",
      401: "Order not found",
    },
    orderItem: {
      400: "Invalid order items value!",
      401: "Invalid order item id!",
      402: "Quantity is a type of number",
      403: "Order item can not be empty",
      404: "Order item not found",
    },
    coupon: {
      400: "Invalid coupon code id!",
      401: "Invalid coupon name",
      404: "Coupon not found",
    },
    orderStatus: {
      400: "Invalid order status name",
      401: "Order status not found",
    },
    review: {
      400: "Rating is a type of number",
      401: "Review text is a value of type string",
      402: "A review has already been registered by this user",
      403: "Rating is between 1 and 5",
      404: "Specify the correct type of review",
    },
    discountType: {
      400: "Discount type name is invalid",
      401: "Invalid discount type id",
      402: "Discount amount is a type of number",
      404: "Discount type is not found",
    },
    image: {
      400: "Image name is a type of string",
      401: "Image description is a type of string",
      402: "Primary is a type of number",
      403: "Invalid Primary image value",
      404: "Images not found",
      405: "Invalid images id",
    },
  },
};

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

const doc = {
  _id: { $oid: "658778cb2740595f0491d5e2" },
  type: "Group",
  name: "Heavenly",
  uid: [
    "2Qj7AgVJOUXwdmosX10S5IoMOeC3",
    "xJJ31BD05BRyBk6VuF68DYwfjaA3",
    "saeN7av55OSoIQfXQTIbeVPhGyr1",
  ],
};
