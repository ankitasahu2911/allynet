import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { protect } from "./middleware/authMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import alumniRoutes from "./routes/alumni.js";
import studentRoutes from "./routes/student.js";

import userRoutes from "./routes/users.js";
import { adminDashboard } from "./controllers/adminController.js";

import { isAdmin } from "./middleware/admin.js";
import messageRoutes from "./routes/messageRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.send("AllyNet API running 🚀");
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  })
  .catch((err) => console.log(err));

// Import routes
app.use("/api/auth", authRoutes);

// Example protected route
// This route requires authentication
app.get("/api/protected", protect, (req, res) => {
  res.json({ msg: `Hello ${req.user.role}, protected content unlocked!` });
});

app.use("/uploads", express.static("uploads")); // serve uploaded images

// Import alumni routes
app.use("/api/alumni", alumniRoutes);

// Import student routes
app.use("/api/student", studentRoutes);

// app.use("/api/users", user);
app.use("/api/users", userRoutes);

// Import message routes
// app.use("/api/messages", messageRoutes);
// const messageRoutes = require("./routes/messageRoutes");
app.use("/api/message", messageRoutes);

app.get("/admin-dashboard", protect, isAdmin, adminDashboard);
app.use("/api/blogs", blogRoutes);

app.use((err, req, res, next) => {
  console.error("🔥 Uncaught error:", err);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});
