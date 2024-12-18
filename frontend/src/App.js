import './styles/App.css';
import Login from './Login';
import Signup from './Signup';
import Home from './Home';
import ManageUsers from './ManageUsers';
import ViewTutors from './ViewTutors';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SetAvailability from './SetAvailability';

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
        <Route path="/Viewtutors" element={<ViewTutors />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
