import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (id, res) => {
  const token = jwt.sign({ id }, process.env.SECRET, { expiresIn: "15d" });
  console.log(token);
  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });
  console.log("Cookie set");
  return token; // Return the token so it can be sent in response body
};
