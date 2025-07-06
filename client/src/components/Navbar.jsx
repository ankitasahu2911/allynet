import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // 📌 Decide if user is in a dashboard area (student or alumni)
  const isStudentView = location.pathname.startsWith("/student");
  const isAlumniView = location.pathname.startsWith("/alumni");
  const isDashboardView = isStudentView || isAlumniView;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo / Title */}
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          AllyNet
        </Link>

        {/* Desktop View */}
        <div className="hidden md:flex gap-6">
          {!isDashboardView ? (
            <>
              <Link to="/" className="text-gray-700 hover:text-indigo-600">Home</Link>
              <a href="#about" className="text-gray-700 hover:text-indigo-600">About</a>
              {user ? (
                <button onClick={handleLogout} className="text-gray-700 hover:text-red-600">Logout</button>
              ) : (
                <Link to="/login" className="text-gray-700 hover:text-indigo-600">Login</Link>
              )}
            </>
          ) : (
            <>
              <Link
                to={isStudentView ? "/student-dashboard" : "/alumni-dashboard"}
                className="text-gray-700 hover:text-indigo-600"
              >
                Dashboard
              </Link>
              <Link
                to={isStudentView ? "/student-profile" : "/alumni-profile"}
                className="text-gray-700 hover:text-indigo-600"
              >
                View Profile
              </Link>
              <Link
                to={isStudentView ? "/student-edit" : "/alumni-edit"}
                className="text-gray-700 hover:text-indigo-600"
              >
                Edit Profile
              </Link>
              <button onClick={handleLogout} className="text-gray-700 hover:text-red-600">
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="text-2xl">&#9776;</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          {!isDashboardView ? (
            <>
              <Link to="/" className="block text-gray-700 hover:text-indigo-600">Home</Link>
              <a href="#about" className="block text-gray-700 hover:text-indigo-600">About</a>
              {user ? (
                <button onClick={handleLogout} className="block text-gray-700 hover:text-red-600">Logout</button>
              ) : (
                <Link to="/login" className="block text-gray-700 hover:text-indigo-600">Login</Link>
              )}
            </>
          ) : (
            <>
              <Link
                to={isStudentView ? "/student-dashboard" : "/alumni-dashboard"}
                className="block text-gray-700 hover:text-indigo-600"
              >
                Dashboard
              </Link>
              <Link
                to={isStudentView ? "/student-profile" : "/alumni-profile"}
                className="block text-gray-700 hover:text-indigo-600"
              >
                View Profile
              </Link>
              <Link
                to={isStudentView ? "/student-edit" : "/alumni-edit"}
                className="block text-gray-700 hover:text-indigo-600"
              >
                Edit Profile
              </Link>
              <button onClick={handleLogout} className="block text-gray-700 hover:text-red-600">
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
