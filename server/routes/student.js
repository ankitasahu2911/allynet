import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/profile", protect, async (req, res) => {
  const student = await User.findById(req.user._id).select("-password");
  res.json(student);
});


/* ---------- OPTIONAL: update “my” profile without needing :id ---------- */
router.put("/profile", protect, async (req, res) => {
  try {
    const updates = {
      domain: req.body.domain,
      bio: req.body.bio,
      skills: req.body.skills,
      resume: req.body.resume,
    };
    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    }).select("-password");
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
