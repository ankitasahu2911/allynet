import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function AlumniProfile() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-indigo-50 p-6">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">My Profile</h2>

      <div className="bg-white p-6 rounded shadow-md space-y-4">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Domain:</strong> {user.domain || "N/A"}</p>
        <p><strong>Bio:</strong> {user.bio || "N/A"}</p>
        <p><strong>Skills:</strong> {user.skills?.join(", ") || "N/A"}</p>
        {user.resume && (
          <p>
            <strong>Resume:</strong>{" "}
            <a href={user.resume} className="text-indigo-600 underline" target="_blank" rel="noreferrer">
              View Resume
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
