
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginForm from './pages/LoginForm';
import RegistrationForm from './pages/RegistrationForm';
import UserProfile from './pages/UserProfile';
import EditProfile from './pages/EditProfile';
import HomePage from './pages/HomePage';
import NavBar from './components/NavBar'; // Import the NavBar component
import AddPost from './pages/AddPost';

function App() {

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
        <Route path="/addPost" element={<AddPost />} />
      </Routes>
    </>
  );
}

export default App;
