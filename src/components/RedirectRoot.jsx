// src/components/RedirectRoot.jsx
import { useAuth } from '../context/AuthContext'
import Landing from './Landing'
import Home from './Home'

export default function RedirectRoot() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <div className="text-center mt-10">Loading...</div>

  return isAuthenticated ? <Home /> : <Landing />
}
