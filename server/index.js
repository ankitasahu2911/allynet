import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { protect } from "./middleware/authMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import alumniRoutes from "./routes/alumni.js";
import studentRoutes from "./routes/student.js";
// import user from "./routes/user.js";
import userRoutes from './routes/users.js';
dotenv.config();
// const JWT_SECRET = process.env.j8B9lKEF2MJLosfTWRMzKejZRsqRhTZ2;
// console.log("JWT_SECRET is:", process.env.JWT_SECRET);
// if (!JWT_SECRET) {
//   console.error("JWT_SECRET is not defined in .env file");
//   process.exit(1);
// }
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.send("AllyNet API running 🚀");
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}).catch(err => console.log(err));

// Import routes
app.use("/api/auth", authRoutes);

// Example protected route
// This route requires authentication
app.get("/api/protected", protect, (req, res) => {
  res.json({ msg: `Hello ${req.user.role}, protected content unlocked!` });
});

// Import alumni routes
app.use("/api/alumni", alumniRoutes);

// Import student routes
app.use("/api/student", studentRoutes);

// app.use("/api/users", user);
app.use('/api/users', userRoutes);     