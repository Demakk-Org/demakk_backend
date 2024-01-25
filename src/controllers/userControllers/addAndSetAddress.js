import QueryByType from "../../utils/queryByType.js";
import Address from "../../models/addressSchema.js";
import User from "../../models/userSchema.js";
import language from "../../../language.js";

const addAddress = async (req, res) => {
  const {
    lang,
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

  if (!lang || !(lang in language)) {
    lang = "en";
  }

  var queryAndType = QueryByType(account);

  if (!account || !type) {
    return res.status(404).json({ message: language.eng.error[404] });
  }

  User.findOne(queryAndType.searchQuery)
    .then((user) => {
      try {
        Address.create({
          uid: user._id,
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
            return res.status(500).json({ message: language[lang].error[200] });
          });
      } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: language[lang].error[500] });
      }
    })
    .catch((error) => {
      console.log(error.message);
      return res.status(404).json({ message: language[lang].error[500] });
    });
};

export default addAddress;
