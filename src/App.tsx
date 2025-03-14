// src/App.tsx
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import LoginForm from './pages/LoginForm';
import RegistrationForm from './pages/RegistrationForm';
import UserProfile from './pages/UserProfile';
import EditProfile from './pages/EditProfile';
import HomePage from './pages/HomePage';
import NavBar from './components/NavBar'; // Import the NavBar component

function App() {
  const location = useLocation();

  return (
    <>
      <NavBar /> {/* NavBar will be conditionally shown based on the route */}
      <Routes>
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/profile/:userId" element={<UserProfile />} />
        <Route path="/profile/:userId/edit" element={<EditProfile />} />
      </Routes>
    </>
  );
}

export default App;
