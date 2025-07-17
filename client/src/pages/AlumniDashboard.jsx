import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
export default function AlumniDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch connection requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/alumni/requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(res.data);
      } catch (err) {
        console.error("Error fetching requests", err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchRequests();
  }, [token]);

  // Fetch alumni profile details
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/alumni/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };
    if (token) fetchProfile();
  }, [token]);

  const handleAction = async (studentId, action) => {
    try {
      await axios.post(
        `http://localhost:5000/api/alumni/requests/${studentId}`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Connection ${action}ed`);
      setRequests((prev) =>
        prev.filter((c) => c.studentId?._id !== studentId)
      );
    } catch (err) {
      alert("Action failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-indigo-50 p-6">
        <h2 className="text-3xl font-bold text-indigo-700 mb-6">Alumni Dashboard</h2>

       <div className="mb-4">
  <Link
    to="/write-blog"
    className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded"
  >
    ✍️ Write a Blog
  </Link>
</div>


        {/* Connection Requests */}
        <div className="bg-white rounded shadow p-4">
          <h3 className="text-xl font-semibold mb-2 text-indigo-600">Connection Requests</h3>
          {loading ? (
            <p>Loading...</p>
          ) : requests.filter((c) => c.studentId).length === 0 ? (
            <p className="text-gray-600">No pending requests.</p>
          ) : (
            <div className="grid gap-4">
              {requests
                .filter((conn) => conn.studentId)
                .map((conn) => (
                  <div
                    key={conn.studentId._id}
                    className="bg-indigo-50 p-4 rounded shadow flex justify-between items-center"
                  >
                    <div>
                      <h4 className="text-lg font-semibold">{conn.studentId.name}</h4>
                      <p className="text-sm text-gray-600">{conn.studentId.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        onClick={() => handleAction(conn.studentId._id, "accept")}
                      >
                        Accept
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => handleAction(conn.studentId._id, "reject")}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
