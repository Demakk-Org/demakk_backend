import Cart from "../../models/cartSchema.js";
import User from "../../models/userSchema.js";

const deleteUser = (req, res) => {
  const { uid } = req.body;

  if (!uid) {
    return res.status(400).json({
      status: 400,
      message: "Please provide user id",
    });
  }

  User.findById(uid, "cart")
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          status: 404,
          message: "User not found",
        });
      }

      Cart.findByIdAndDelete(user.cart)
        .then((cart) => {
          if (!cart) {
            res.status(404).json({
              status: 404,
              message: "Cart not found",
            });
          }
        })
        .catch((error) => {
          return res.status(500).json({
            status: 500,
            message: "Unable to find and delete the cart, please try again!",
          });
        });
    })
    .catch((error) => {
      return res.status(500).json({
        status: 500,
        message: "Unable to find the user, please try again!",
      });
    })
    .finally(async () => {
      try {
        const user = await User.findByIdAndDelete(uid);
        if (user) {
          return res.status(200).json({
            status: 200,
            message: "User deleted successfully",
            user,
          });
        }
      } catch (error) {
        return res
          .status(500)
          .json({ message: "Unable to delete the user, please try again!" });
      }
    });
};

export default deleteUser;
