import QueryByType from "../../libs/queryByType.js";
import Address from "../../models/addressSchema.js";
import User from "../../models/userSchema.js";

const addAddress = async (req, res) => {
  const {
    type,
    account,
    country,
    city,
    subCity,
    woreda,
    uniqueIdentifier,
    streetAddress,
    postalCode,
  } = req.body;

  var queryAndType = QueryByType(account);

  if (!account || !type) {
    return res.status(404).json({ message: "Bad request" });
  }

  User.findOne(queryAndType.searchQuery)
    .then((user) => {
      // console.log(user)
      try {
        Address.create({
          uid:user._id,
          country,
          city,
          subCity,
          woreda,
          uniqueIdentifier,
          streetAddress,
          postalCode,
          updatedAt: new Date(),
        })
          .then(async (data) => {
            if (type == "shippingAddress") {
              user.shippingAddress = data._id;
            } else if (type == "billingAddress") {
              user.billingAddress = data._id;
            }
            user.save();
            return res.status(200).json(data);
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).json({ message: "Server error" });
          });
      } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: "Server error!" });
      }
    })
    .catch((error) => {
      console.log(error.message)
      return res.status(404).json({ message: "Server error" });
    });
};

export default addAddress;
