import express from "express";
import dotenv from "dotenv";
import cors from "cors";   
import authRoutes from "../routes/auth.js";
import { connectToDB } from "../lib/db.js";
import serverless from "serverless-http";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:8081", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Connect DB once
connectToDB().then(() => console.log("✅ MongoDB connected"));

// Routes
app.use("/api/auth", authRoutes);

// ✅ Vercel requires *default export*
export default serverless(app);
