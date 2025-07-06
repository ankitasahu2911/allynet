import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function StudentEditProfile() {
  const { token, login,user } = useContext(AuthContext);
  const [form, setForm] = useState({
    domain: "",
    bio: "",
    skills: "",
  });

  useEffect(() => {
    if (!token) return;
    axios
      .get("http://localhost:5000/api/student/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const { domain, bio, skills } = res.data;
        setForm({
          domain: domain || "",
          bio: bio || "",
          skills: skills?.join(", ") || "",
        });
      });
  }, [token]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

 const handleSubmit = async (e) => {
  e.preventDefault();

  const updatedForm = {
    ...form,
    skills: form.skills.split(",").map(skill => skill.trim()), // convert to array
  };

  try {
    await axios.put(
      "http://localhost:5000/api/users/profile",
      updatedForm,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Profile updated successfully!");
  } catch (err) {
    console.error("Update failed:", err);
    alert(err.response?.data?.msg || "Update failed");
  }
};





  return (
    <>
      <Navbar />
      <div className="p-6 bg-indigo-50 min-h-screen">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">
          Edit Your Profile
        </h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded shadow space-y-4"
        >
          <input
            name="domain"
            value={form.domain}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Domain of interest"
          />
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows="3"
            className="w-full border p-2 rounded"
            placeholder="Write about yourself"
          />
          <input
            name="skills"
            value={form.skills}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Skills (comma separated)"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Save
          </button>
        </form>
      </div>
    </>
  );
}
