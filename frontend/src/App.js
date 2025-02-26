import "./styles/App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import ManageUsers from "./pages/admin/ManageUsers";
import ViewTutors from "./pages/student/ViewTutors";
import Feedback from "./pages/student/Feedback";
import SetAvailability from "./pages/tutor/SetAvailability";
import Notifications from "./pages/student/Notifications";
import StudentSchedule from "./pages/student/StudentSchedule";
import MyTutors from "./pages/student/MyTutors";
import MySessions from "./pages/student/MySessions";
import FindSessions from "./pages/student/FindSessions";
import TutorSessions from "./pages/tutor/TutorSessions";
import TutorCourses from "./pages/tutor/TutorCourses";
import TutorNotifications from "./pages/tutor/TutorNotifications";
import TutorSchedule from "./pages/tutor/TutorSchedule";
import TutorProfile from "./pages/tutor/TutorProfile";
import SystemAnalytics from "./pages/admin/SystemAnalytics";
import Settings from "./pages/admin/Settings";
import FindMyTutorProfile from "./pages/student/FindmyTutorProfile";
import ViewProfile from "./pages/admin/ViewProfile";
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
            
              <Home />
      
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
        <Route path="/FindMyTutorProfile/:tutorId" element={<FindMyTutorProfile />} />
        <Route path="/my-tutors" element={<MyTutors />} />
        <Route path="/my-sessions" element={<MySessions />} />
        <Route path="/find-sessions" element={<FindSessions />} />
        <Route path="/sessions" element={<TutorSessions />} />
        <Route path="/TutorCourses" element={<TutorCourses />} />
        <Route path="/TutorNotifications" element={<TutorNotifications />} />
        <Route path="/Profile" element={<TutorProfile />} />
        <Route path="/schedule" element={<TutorSchedule />} />
        <Route path="/analytics" element={<SystemAnalytics />} />
        <Route path="/ViewProfile/:tutorId" element={<ViewProfile />} />
        <Route path="/admin-settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
