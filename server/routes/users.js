import express from "express";
import fs from "fs";
import path from "path";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import upload from "../middleware/uploadMiddleware.js";
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
      company: req.body.company,
      designation: req.body.designation,
      department: req.body.department,
      passingYear: req.body.passingYear,
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


/* ---------- upload profile photo ---------- */
router.post(
  "/upload-profile-photo",
  protect,
  upload.single("profilePhoto"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ msg: "No file uploaded" });
      }

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { profilePhoto: req.file.filename },
        { new: true }
      ).select("-password");

      res.json({ msg: "Photo uploaded", profilePhoto: user.profilePhoto });
    } catch (err) {
      console.error("Photo upload error:", err);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

/* ---------- remove profile photo ---------- */
router.delete("/remove-profile-photo", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.profilePhoto) {
      // Delete file from disk (guard against missing file)
      const filePath = path.join("uploads", user.profilePhoto);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

      // Clear field in DB
      user.profilePhoto = null;
      await user.save();
    }

    res.json({ msg: "Photo removed" });
  } catch (err) {
    console.error("Failed to remove photo:", err);
    res.status(500).json({ msg: "Failed to remove photo" });
  }
});



export default router;