import './styles/App.css';
import Login from './Login';
import Signup from './Signup';
import Home from './Home';
import ManageUsers from './ManageUsers';
import ViewTutors from './ViewTutors';
import Feedback from './Feedback';
import SetAvailability from './SetAvailability';
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
