import express from "express"; 
import Blog from "../models/Blog.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  createBlog,
  getPublicBlogs,
  getMyBlogs,
  addCommentToBlog
} from "../controllers/blogController.js";

const router = express.Router();

// 🔓 Public
router.get("/public", getPublicBlogs);
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author", "name profilePhoto");
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ msg: "Failed to load blogs" });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "name profilePhoto");
    if (!blog) return res.status(404).json({ msg: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching blog" });
  }
});

// 🔐 Protected
router.get("/my", protect, getMyBlogs);
router.post("/", protect, createBlog);


// blogRoutes.js or similar
router.post('/:id/comments', addCommentToBlog);

export default router;
