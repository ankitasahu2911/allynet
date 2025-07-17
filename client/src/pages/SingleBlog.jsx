import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { toast } from "react-toastify"; // ✅ Toastify import

export default function SingleBlog() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/blogs/${id}`)
      .then((res) => {
        setBlog(res.data);
        setComments(res.data.comments || []);
      })
      .catch((err) => {
        console.error("Error fetching blog", err);
        toast.error("Failed to load blog");
      });
  }, [id]);

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return toast.warn("Please write a comment");

    try {
      const res = await axios.post(
        `http://localhost:5000/api/blogs/${id}/comments`,
        { comment }
      );

      setComments([...comments, res.data]);
      setComment("");
      toast.success("Comment posted successfully!");
    } catch (err) {
      toast.error("Failed to post comment");
    }
  };

  if (!blog) return <p className="p-6">Loading blog...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Blog Header and Content */}
      <h1 className="text-3xl font-bold text-indigo-800 mb-2">{blog.title}</h1>

      <div className="flex items-center gap-3 mb-4">
        <img
          src={
            blog.author?.profilePhoto
              ? `http://localhost:5000/uploads/${blog.author.profilePhoto}`
              : "/default-avatar.png"
          }
          alt="Author"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold">{blog.author?.name}</h3>
          <p className="text-sm text-gray-500">
            {new Date(blog.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {blog.tags?.length > 0 && (
        <div className="mb-3">
          {blog.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-block bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded mr-2"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="bg-white border p-4 rounded shadow-md">
        <div className="whitespace-pre-line">
          <ReactMarkdown>{blog.content}</ReactMarkdown>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => handleShare("twitter")}
          className="text-blue-500"
        >
          Share on Twitter
        </button>
        <button
          onClick={() => handleShare("linkedin")}
          className="text-blue-700"
        >
          Share on LinkedIn
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Comments</h3>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full p-2 border rounded"
          placeholder="Leave a comment..."
        />
        <button
          onClick={handleCommentSubmit}
          className="bg-indigo-600 text-white px-4 py-1 mt-2 rounded"
        >
          Post Comment
        </button>

        <ul className="mt-4 space-y-2">
          {comments.map((c, i) => (
            <li key={i} className="bg-gray-100 p-2 rounded">
              <p>{c.comment}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
