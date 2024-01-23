import User from "../../models/userSchema.js";

const getUsers = (req, res) => {
  const query = req.body;
  User.find(query)
    .select("-password")
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

export default getUsers;
