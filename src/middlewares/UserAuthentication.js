import Jwt from "jsonwebtoken";

const UserAuthentication = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1]
    const tokenValues = Jwt.decode(token, "your_secret_key")

    const { exp } = tokenValues;
  
    if (!token) {
      return res.status(401).json({ message: "Authentication failed: No token provided" });
    }
  
    if (Date.now() > exp) {
      return res.status(401).json({ message: "Authentication failed: Token not expired" });
    }

    next()
}

export default UserAuthentication;//Bearer token