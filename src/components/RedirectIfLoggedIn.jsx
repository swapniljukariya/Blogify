import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Landing from './Landing'

export default function RedirectIfLoggedIn() {
  const { isAuthenticated } = useContext(AuthContext)

  if (isAuthenticated) {
    return <Navigate to="/home" />
  }

  return <Landing />
}
