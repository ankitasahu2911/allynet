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
      company: req.body.company,
      designation: req.body.designation,
      department: req.body.department,
      passingYear: req.body.passingYear,
      profilePhoto: req.body.profilePhoto, 
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

// routes/student.js

router.get("/alumni/:id", protect, async (req, res) => {
  try {
    const alumni = await User.findById(req.params.id).select("-password");
    if (!alumni || alumni.role !== "alumni") {
      return res.status(404).json({ msg: "Alumni not found" });
    }

    let status = "not-connected";

    if (Array.isArray(alumni.connections)) {
      const connection = alumni.connections.find(
        (c) => c.studentId && c.studentId.toString() === req.user._id.toString()
      );
      if (connection) status = connection.status;
    }

    res.json({ alumni, connectionStatus: status });
  } catch (err) {
    console.error("❌ Error in /api/student/alumni/:id", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});




// POST /api/student/connect/:id
router.post("/connect/:id", protect, async (req, res) => {
  const alumni = await User.findById(req.params.id);
  if (!alumni || alumni.role !== "alumni")
    return res.status(404).json({ msg: "Alumni not found" });

  const alreadyConnected = alumni.connections.some(
    (c) => c.studentId.toString() === req.user._id.toString()
  );

  if (alreadyConnected) {
    return res.status(400).json({ msg: "Already requested or connected" });
  }

  alumni.connections.push({ studentId: req.user._id });
  await alumni.save();

  res.json({ msg: "Connection request sent" });
});

export default router;
