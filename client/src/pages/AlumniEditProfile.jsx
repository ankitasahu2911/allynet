import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function AlumniEditProfile() {
  const { user, token, login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    domain: user.domain || "",
    bio: user.bio || "",
    skills: user.skills?.join(", ") || "",
    resume: user.resume || "",
    
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

 const handleSubmit = async (e) => {
  e.preventDefault();

  const updatedData = {
    ...formData,
    skills: formData.skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== ""),
  };

  try {
    const res = await axios.put(
      "http://localhost:5000/api/alumni/profile",        // 👈 no id
      updatedData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    login(token, res.data);      // refresh user in context
    alert("Profile updated!");
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.msg || "Update failed");
  }
};


  return (
    <div className="min-h-screen bg-indigo-50 p-6">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-4">
        <input
          type="text"
          name="domain"
          placeholder="Your domain"
          value={formData.domain}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <textarea
          name="bio"
          placeholder="About you"
          value={formData.bio}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="skills"
          placeholder="Skills (comma separated)"
          value={formData.skills}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="url"
          name="resume"
          placeholder="Resume URL"
          value={formData.resume}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Save
        </button>
      </form>
    </div>
  );
}
