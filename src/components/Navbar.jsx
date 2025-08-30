import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const linkClass = ({ isActive }) => 
    `px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
      isActive 
        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
        : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
    }`

  // Common routes for all users
  const commonRoutes = [
    { path: '/', name: 'Home' },
    { path: '/about', name: 'About' },
    { path: '/blogs', name: 'Browse' },
    { path: '/categories', name: 'Categories' },
    { path: '/contact', name: 'Contact' }
  ]

  // Auth-specific routes
  const authRoutes = [
    { path: '/dashboard', name: 'Dashboard' },
    { path: '/create-post', name: 'Create Post' },
    { path: '/bookmarks', name: 'Bookmarks' }
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo/Brand */}
        <NavLink
          to="/"
          className="flex items-center space-x-2 group"
        >
          <span className="text-3xl group-hover:rotate-12 transition-transform">📝</span>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Blogify
          </span>
        </NavLink>

        {/* Main Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {commonRoutes.map(route => (
            <NavLink 
              key={route.path} 
              to={route.path} 
              className={linkClass}
            >
              {route.name}
            </NavLink>
          ))}
          
          {isAuthenticated && authRoutes.map(route => (
            <NavLink 
              key={route.path} 
              to={route.path} 
              className={linkClass}
            >
              {route.name}
            </NavLink>
          ))}
        </div>

        {/* Auth Section */}
        <div className="flex items-center space-x-2">
          {!isAuthenticated ? (
            <>
              <NavLink to="/login" className={linkClass}>
                Sign In
              </NavLink>
              <NavLink 
                to="/register" 
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Get Started
              </NavLink>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              {user && (
                <div className="hidden md:flex items-center space-x-3">
                  <img 
                    src={user.avatar || 'https://i.pravatar.cc/40'} 
                    alt={user.name} 
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                  />
                  <span className="text-sm font-medium text-gray-600">
                    {user.name || user.email.split('@')[0]}
                  </span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-1"
              >
                <span>Logout</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button (would need state and click handler) */}
        <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu (would need state management) */}
      {/* <div className="md:hidden bg-white py-2 px-4 shadow-lg">
        {commonRoutes.map(route => (
          <NavLink 
            key={route.path} 
            to={route.path} 
            className="block py-2 px-4 hover:bg-gray-100 rounded-lg"
          >
            {route.name}
          </NavLink>
        ))}
        {isAuthenticated && authRoutes.map(route => (
          <NavLink 
            key={route.path} 
            to={route.path} 
            className="block py-2 px-4 hover:bg-gray-100 rounded-lg"
          >
            {route.name}
          </NavLink>
        ))}
      </div> */}
    </nav>
  )
}