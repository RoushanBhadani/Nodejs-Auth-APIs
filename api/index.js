// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import authRoutes from "../routes/auth.js";

// dotenv.config();

// const app = express();
// app.use(express.json());

// // Routes
// app.use("/api/auth", authRoutes);

// // Connect to MongoDB (only if not already connected)
// if (!mongoose.connection.readyState) {
//   mongoose
//     .connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     })
//     .then(() => console.log("✅ MongoDB connected"))
//     .catch((err) => console.error("❌ MongoDB connection error:", err));
// }

// // Instead of app.listen, export it for Vercel
// export default app;


// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import cors from "cors";   // ✅ Import CORS
// import authRoutes from "../routes/auth.js";

// dotenv.config();

// const app = express();

// // ✅ Allow requests from frontend (localhost:8081)
// app.use(cors({
//   origin: "http://localhost:8081",
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true
// }));

// app.use(express.json());

// // Routes
// app.use("/api/auth", authRoutes);

// // Connect to MongoDB (only if not already connected)
// if (!mongoose.connection.readyState) {
//   mongoose
//     .connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     })
//     .then(() => console.log("✅ MongoDB connected"))
//     .catch((err) => console.error("❌ MongoDB connection error:", err));
// }

// // Instead of app.listen, export it for Vercel
// export default app;


// api/index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";   
import authRoutes from "../routes/auth.js";
import { connectToDB } from "../lib/db.js";   // ✅ use your db.js

dotenv.config();

const app = express();

// ✅ Allow requests from frontend (localhost:8081)
app.use(cors({
  origin: "http://localhost:8081",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Connect to DB once at startup
connectToDB().then(() => console.log("✅ MongoDB connected"));

// Routes
app.use("/api/auth", authRoutes);

export default app;  // ✅ required for Vercel
