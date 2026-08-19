import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import postRoutes from "./routes/post.routes.js";
import userRoutes from "./routes/user.routes.js"

dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());
app.use(postRoutes);
app.use(userRoutes);
app.use(express.static("uploads"))


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.log("MongoDB connection error:", error);
  }
};

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});