import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send("API is running 🚀"));

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("✅ MongoDB connected");
  app.listen(process.env.PORT || 3000, () =>
    console.log(`🚀 Server running at http://localhost:${process.env.PORT || 3000}`)
  );
});
