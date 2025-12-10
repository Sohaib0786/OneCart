import User from "../model/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import { genToken, genToken1 } from "../config/token.js";

// Helper function to set cookie
const setCookie = (res, token, days = 7) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction, // Only true in production
    sameSite: isProduction ? "None" : "Strict",
    maxAge: days * 24 * 60 * 60 * 1000, // default 7 days
  });
};

// Registration Controller
export const registration = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Enter a valid Email" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashPassword,
    });

    const token = await genToken(user._id);
    setCookie(res, token);

    return res.status(201).json(user);
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: `Registration error: ${error.message}` });
  }
};

// Login Controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = await genToken(user._id);
    setCookie(res, token);

    return res.status(200).json(user);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: `Login error: ${error.message}` });
  }
};

// Logout Controller
export const logOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
    });
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: `Logout error: ${error.message}` });
  }
};

// Google Login Controller
export const googleLogin = async (req, res) => {
  try {
    const { name, email } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email });
    }

    const token = await genToken(user._id);
    setCookie(res, token);

    return res.status(200).json(user);
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({ message: `Google login error: ${error.message}` });
  }
};

// Admin Login Controller
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = await genToken1(email);
      setCookie(res, token, 1); // Admin token expires in 1 day

      return res.status(200).json({ token });
    }

    return res.status(400).json({ message: "Invalid credentials" });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({ message: `Admin login error: ${error.message}` });
  }
};
