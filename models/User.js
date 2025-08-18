import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }, // ✅ match signup.js
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);
