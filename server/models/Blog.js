import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  author: { type: String, default: 'Anonymous' },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    isPublic: { type: Boolean, default: false },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
     comments: [commentSchema],
  },
  { timestamps: true }
);


export default mongoose.model("Blog", blogSchema);
