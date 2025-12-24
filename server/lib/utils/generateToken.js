import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (id, res) => {
  const secret = process.env.JWT_SECRET || process.env.SECRET;
  if (!secret) {
    throw new Error("JWT secret is not configured");
  }

  const token = jwt.sign({ id }, secret, { expiresIn: "15d" });
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });
  return token; // Return the token so it can be sent in response body
};
