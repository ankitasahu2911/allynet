import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({});

  useEffect(() => {
    if (!token || user?.role !== "admin") {
      navigate("/"); // redirect if not admin
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/admin-dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Admin stats fetch error:", err);
      }
    };

    fetchStats();
  }, [token, user, navigate]);

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4 text-indigo-600">Admin Dashboard</h1>

        {/* Show fetched stats */}
        <div className="space-y-4">
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-lg font-semibold">Total Users</h2>
            <p>{stats.totalUsers || "Loading..."}</p>
          </div>

          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-lg font-semibold">Messages Sent</h2>
            <p>{stats.totalMessages || "Loading..."}</p>
          </div>

          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-lg font-semibold">Top Domains</h2>
            <ul>
              {(stats.topDomains || []).map((domain, i) => (
                <li key={i}>• {domain}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
