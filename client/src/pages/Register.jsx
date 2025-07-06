import { useState, useContext } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);   // 🆕 loading state
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 🔄 Use the correct register endpoint
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );

      // If your backend returns token & user on registration:
      login(res.data.token, res.data.user);

      alert("Registration successful!");

      // Redirect based on role
      if (res.data.user.role === "student") {
        navigate("/student-dashboard");
      } else {
        navigate("/alumni-dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-indigo-50 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 max-w-md w-full space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-indigo-700">
          Register on AllyNet
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          required
        />

        <select
          name="role"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          value={formData.role}
        >
          <option value="student">Student</option>
          <option value="alumni">Alumni</option>
        </select>


        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </motion.div>
  );
}
