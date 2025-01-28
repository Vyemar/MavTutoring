import './styles/App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import ManageUsers from './pages/ManageUsers';
import ViewTutors from './pages/ViewTutors';
import Feedback from './pages/Feedback';
import SetAvailability from './pages/SetAvailability';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const userID = localStorage.getItem('userID'); // Check if user is logged in
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
