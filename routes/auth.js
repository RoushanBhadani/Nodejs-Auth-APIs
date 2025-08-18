// routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { connectToDB } from "../lib/db.js"; // ✅ Import DB connection helper

const router = express.Router();

// =========================
// Middleware: Auth Checker
// =========================
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; 

  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

// =========================
// Signup route
// =========================
router.post("/signup", async (req, res) => {
  try {
    await connectToDB(); // ✅ Ensure DB connection

    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User created successfully ✅" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =========================
// Login route
// =========================
router.post("/login", async (req, res) => {
  try {
    await connectToDB(); // ✅ Ensure DB connection

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =========================
// Profile route (Protected)
// =========================
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    await connectToDB(); // ✅ Ensure DB connection

    const user = await User.findById(req.user.id).select("-password"); // exclude password
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
