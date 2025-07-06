import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function StudentDashboard() {
  const { token } = useContext(AuthContext);                // token comes from sessionStorage via context
  const [alumniList, setAlumniList] = useState([]);
  const [sentTo, setSentTo] = useState(new Set());          // IDs you've already requested
  const [filter, setFilter] = useState("");                 // domain search
  const [error, setError] = useState("");

  /* 👉 Fetch all alumni on first render */
  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/alumni/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAlumniList(res.data);
      } catch (err) {
        console.error("Failed to load alumni", err);
        setError("Could not load alumni list.");
      }
    };
    if (token) fetchAlumni();
  }, [token]);

  /* 👉 Connect handler */
  const handleConnect = async (alumniId) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/alumni/connect/${alumniId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.msg);
      setSentTo((prev) => new Set(prev).add(alumniId));     // mark as requested
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to send request");
    }
  };

  /* 👉 Filtered list by domain keyword */
  const displayedAlumni = alumniList.filter((a) =>
    a.domain?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <div className="p-6 bg-indigo-50 min-h-screen">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">
          Student Dashboard
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Domain filter */}
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by domain (e.g., Web, AI)"
          className="w-full md:w-1/3 border p-2 rounded mb-6"
        />

        <section>
          <h3 className="text-xl font-semibold mb-4">
            👥 Available Alumni Mentors
          </h3>

          {displayedAlumni.length === 0 ? (
            <p className="text-gray-600">No alumni match this domain.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedAlumni.map((alumni) => (
                <div
                  key={alumni._id}
                  className="bg-white p-4 shadow rounded space-y-2"
                >
                  <h4 className="text-lg font-bold text-indigo-600">
                    {alumni.name}
                  </h4>
                  <p className="text-gray-700">{alumni.email}</p>
                  <p className="text-sm text-gray-500">
                    <strong>Domain:</strong> {alumni.domain || "N/A"}
                  </p>
                  {alumni.skills?.length > 0 && (
                    <p className="text-sm text-gray-500">
                      <strong>Skills:</strong> {alumni.skills.join(", ")}
                    </p>
                  )}

                  <button
                    onClick={() => handleConnect(alumni._id)}
                    className={`w-full px-3 py-2 rounded ${
                      sentTo.has(alumni._id)
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-500 hover:bg-indigo-600 text-white"
                    }`}
                    disabled={sentTo.has(alumni._id)}
                  >
                    {sentTo.has(alumni._id) ? "Request Sent" : "Connect"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
