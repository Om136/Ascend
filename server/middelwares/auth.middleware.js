import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {
  try {
    const cookieToken = req.cookies?.jwt;
    const authHeader = req.headers?.authorization;
    const headerToken =
      typeof authHeader === "string" && authHeader.startsWith("Bearer ")
        ? authHeader.slice("Bearer ".length).trim()
        : null;

    const token = cookieToken || headerToken;
    if (!token) return res.status(401).json({ message: "Not authorized" });

    const secret = process.env.JWT_SECRET || process.env.SECRET;
    if (!secret) {
      return res.status(500).json({ message: "Server auth is not configured" });
    }

    const decode = jwt.verify(token, secret);
    const user = await User.findById(decode.id);
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized" });
  }
};
export default authMiddleware;
