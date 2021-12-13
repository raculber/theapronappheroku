import express from "express";

import User from "../models/user.js";

import bcrypt from "bcrypt";
import emailValidator from "email-validator";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

const router = express.Router();

export const createUser = async (req, res) => {
  let { enteredEmail, enteredPassword, reenteredPassword } = req.body;

  if (enteredEmail) enteredEmail = enteredEmail.trim();
  if (enteredPassword) enteredPassword = enteredPassword.trim();
  if (reenteredPassword) reenteredPassword = reenteredPassword.trim();

  const findEmail = await User.exists({ email: enteredEmail });

  if (findEmail) return res.json({ message: "User already exists" });
  else if (enteredPassword !== reenteredPassword)
    return res.json({ message: "Passwords must match" });
  else if (!emailValidator.validate(enteredEmail))
    return res.json({ message: "Invalid email" });
  else if (enteredPassword.length < 6)
    return res.json({ message: "Password must be at least six characters" });
  else {
    try {
      const userId = uuidv4();
      const securedPass = await bcrypt.hash(enteredPassword, 12);

      const user = new User({
        userId: userId,
        email: enteredEmail,
        password: securedPass,
        image:
          "https://th.bing.com/th/id/R.8f185ac6c4a78763aa31acf73ee3e46b?rik=X7w93PUB4j3AXg&riu=http%3a%2f%2fcdn.onlinewebfonts.com%2fsvg%2fimg_568656.png&ehk=YMUL5OvijifwVr2xWFpqoEf4STb07PZwQdnl0ispWMc%3d&risl=&pid=ImgRaw&r=0",
      });
      user.save();
      const accessToken = jwt.sign({ userId }, process.env.TOKEN_KEY, {
        expiresIn: "24hr",
      });

      res.json({
        token: accessToken,
        result: { userId, enteredEmail },
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
};

export const updateUserPicture = async (req, res) => {
  let { userId, image } = req.body;
  const updatedUser = await User.updateOne(
    { userId: userId },
    { image: image }
  );
  if (!updatedUser) {
    res.json({ message: "Error updating image" });
  } else {
    res.json({ image: image });
  }
};

export const getUserPicture = async (req, res) => {
  console.log(req.query.userId);
  let { userId } = req.query.userId;
  console.log(userId);
  const user = await User.findOne({ userId: req.query.userId });
  console.log(user);
  if (user) {
    res.json({ image: user.image });
  }
};

export const signInUser = async (req, res) => {
  let { enteredEmail, enteredPassword } = req.body;

  enteredEmail = enteredEmail.trim();
  enteredPassword = enteredPassword.trim();

  const user = await User.findOne({ email: enteredEmail });
  if (!emailValidator.validate(enteredEmail))
    return res.json({ message: "Invalid email" });
  else if (user == null) return res.json({ message: "Invalid login" });
  else {
    const userId = user.userId;
    const validPass = await bcrypt.compare(enteredPassword, user.password);
    if (validPass) {
      const accessToken = jwt.sign({ userId }, process.env.TOKEN_KEY, {
        expiresIn: "24hr",
      });

      res.json({
        token: accessToken,
        result: { userId, enteredEmail },
      });
    } else {
      console.log("Invalid");
      res.json({ message: "Invalid login" });
    }
  }
};

export const verifyToken = async (req, res) => {
  res.json({ message: "User Authenticated" });
};
export default router;
