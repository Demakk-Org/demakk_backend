import Jwt from "jsonwebtoken";


const logInAuthenticate = (req, res, next) => {
  try {

    const token = req.headers.authorization.split(" ")[1]
    const decode = Jwt.verify(token, "your_secret_key")


    console.log(decode)
    next()
  }
  catch (error) {
    res.json({
      message: "Authentication faild"
    })
  }
}

export default logInAuthenticate;