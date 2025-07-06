import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// PUT /api/users/profile
router.put("/profile", protect, async (req, res) => {
  try {
    // If the client already sends an array keep it; if it's a string, split it.
    const skills =
      Array.isArray(req.body.skills)
        ? req.body.skills
        : req.body.skills
            ?.split(",")
            .map((s) => s.trim())
            .filter(Boolean);

    const updates = {
      domain: req.body.domain,
      bio: req.body.bio,
      skills,          // use the cleaned array
      resume: req.body.resume,
      
    };

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});




export default router;