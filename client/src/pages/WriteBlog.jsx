import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function WriteBlog() {
  const { token, user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(true); // ✅ default to public
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return alert("Please fill all fields");

    try {
      await axios.post(
        "http://localhost:5000/api/blogs",
        { title, content, isPublic }, // ✅ include this
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Blog posted successfully!");
      navigate("/blogs");
    } catch (err) {
      console.error("Blog post failed", err);
      alert("Error submitting blog");
    }
  };

  if (user?.role !== "alumni") {
    return <p className="p-6 text-red-600">Only alumni can write blogs.</p>;
  }

  return (
   <>
    <Navbar/>
    <div className="p-6 max-w-4xl mx-auto">
      
      <h2 className="text-3xl font-bold text-indigo-700 mb-4">✍️ Write Your Blog</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Blog title"
          className="w-full p-3 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Write your blog content here in Markdown..."
          rows="15"
          className="w-full p-3 border rounded font-mono"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <label className="flex items-center gap-2">
  <input
    type="checkbox"
    checked={isPublic}
    onChange={() => setIsPublic(!isPublic)}
  />
  Make blog public
</label>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
        >
          Publish Blog
        </button>
      </form>
    </div>
    </>
  );
}
