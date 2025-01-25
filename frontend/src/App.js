import "./styles/App.css";
import Login from "./Login";
import Signup from "./Signup";
import Home from "./Home";
import ManageUsers from "./ManageUsers";
import ViewTutors from "./ViewTutors";
import Feedback from "./Feedback";
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
import SetAvailability from "./SetAvailability";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect from root to login */}
        <Route path="/" element={<Navigate to="/login" />} />
        {/* Define login and signup routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/availability" element={<SetAvailability />} />
        <Route path="/manage-users" element={<ManageUsers />} />
        <Route path="/find-tutors" element={<ViewTutors />} />
        <Route path="/Viewtutors" element={<ViewTutors />} />
        <Route path="/Feedback" element={<Feedback />} />
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
