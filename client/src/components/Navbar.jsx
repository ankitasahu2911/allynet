import { useState, useContext } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useMessage } from "../context/MessageContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, token, logout } = useContext(AuthContext);
  const { hasNewMessage } = useMessage();
  const location = useLocation();
  const navigate = useNavigate();

  const isStudentView = location.pathname.startsWith("/student");
  const isAlumniView = location.pathname.startsWith("/alumni");
  const isDashboardView = isStudentView || isAlumniView;

  const handleProfileClick = () => {
    if (user?.role === "student") navigate("/student-dashboard");
    else if (user?.role === "alumni") navigate("/alumni-dashboard");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const MessageLink = (
    <Link to="/messages" className="relative text-gray-700 hover:text-indigo-600">
      Messages
      {hasNewMessage && (
        <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-1 rounded-full animate-pulse">
          New
        </span>
      )}
    </Link>
  );

  const DesktopLinks = () =>
    !isDashboardView ? (
      <>
        <Link to="/" className="text-gray-700 hover:text-indigo-600">Home</Link>
        <a href="#about" className="text-gray-700 hover:text-indigo-600">About</a>
        {token ? (
          <div
            onClick={handleProfileClick}
            title="Go to Dashboard"
            className="w-10 h-10 rounded-full overflow-hidden cursor-pointer border-2 border-indigo-500"
          >
            <img
              src={user?.profilePhoto ? `http://localhost:5000/uploads/${user.profilePhoto}` : "/default-avatar.png"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <Link to="/login" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Login</Link>
        )}
      </>
    ) : (
      <>
        <Link to={isStudentView ? "/student-dashboard" : "/alumni-dashboard"} className="text-gray-700 hover:text-indigo-600">Dashboard</Link>
        <Link to={isStudentView ? "/student-profile" : "/alumni-profile"} className="text-gray-700 hover:text-indigo-600">Profile</Link>
        {token && MessageLink}
        <button onClick={handleLogout} className="text-red-600 hover:text-red-800 font-medium">Logout</button>
      </>
    );

  const MobileLinks = () =>
    !isDashboardView ? (
      <>
        <Link to="/" className="block text-gray-700 hover:text-indigo-600">Home</Link>
        <a href="#about" className="block text-gray-700 hover:text-indigo-600">About</a>
        {token ? (
          <div
            onClick={handleProfileClick}
            title="Go to Dashboard"
            className="w-10 h-10 rounded-full overflow-hidden cursor-pointer border-2 border-indigo-500"
          >
            <img
              src={user?.profilePhoto ? `http://localhost:5000/uploads/${user.profilePhoto}` : "/default-avatar.png"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <Link to="/login" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 block text-center">Login</Link>
        )}
      </>
    ) : (
      <>
        <Link to={isStudentView ? "/student-dashboard" : "/alumni-dashboard"} className="block text-gray-700 hover:text-indigo-600">Dashboard</Link>
        <Link to={isStudentView ? "/student-profile" : "/alumni-profile"} className="block text-gray-700 hover:text-indigo-600">Profile</Link>
        {token && MessageLink}
        <button onClick={handleLogout} className="block text-red-600 hover:text-red-800 font-medium">Logout</button>
      </>
    );

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        <Link to="/" className="text-2xl font-bold text-indigo-600">AllyNet</Link>
        <div className="hidden md:flex gap-6 items-center">
          <DesktopLinks />
        </div>
        <button className="md:hidden focus:outline-none" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="text-2xl">&#9776;</span>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <MobileLinks />
        </div>
      )}
    </nav>
  );
}
