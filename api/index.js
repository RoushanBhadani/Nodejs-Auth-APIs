import express from "express";
import dotenv from "dotenv";
import cors from "cors";   
import authRoutes from "../routes/auth.js";
import { connectToDB } from "../lib/db.js";
import serverless from "serverless-http";

dotenv.config();

const app = express();

// ✅ Allow frontend requests
app.use(cors({
  origin: "http://localhost:8081",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// ✅ Ensure DB connects only once (global cache in serverless)
let isConnected = false;
async function initDB() {
  if (!isConnected) {
    await connectToDB();
    isConnected = true;
    console.log("✅ MongoDB connected");
  }
}
initDB();

// Routes
app.use("/api/auth", authRoutes);

// ✅ Default export for Vercel
export default serverless(app);
