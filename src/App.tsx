import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import LoginForm from './pages/LoginForm'
import RegistrationForm from './pages/RegistrationForm'
import UserProfile from './pages/UserProfile'
import EditProfile from './pages/EditProfile'
import HomePage from './pages/HomePage'
import ConversationsPage from './pages/ConversationsPage'
import ChatPage from './pages/ChatPage'

function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Navigate replace to="/login" />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/register" element={<RegistrationForm />} />
      <Route path="/profile/:userId" element={<UserProfile />} />
      <Route path="/profile/:userId/edit" element={<EditProfile />} />
      <Route path="/conversations" element={<ConversationsPage />} />
      <Route path="/chat/:conversationId" element={<ChatPage />} />
    </Routes>
    </>
  )
}
export default App
