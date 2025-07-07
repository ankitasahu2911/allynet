import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
export default function AlumniEditProfile() {
  const { user, token, login } = useContext(AuthContext);

  /* ---------------- state ---------------- */
  const [formData, setFormData] = useState({
    domain: user.domain || "",
    bio:    user.bio || "",
    skills: user.skills?.join(", ") || "",
    resume: user.resume || "",
  });

  const [profilePhoto, setProfilePhoto] = useState(null);                    // file object
  const [preview, setPreview] = useState(                                    // shown image
    user.profilePhoto ? `http://localhost:5000/uploads/${user.profilePhoto}` : null
  );

  /* refresh preview if user context changes */
  useEffect(() => {
    if (user.profilePhoto) {
      setPreview(`http://localhost:5000/uploads/${user.profilePhoto}`);
    }
  }, [user.profilePhoto]);

  /* --------------- handlers --------------- */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updated = {
      ...formData,
      skills: formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const { data } = await axios.put(
        "http://localhost:5000/api/users/profile",
        updated,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      login(token, data);
      alert("Profile updated!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Update failed");
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfilePhoto(file);
    setPreview(URL.createObjectURL(file));          // temp preview
  };

  const handlePhotoUpload = async () => {
    const fd = new FormData();
    fd.append("profilePhoto", profilePhoto);

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/users/upload-profile-photo",
        fd,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const fileName = data.profilePhoto;
      setPreview(`http://localhost:5000/uploads/${fileName}`);
      setProfilePhoto(null);
      login(token, { ...user, profilePhoto: fileName });
      alert("Photo uploaded!");
    } catch (err) {
      console.error("Upload failed", err);
      alert("Photo upload failed");
    }
  };

  const handleRemovePhoto = async () => {
    try {
      await axios.delete(
        "http://localhost:5000/api/users/remove-profile-photo",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPreview(null);
      login(token, { ...user, profilePhoto: null });
      alert("Photo removed!");
    } catch (err) {
      console.error("Remove failed", err);
      alert("Photo remove failed");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-indigo-50 p-6">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">Edit Profile</h2>

      {/* ---- Photo Section ---- */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">
          Profile Photo
        </label>

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mt-2 w-24 h-24 rounded-full object-cover"
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="mt-2 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4 file:rounded-md
            file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
        />

        {profilePhoto && (
          <button
            type="button"
            onClick={handlePhotoUpload}
            className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            Upload Photo
          </button>
        )}

        {preview && !profilePhoto && (
          <button
            type="button"
            onClick={handleRemovePhoto}
            className="mt-2 ml-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Remove Photo
          </button>
        )}
      </div>

      {/* ---- Main Form ---- */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md space-y-4"
      >
        <input
          name="domain"
          value={formData.domain}
          onChange={handleChange}
          placeholder="Domain"
          className="w-full border p-2 rounded"
        />
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Bio"
          className="w-full border p-2 rounded"
        />

        <input
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="Skills (comma separated)"
          className="w-full border p-2 rounded"
        />
        <input
          name="resume"
          type="url"
          value={formData.resume}
          onChange={handleChange}
          placeholder="Resume URL"
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
    </>
  );
}
