import User from "../models/user.model.js";
import bycrpt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";

export const signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      res.status(400).json({ error: "email already exists" });
    }
    const hashedPassword = await bycrpt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    }); 

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res)
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        username: newUser.username, 
        email: newUser.email, 
      })
    }
    else{
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log(error);
  }
};
export const login = async (req, res) => {
  const {username,password} = req.body;
  const user = await User.findOne({username});
  const isMatch = bycrpt.compare(password, user?.password);
  if(!user || !isMatch){
    res.status(400).json({error:"Invalid Credentials"})
  }
  generateTokenAndSetCookie(user._id,res)
  res.status(200).json({
    _id: user._id,
    username: user.username, 
    email: user.email, 
  })
   
};
export const logOut = async (req, res) => {
  res.send("Sign Up Route");
};
