import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";




export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
const navigate  = useNavigate();
const { login } = useContext(AuthContext);


  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", formData);

    // Save to context and localStorage
    login(res.data.token, res.data.user);

    alert("Login successful");

    // Redirect based on role
    if (res.data.user.role === "student") {
      navigate("/student-dashboard");
    } else {
      navigate("/alumni-dashboard");
    }

  } catch (err) {
    setError(err.response?.data?.msg || "Login failed");
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
        <h2 className="text-2xl font-bold text-center text-indigo-700">Login to AllyNet</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

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

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Login
        </button>

        <p className="text-center text-sm">
  Don't have an account?{" "}
  <Link to="/register" className="text-indigo-600 hover:underline">
    Register
  </Link>
</p>
      </form>
    </motion.div>
  );
}
