import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider
    clientId="623594661939-pqpkpr54nduhubi3bc69ocjaas3u953i.apps.googleusercontent.com">
    <StrictMode>
      <App />
    </StrictMode>,
  </GoogleOAuthProvider>
)
