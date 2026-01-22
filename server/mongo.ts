import mongoose from "mongoose";

export async function connectToMongo() {
  if (!process.env.MONGODB_URI) {
    console.warn("MONGODB_URI is not set. Bot storage will not work.");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

const userSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  username: String,
  firstName: String,
  isBlocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const jobSchema = new mongoose.Schema({
  telegramId: { type: String, required: true },
  fileId: String,
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
  watermarkType: String,
  settings: Object,
  createdAt: { type: Date, default: Date.now },
  completedAt: Date,
});

export const User = mongoose.model("User", userSchema);
export const Job = mongoose.model("Job", jobSchema);
