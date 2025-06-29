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
import TutorSessions from "./pages/tutor/TutorSessions";
import TutorNotifications from "./pages/tutor/TutorNotifications";
import TutorSchedule from "./pages/tutor/TutorSchedule";
import TutorProfile from "./pages/tutor/TutorProfile";
import StudentProfile from "./pages/student/StudentProfile";
import SystemAnalytics from "./pages/admin/SystemAnalytics";
import Settings from "./pages/admin/Settings";
import FindMyTutorProfile from "./pages/student/FindmyTutorProfile";
import ViewProfile from "./pages/admin/ViewProfile";
import TutorDetails from "./pages/admin/TutorDetails";
import AnalyticsOptions from "./pages/admin/AnalyticsOptions";
import Attendance from "./pages/admin/AttendanceReport";
import SessionCardSwipe from "./pages/admin/SessionCardSwipe";
import StudentSessionCardSwipe from "./pages/student/SessionCardSwipe";
import { SidebarProvider } from "./components/Sidebar/SidebarContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { axiosGetData } from "./utils/api";

// Get configuration from environment variables
const PROTOCOL = process.env.REACT_APP_PROTOCOL || 'https';
const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST || 'localhost';
const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT || '4000';

// Construct the backend URL dynamically
const BACKEND_URL = `${PROTOCOL}://${BACKEND_HOST}:${BACKEND_PORT}`;

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await axiosGetData(`${BACKEND_URL}/api/auth/session`); // Fetch session from backend
        if (response.user) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Session check failed:", error);
        setIsAuthenticated(false);
      }
    }

    checkSession();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Show a loading state while checking auth
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <SidebarProvider>
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
          <Route path="/FindMyTutorProfile/:tutorId" element={<FindMyTutorProfile />} />
          <Route path="/my-tutors" element={<MyTutors />} />
          <Route path="/my-sessions" element={<MySessions />} />
          <Route path="/sessions" element={<TutorSessions />} />
          <Route path="/TutorNotifications" element={<TutorNotifications />} />
          <Route 
            path="/student-profile" 
            element={
              <ProtectedRoute>
                <StudentProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tutor-profile" 
            element={
              <ProtectedRoute>
                <TutorProfile />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/card-swipe"
            element={
              <ProtectedRoute>
                <SessionCardSwipe />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/card-swipe"
            element={
              <ProtectedRoute>
                <StudentSessionCardSwipe />
              </ProtectedRoute>
            }
          />

          <Route path="/schedule" element={<TutorSchedule />} />
          <Route path="/analytics" element={<AnalyticsOptions/>} />
          <Route path="/analytics/tutor-performance" element={<SystemAnalytics/>} />
          <Route path="/analytics/attendance-reports" element={<Attendance/>} />
          
          <Route path="/tutor/:tutorId" element={<TutorDetails />} />
          <Route path="/ViewProfile/:userId" element={<ViewProfile />} />
          <Route path="/admin-settings" element={<Settings />} />
        </Routes>
      </BrowserRouter>`
    </SidebarProvider>
  );
}

export default App;