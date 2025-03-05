import './App.css'
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import RegistrationForm from './componnents/RegistrationForm'

function App() {

  return (
    <>
        <RegistrationForm />
        <GoogleLogin onSuccess={googleResponseMessage} onError={googleErrorMessage}></GoogleLogin>
    </>
  )
}

const googleResponseMessage = (credentialResponse: CredentialResponse) => {
  console.log("Google Success")
  console.log(credentialResponse)
}
const googleErrorMessage = () => {
  console.log("Google Error")
}

export default App
