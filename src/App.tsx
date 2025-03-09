import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import LoginForm from './componnents/LoginForm'
import RegistrationForm from './componnents/RegistrationForm'

function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Navigate replace to="/login" />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegistrationForm />} />
    </Routes>
        {/* <LoginForm /> */}
    </>
  )
}
export default App
