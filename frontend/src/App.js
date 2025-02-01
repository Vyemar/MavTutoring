import "./styles/App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import ManageUsers from "./pages/admin/ManageUsers";
import ViewTutors from "./pages/student/ViewTutors";
import Feedback from "./pages/student/Feedback";
import SetAvailability from "./pages/tutor/SetAvailability";
import Notifications from "./Notifications";
import StudentSchedule from "./StudentSchedule";
import MyTutors from "./MyTutors";
import MySessions from "./MySessions";
import FindSessions from "./FindSessions";
import TutorSessions from "./TutorSessions";
import TutorNotifications from "./TutorNotifications";
import TutorSchedule from "./TutorSchedule";
import SystemAnalytics from "./SystemAnalytics";
import Settings from "./Settings";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const userID = localStorage.getItem("userID"); // Check if user is logged in
  return userID ? children : <Navigate to="/login" replace />; // Redirect to login if not authenticated
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect from root to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/availability"
          element={
            <ProtectedRoute>
              <SetAvailability />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-users"
          element={
            <ProtectedRoute>
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/find-tutors"
          element={
            <ProtectedRoute>
              <ViewTutors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Viewtutors"
          element={
            <ProtectedRoute>
              <ViewTutors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Feedback"
          element={
            <ProtectedRoute>
              <Feedback />
            </ProtectedRoute>
          }
        />
        <Route path="/Notifications" element={<Notifications />} />
        <Route path="/StudentSchedule" element={<StudentSchedule />} />
        <Route path="/my-tutors" element={<MyTutors />} />
        <Route path="/my-sessions" element={<MySessions />} />
        <Route path="/find-sessions" element={<FindSessions />} />
        <Route path="/sessions" element={<TutorSessions />} />
        <Route path="/TutorNotifications" element={<TutorNotifications />} />
        <Route path="/schedule" element={<TutorSchedule />} />
        <Route path="/analytics" element={<SystemAnalytics />} />
        <Route path="/admin-settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
