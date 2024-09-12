import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies["jwt"];
    console.log("token is :",token);
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const decode = jwt.verify(token, process.env.SECRET);
    console.log("decode is :",decode);
    req.user = await User.findById(decode.id);
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized" });
  }
};
export default authMiddleware;
