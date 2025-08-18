// lib/db.js
import mongoose from 'mongoose';

const { MONGODB_URI } = process.env;
if (!MONGODB_URI) {
  throw new Error('Missing MONGODB_URI env var');
}

// Reuse connection across invocations
let cached = global._mongoose;
if (!cached) cached = global._mongoose = { conn: null, promise: null };

export async function connectToDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    mongoose.set('strictQuery', true);
    cached.promise = mongoose.connect(MONGODB_URI, {
      // You can set dbName here, otherwise it uses the DB in your URI
      bufferCommands: false,
      maxPoolSize: 5
    }).then(m => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
