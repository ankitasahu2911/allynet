import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
export default function StudentProfile() {
  const { token,user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/student/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  return (
    <>
   <Navbar hasNewMessage={hasNewMessage} />

      <div className="p-6 bg-indigo-50 min-h-screen">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">Your Profile</h2>

        {!profile ? (
          <p>Loading...</p>
        ) : (
          <div className="bg-white p-6 rounded shadow space-y-3">
            {user?.profilePhoto && (
  <img
    src={`http://localhost:5000/uploads/${user.profilePhoto}`}
    alt="Profile"
    className="w-24 h-24 rounded-full object-cover mb-4 mx-3"
  />
)}
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Domain:</strong> {profile.domain || "Not specified"}</p>
            <p><strong>Bio:</strong> {profile.bio || "No bio provided"}</p>
            <p><strong>Skills:</strong> {profile.skills?.join(", ") || "No skills listed"}</p>
          </div>
        )}


        {/* Bottom Edit Profile Button */}
<div className="mt-6 text-right">
  <Link
    to="/student-edit" // or "/alumni-edit" for alumni
    className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
  >
    Edit Profile
  </Link>
</div>

      </div>
    </>
  );
}
