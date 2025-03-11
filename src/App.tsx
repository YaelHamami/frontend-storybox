import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import LoginForm from './pages/LoginForm'
import RegistrationForm from './pages/RegistrationForm'
import UserProfile from './pages/UserProfile'
import EditProfile from './pages/EditProfile'

function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Navigate replace to="/login" />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegistrationForm />} />
      <Route path="/profile/:userId" element={<UserProfile />} />
      <Route path="/profile/:userId/edit" element={<EditProfile />} />
    </Routes>
    </>
  )
}
export default App
