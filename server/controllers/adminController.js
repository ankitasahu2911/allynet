import Message from "../models/Message.js";
import User from "../models/User.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalMessages = await Message.countDocuments();
    const totalUsers = await User.countDocuments();
    const students = await User.countDocuments({ role: "student" });
    const alumni = await User.countDocuments({ role: "alumni" });

    res.json({ totalMessages, totalUsers, students, alumni });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
};
export const adminDashboard = (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.name}`, user: req.user });
};
