import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import AlumniDashboard from "./pages/AlumniDashboard";
import AlumniProfile from "./pages/AlumniProfile";
import AlumniEditProfile from "./pages/AlumniEditProfile";
import PrivateRoute from "./routes/PrivateRoute";
import StudentProfile from "./pages/StudentProfile";
import StudentEditProfile from "./pages/StudentEditProfile";
import AlumniProfileView from "./pages/AlumniProfileView";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student‑only dashboard */}
        <Route
          path="/student-dashboard"
          element={
            <PrivateRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </PrivateRoute>
          }
        />
<Route path="/student-profile"
  element={
    <PrivateRoute allowedRoles={["student"]}>
      <StudentProfile />
    </PrivateRoute>
  }
/>
<Route path="/student-edit"
  element={
    <PrivateRoute allowedRoles={["student"]}>
      <StudentEditProfile />
    </PrivateRoute>
  }
/>
        {/* Alumni‑only section */}
        <Route
          path="/alumni-dashboard"
          element={
            <PrivateRoute allowedRoles={["alumni"]}>
              <AlumniDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/alumni-profile"
          element={
            <PrivateRoute allowedRoles={["alumni"]}>
              <AlumniProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/alumni-edit"
          element={
            <PrivateRoute allowedRoles={["alumni"]}>
              <AlumniEditProfile />
            </PrivateRoute>
          }
        />
        <Route path="/alumni/:id" element={<AlumniProfileView />} />

      </Routes>
    </Router>
  );
}

export default App;
