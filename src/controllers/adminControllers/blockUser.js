import User from "../../models/userSchema.js";

const blockUser = (req, res) => {
  const { uid, block } = req.body;

  if (!uid && !block) {
    return res.status(400).json({ message: "UID must be specified" });
  }

  User.findById(uid).then(async (user) => {
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    try {
      user.blocked = block.blocked;
      await user.save();
      return res
        .status(200)
        .json({
          message: block ? "The User id blocked" : "The User is unblocked",
        });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  });
};

export default blockUser;
