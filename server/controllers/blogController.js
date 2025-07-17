import Blog from "../models/Blog.js";

// Create new blog
const createBlog = async (req, res) => {
  try {
    const { title, content, isPublic } = req.body;

    const blog = new Blog({
      title,
      content,
      isPublic: isPublic || false,
      author: req.user._id, // from protect middleware
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ msg: "Failed to create blog", error: err.message });
  }
};

const getPublicBlogs = async (req, res) => {
  try {
    console.log("🟢 Fetching public blogs...");
    const blogs = await Blog.find({ isPublic: true }).populate("author", "name role");

    console.log("📦 Blogs found:", blogs.length);
    res.json(blogs);
  } catch (err) {
    console.error("❌ Public blog fetch error:", err.message);
    res.status(500).json({ msg: "Server error fetching blogs" });
  }
};



// Get all blogs for logged-in user (dashboard)
const getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching your blogs" });
  }
};

const addCommentToBlog = async (req, res) => {
  const blogId = req.params.id;
  const { author, comment } = req.body;

  console.log("Blog ID:", blogId);
  console.log("Comment Data:", req.body);

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      console.log("Blog not found");
      return res.status(404).json({ message: 'Blog not found' });
    }

    blog.comments.push({ author, comment, createdAt: new Date() });
    await blog.save();

    res.status(201).json(blog.comments);
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

export { createBlog, getPublicBlogs, getMyBlogs, addCommentToBlog };
