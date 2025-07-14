import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // <-- check .env!

      // 🟡 Fetch full user and attach to request
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ msg: "User not found" });
      }

      next();
    } catch (err) {
      console.error("Auth failed:", err.message);
      res.status(401).json({ msg: "Token failed", error: err.message });
    }
  } else {
    res.status(401).json({ msg: "No token provided" });
  }
};


export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Add these logs to debug
    console.log("🟡 Token:", token);
    console.log("🟢 Decoded:", decoded);

    req.user = decoded;
    next();
  } catch (err) {
    console.error("🔴 Token verification failed:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};
