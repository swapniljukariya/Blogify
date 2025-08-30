import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import RedirectRoot from './components/RedirectRoot'
import ProtectedRoute from './components/ProtectedRoute'
import CreateBlog from './components/CreateBlog'
import BlogDetails from './components/BlogDetails'


const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <RedirectRoot /> },
      {
        path: 'home',
        element: <ProtectedRoute />,
        children: [{ index: true, element: <Home /> }]
      },
      {
        path: 'create',
        element: <ProtectedRoute />,
        children: [{ index: true, element: <CreateBlog /> }]
      },
      {
        path: 'blog/:id',
        element: <ProtectedRoute />,
        children: [{ index: true, element: <BlogDetails /> }]
      },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
)