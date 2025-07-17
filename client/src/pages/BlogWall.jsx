import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function BlogWall() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/blogs")
      .then((res) => setBlogs(res.data))
      .catch((err) => console.error("Error loading blogs", err));
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">📚 Alumni Blog Wall</h2>

      {blogs.length === 0 ? (
        <p className="text-gray-600">No blogs yet. Check back later!</p>
      ) : (
        <div className="space-y-6">
          {blogs.map((blog) => (
            <div key={blog._id} className="p-4 shadow rounded bg-white">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={
                    blog.author?.profilePhoto
                      ? `http://localhost:5000/uploads/${blog.author.profilePhoto}`
                      : "/default-avatar.png"
                  }
                  alt="author"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-bold">{blog.author?.name}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Link to={`/blogs/${blog._id}`}>
                <h2 className="text-xl font-semibold text-indigo-700">{blog.title}</h2>
              </Link>
              <p className="text-gray-700 mt-2">
                {blog.content.slice(0, 150)}...
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
