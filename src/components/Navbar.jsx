import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiUser, FiLogOut, FiPlus, FiBookmark, FiGrid } from 'react-icons/fi'

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleProfileClick = () => {
    navigate('/profile')
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
    { path: '/dashboard', name: 'Dashboard', icon: <FiGrid className="w-4 h-4" /> },
    { path: '/create-post', name: 'Create Post', icon: <FiPlus className="w-4 h-4" /> },
    { path: '/bookmarks', name: 'Bookmarks', icon: <FiBookmark className="w-4 h-4" /> }
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
              <span className="flex items-center space-x-1">
                {route.icon}
                <span>{route.name}</span>
              </span>
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
            <div className="flex items-center space-x-3">
              {/* Create Post Button (Mobile visible) */}
              <NavLink 
                to="/create-post" 
                className="md:hidden p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-md"
              >
                <FiPlus className="w-5 h-5" />
              </NavLink>

              {/* Profile Button */}
              <button
                onClick={handleProfileClick}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 group"
                title="Your Profile"
              >
                <div className="relative">
                  <img 
                    src={user?.profileImage || user?.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} 
                    alt={user?.name || user?.email} 
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm object-cover group-hover:border-blue-200 transition-colors"
                    onError={(e) => {
                      e.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
                    }}
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                
                {/* User name - hidden on mobile, shown on desktop */}
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-900">
                    {user?.name || user?.fullName || user?.email?.split('@')[0]}
                  </span>
                  <span className="text-xs text-gray-500">
                    @{user?.userName || user?.email?.split('@')[0]}
                  </span>
                </div>
                
                {/* Dropdown arrow */}
                <svg 
                  className="hidden md:block w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg"
                title="Logout"
              >
                <FiLogOut className="w-4 h-4" />
                <span className="hidden lg:block">Logout</span>
              </button>

              {/* Mobile Logout Button */}
              <button
                onClick={handleLogout}
                className="md:hidden p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                title="Logout"
              >
                <FiLogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Profile Dropdown Menu (would need state management) */}
      {/* 
      {isProfileDropdownOpen && (
        <div className="absolute right-4 top-16 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-48 z-50">
          <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2">
            <FiUser className="w-4 h-4" />
            <span>Profile</span>
          </button>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2">
            <FiSettings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          <hr className="my-2" />
          <button 
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600 flex items-center space-x-2"
          >
            <FiLogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      )}
      */}
    </nav>
  )
}