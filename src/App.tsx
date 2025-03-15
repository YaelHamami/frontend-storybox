import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import LoginForm from './pages/LoginForm'
import RegistrationForm from './pages/RegistrationForm'
import UserProfile from './pages/UserProfile'
import EditProfile from './pages/EditProfile'
import AddPost from "./pages/AddPost"
import HomePage from './pages/HomePage'
import NavBar from './components/NavBar'; 

function App() {
  return (
    <>
      <NavBar /> {/* NavBar will be conditionally shown based on the route */}
      <Routes>
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/add-post" element={<AddPost />} />
        <Route path="/profile/:userId" element={<UserProfile />} />
        <Route path="/profile/:userId/edit" element={<EditProfile />} />
      </Routes>
    </>
  );
}

export default App;
