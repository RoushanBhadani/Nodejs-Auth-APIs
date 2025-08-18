import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGODB_URI; // <-- expects this
  if (!uri) {
    throw new Error("Missing MONGODB_URI env var");
  }
  await mongoose.connect(uri);
};

export default connectDB;
