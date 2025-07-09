import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function AlumniProfile() {
  const { user } = useContext(AuthContext);

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-indigo-50 p-6">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">My Profile</h2>

      <div className="bg-white p-6 rounded shadow-md space-y-4">
        {user?.profilePhoto && (
          <img
            src={`http://localhost:5000/uploads/${user.profilePhoto}`}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover mb-4"
          />
        )}

        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Domain:</strong> {user.domain || "N/A"}</p>
        <p><strong>Bio:</strong> {user.bio || "N/A"}</p>
        <p><strong>Skills:</strong> {user.skills?.join(", ") || "N/A"}</p>
        <p><strong>Company:</strong> {user.company || "N/A"}</p>
<p><strong>Designation:</strong> {user.designation || "N/A"}</p>
<p><strong>Department:</strong> {user.department || "N/A"}</p>
<p><strong>Passing Year:</strong> {user.passingYear || "N/A"}</p>


        {user.resume && (
          <p>
            <strong>Resume:</strong>{" "}
            <a
              href={user.resume}
              className="text-indigo-600 underline"
              target="_blank"
              rel="noreferrer"
            >
              View Resume
            </a>
          </p>
        )}
      </div>

      {/* Bottom Edit Profile Button */}
      <div className="mt-6 text-right">
        <Link
          to="/alumni-edit"
          className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Edit Profile
        </Link>
      </div>
    </div>
    </>
  );
}
