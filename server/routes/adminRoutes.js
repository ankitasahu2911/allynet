import express from "express";
import { protect } from "../middleware/auth.js";
import { isAdmin } from "../middleware/admin.js";
import { getDashboardStats } from "../controllers/adminController.js";

const router = express.Router();

router.get("/dashboard", protect, isAdmin, getDashboardStats);

export default router;
