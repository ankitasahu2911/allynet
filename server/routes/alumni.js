import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

/* ---------- GET all alumni (Student side) ---------- */
router.get("/all", protect, async (req, res) => {
  try {
    const alumni = await User.find({ role: "alumni" }).select("-password");
    res.json(alumni);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

/* ---------- Student → Alumni connect request ---------- */
router.post("/connect/:alumniId", protect, async (req, res) => {
  try {
    console.log("🔁 Request received");
    console.log("Student ID:", req.user?._id);
    console.log("Target Alumni ID:", req.params.alumniId);

    const alumni = await User.findById(req.params.alumniId);
    if (!alumni || alumni.role !== "alumni") {
      console.log("❌ Alumni not found or not valid");
      return res.status(404).json({ msg: "Alumni not found" });
    }

   const already = alumni.connections.some(
  (c) => c?.studentId?.toString() === req.user._id.toString()
);

    if (already) {
      console.log("⚠️ Request already sent");
      return res.status(400).json({ msg: "Request already sent" });
    }

    alumni.connections.push({ studentId: req.user._id });
    await alumni.save();
    console.log("✅ Connection request saved");
    res.json({ msg: "Request sent successfully" });

  } catch (err) {
    console.error("🔥 Server error:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});



/* ---------- GET pending requests (Alumni side) ---------- */
router.get("/requests", protect, async (req, res) => {
  try {
    if (req.user.role !== "alumni")
      return res.status(403).json({ msg: "Access denied" });

    const alumni = await User.findById(req.user._id).populate(
      "connections.studentId",
      "-password"
    );

    if (!alumni)
      return res.status(404).json({ msg: "Alumni user not found" });

    const pending = alumni.connections.filter((c) => c.status === "pending");
    res.json(pending);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

/* ---------- POST accept / reject request ---------- */
router.post("/requests/:studentId", protect, async (req, res) => {
  const { action } = req.body;         // 'accept' | 'reject'
  console.log("⇢ Accept/Reject hit");
  console.log("• action:", action);
  console.log("• alumni ID:", req.user._id);
  console.log("• student ID param:", req.params.studentId);

  try {
    if (req.user.role !== "alumni") {
      console.log("✗ role not alumni");
      return res.status(403).json({ msg: "Access denied" });
    }

    const alumni = await User.findById(req.user._id);
    if (!alumni) {
      console.log("✗ alumni doc not found");
      return res.status(404).json({ msg: "Alumni not found" });
    }

    const conn = alumni.connections.find(
      (c) => c.studentId?.toString() === req.params.studentId
    );
    if (!conn) {
      console.log("✗ connection not found");
      return res.status(404).json({ msg: "Connection not found" });
    }

    conn.status = action === "accept" ? "accepted" : "rejected";
    await alumni.save();
    console.log(`✓ Connection ${action}ed`);
    return res.json({ msg: `Connection ${action}ed successfully` });
  } catch (err) {
    console.error("🔥 accept/reject error:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});






// GET /api/alumni/profile  – return logged‑in alumni’s own data
router.get("/profile", protect, async (req, res) => {
  try {
    // make sure this user really is an alumni
    if (req.user.role !== "alumni") {
      return res.status(403).json({ msg: "Access denied" });
    }

    // req.user already contains the full user from protect
    res.json(req.user);               // everything except password
  } catch (err) {
    console.error("Profile fetch error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// PUT /api/alumni/profile  – update the logged‑in alumni’s own profile
router.put("/profile", protect, async (req, res) => {
  try {
    if (req.user.role !== "alumni")
      return res.status(403).json({ msg: "Access denied" });

    const updates = {
      domain: req.body.domain,
      bio: req.body.bio,
      skills: req.body.skills,
      resume: req.body.resume,
    };

    const alumni = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    }).select("-password");

    res.json(alumni);
  } catch (err) {
    console.error("Profile update error:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});



export default router;

