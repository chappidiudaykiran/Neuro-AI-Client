import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar    from './components/Navbar'
import Home      from './pages/Home'
import Login     from './pages/Login'
import Register  from './pages/Register'
import Courses   from './pages/Courses'
import VideoPlayer from './pages/VideoPlayer'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/Educator'
import ChangePassword from './pages/ChangePassword'
import EditProfile from './pages/EditProfile'

// Redirects to /login if not logged in
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex min-h-screen items-center justify-center">
    <div className="spinner" />
  </div>
  return user ? children : <Navigate to="/login" replace />
}


// Redirects to /courses if not an admin
function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/courses" replace />
  return children
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/courses" element={
          <PrivateRoute><Courses /></PrivateRoute>
        } />
        <Route path="/courses/:id" element={
          <PrivateRoute><VideoPlayer /></PrivateRoute>
        } />
        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />
        <Route path="/change-password" element={
          <PrivateRoute><ChangePassword /></PrivateRoute>
        } />
        <Route path="/edit-profile" element={
          <PrivateRoute><EditProfile /></PrivateRoute>
        } />
        <Route path="/change-password" element={
          <PrivateRoute><ChangePassword /></PrivateRoute>
        } />
        <Route path="/student/change-password" element={
          <PrivateRoute><ChangePassword /></PrivateRoute>
        } />
        <Route path="/student/change-password" element={
          <PrivateRoute><ChangePassword /></PrivateRoute>
        } />
        <Route path="/admin" element={
          <AdminRoute><AdminDashboard /></AdminRoute>
        } />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
