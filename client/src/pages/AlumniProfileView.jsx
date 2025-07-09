import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function AlumniProfileView() {
  const { id } = useParams(); // alumni ID
  const { token, user } = useContext(AuthContext);
  const [alumni, setAlumni] = useState(null);
  const [status, setStatus] = useState(""); // pending / accepted / not-connected

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/student/alumni/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setAlumni(res.data.alumni);
        setStatus(res.data.connectionStatus);
      })
      .catch((err) => console.error(err));
  }, [id, token]);

  const handleConnect = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/student/connect/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus("pending");
      alert("Connection request sent!");
    } catch (err) {
      console.error("Connection failed:", err);
      alert("Connection request failed");
    }
  };

  if (!alumni) return <p>Loading...</p>;

  return (
   <>
 <Navbar/>
    <div className="p-6 bg-indigo-50 min-h-screen">
        
      <div className="bg-white p-6 rounded shadow-md">
        {alumni.profilePhoto && (
          <img
            src={`http://localhost:5000/uploads/${alumni.profilePhoto}`}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover mb-4"
          />
        )}
        <h2 className="text-xl font-bold">{alumni.name}</h2>
        <p><strong>Email:</strong> {alumni.email}</p>
        <p><strong>Domain:</strong> {alumni.domain}</p>
        <p><strong>Bio:</strong> {alumni.bio}</p>
        <p><strong>Skills:</strong> {alumni.skills?.join(", ")}</p>
        <p><strong>Company:</strong> {alumni.company}</p>
        <p><strong>Designation:</strong> {alumni.designation}</p>
        <p><strong>Department:</strong> {alumni.department}</p>
        <p><strong>Passing Year:</strong> {alumni.passingYear}</p>


        {status === "not-connected" && (
          <button
            onClick={handleConnect}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Connect
          </button>
        )}

        {status === "pending" && (
          <p className="mt-4 text-yellow-500 font-medium">Request Pending</p>
        )}

        {status === "accepted" && (
          <p className="mt-4 text-green-600 font-medium">Connected ✅</p>
        )}
      </div>
    </div>
    </>
  );
}
