import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "alumni"], required: true },

    // Optional profile fields
    department: String,
    passingYear: String,
    company: String,        // alumni
    designation: String,    // alumni
    bio: String,
    skills: [String],
    resume: String,         // resume URL
    domain: { type: String, default: "" },
profilePhoto: { type: String, default: "" },

   // Only meaningful for alumni (students won't receive requests)
connections: [
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
],
  },
  { timestamps: true }
);



export default mongoose.model("User", userSchema);
