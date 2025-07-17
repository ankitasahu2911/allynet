// src/components/PublicBlogWall.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

export default function PublicBlogWall() {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/blogs/public")
      .then((res) => setBlogs(res.data))
      .catch((err) => {
        console.error("Failed to fetch blogs", err);
        setError("Could not load blogs. Please try again later.");
      });
  }, []);

  return (
    <section id="blogs" className="px-4 py-10 bg-white">
      <h2 className="text-3xl font-bold text-indigo-600 mb-6 text-center">✍️ Alumni Blogs</h2>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {blogs.length === 0 ? (
        <p className="text-gray-600 text-center">No public blogs available yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {blogs.map((blog) => (
            <div key={blog._id} className="bg-indigo-50 p-4 rounded shadow">
              <h3 className="text-xl font-semibold text-indigo-800 mb-2">{blog.title}</h3>
              <p className="text-sm text-gray-600 mb-2">
                by {blog.author?.name || "Unknown"} ({blog.author?.role})
              </p>
             <article className="prose prose-sm">
  <div>
    <ReactMarkdown>{blog.content}</ReactMarkdown>
  </div>
</article>

            </div>
          ))}
        </div>
      )}
    </section>
  );
}
