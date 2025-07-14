import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
export default function StudentDashboard() {
  const { token, user } = useContext(AuthContext);
  const [alumniList, setAlumniList] = useState([]);
  const [sentTo, setSentTo] = useState(new Set());
  const [filter, setFilter] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

  const handleConnect = async (alumniId) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/alumni/connect/${alumniId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.msg);
      setSentTo((prev) => new Set(prev).add(alumniId));
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to send request");
    }
  };

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

        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by domain (e.g., Web, AI)"
          className="w-full md:w-1/3 border p-2 rounded mb-6"
        />

        <section>
          <h3 className="text-xl font-semibold mb-4">👥 Available Alumni Mentors</h3>

          {displayedAlumni.length === 0 ? (
            <p className="text-gray-600">No alumni match this domain.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedAlumni.map((alumni) => (
                <div
                  key={alumni._id}
                  className="bg-white p-4 shadow rounded space-y-2"
                >
                  {alumni.profilePhoto && (
                    <img
                      src={`http://localhost:5000/uploads/${alumni.profilePhoto}`}
                      alt="Alumni"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <h4 className="text-lg font-bold text-indigo-600">{alumni.name}</h4>
                  <p className="text-gray-700">{alumni.email}</p>
                  <p className="text-sm text-gray-500">
                    <strong>Domain:</strong> {alumni.domain || "N/A"}
                  </p>
                  {alumni.skills?.length > 0 && (
                    <p className="text-sm text-gray-500">
                      <strong>Skills:</strong> {alumni.skills.join(", ")}
                    </p>
                  )}

                  <div className="flex flex-col gap-2 mt-2">
                    <button
                      onClick={() => navigate(`/alumni/${alumni._id}`)}
                      className="w-full bg-indigo-100 text-indigo-700 px-3 py-1 rounded hover:bg-indigo-200"
                    >
                      View Profile
                    </button>

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
                    <button
  onClick={async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/message/conversations/start",
        { receiverId: alumni._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate(`/messages?user=${alumni._id}`);
    } catch (err) {
      alert("Couldn't open message. Try again.");
      console.error(err);
    }
  }}
  className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
>
  Message
</button>


                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
