import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function StudentEditProfile() {
  const { token, login, user } = useContext(AuthContext);

  const [form, setForm] = useState({ domain: "", bio: "", skills: "" });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  /* ⬇︎ Prefill form on load */
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

  /* ---------- handlers ---------- */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setProfilePhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handlePhotoUpload = async () => {
    const formData = new FormData();
    formData.append("profilePhoto", profilePhoto);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/upload-profile-photo",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Photo uploaded!");
      /* ⬇︎ refresh context so Navbar & dashboard show new pic */
      login(token, { ...user, profilePhoto: res.data.profilePhoto });
      setProfilePhoto(null);
      setPreview(null);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Photo upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedForm = {
      ...form,
      skills: form.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean), // remove empty strings
    };

    try {
      const res = await axios.put(
        "http://localhost:5000/api/users/profile",
        updatedForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Profile updated successfully!");
      /* ⬇︎ update context with fresh user data */
      login(token, res.data);
    } catch (err) {
      console.error("Update failed:", err);
      alert(err.response?.data?.msg || "Update failed");
    }
  };

  /* ---------- UI ---------- */
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
          {/* photo chooser */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Profile Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-2 w-24 h-24 rounded-full object-cover"
              />
            )}
            {profilePhoto && (
              <button
                type="button"
                onClick={handlePhotoUpload}
                className="mt-2 bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
              >
                Upload Photo
              </button>
            )}
          </div>

          {/* text fields */}
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
