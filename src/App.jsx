import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar    from './components/Navbar'
import Home      from './pages/Home'
import './chat.css'
import Login     from './pages/Login'
import EducatorLogin from './pages/EducatorLogin'
import Register  from './pages/Register'
import Courses   from './pages/Courses'
import CategoryCourses from './pages/CategoryCourses'
import VideoPlayer from './pages/VideoPlayer'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/Admin'
import AdminAddSubject from './pages/AdminAddSubject'
import AdminEditSubject from './pages/AdminEditSubject'
import AdminAssignments from './pages/AdminAssignments'
import Assignments from './pages/Assignments'
import AssignmentPage from './pages/AssignmentPage'
import EducatorDashboard from './pages/Educator'
import ChangePassword from './pages/ChangePassword'
import EditProfile from './pages/EditProfile'
import Support from './pages/Support'
import EducatorSupport from './pages/EducatorSupport'
import SupportNotification from './components/SupportNotification'

// Redirects to /login if not logged in
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="w-full flex min-h-screen items-center justify-center">
    <div className="spinner" />
  </div>
  return user ? children : <Navigate to="/login" replace />
}

// Redirects to / if not an educator
function EducatorRoute({ children }) {
  const { user, isEducator, isAdmin, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (!isEducator && !isAdmin) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <SupportNotification />
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/educator-login" element={<EducatorLogin />} />
        <Route path="/register" element={<Register />} />

        <Route path="/courses" element={
          <PrivateRoute><Courses /></PrivateRoute>
        } />
        <Route path="/courses/category/:categorySlug" element={
          <PrivateRoute><CategoryCourses /></PrivateRoute>
        } />
        <Route path="/courses/:id" element={
          <PrivateRoute><VideoPlayer /></PrivateRoute>
        } />
        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />
        <Route path="/assignments" element={
          <PrivateRoute><Assignments /></PrivateRoute>
        } />
        <Route path="/courses/:id/assignment/:moduleNumber" element={
          <PrivateRoute><AssignmentPage /></PrivateRoute>
        } />
        <Route path="/change-password" element={
          <PrivateRoute><ChangePassword /></PrivateRoute>
        } />
        <Route path="/edit-profile" element={
          <PrivateRoute><EditProfile /></PrivateRoute>
        } />
        <Route path="/student/change-password" element={
          <PrivateRoute><ChangePassword /></PrivateRoute>
        } />
        <Route path="/support" element={
          <PrivateRoute><Support /></PrivateRoute>
        } />

        {/* Educator routes (manage subjects, assignments, student insights) */}
        <Route path="/educator" element={
          <EducatorRoute><EducatorDashboard /></EducatorRoute>
        } />
        <Route path="/educator/subjects" element={
          <EducatorRoute><AdminDashboard /></EducatorRoute>
        } />
        <Route path="/educator/subjects/add" element={
          <EducatorRoute><AdminAddSubject /></EducatorRoute>
        } />
        <Route path="/educator/subjects/edit/:id" element={
          <EducatorRoute><AdminEditSubject /></EducatorRoute>
        } />
        <Route path="/educator/assignments" element={
          <EducatorRoute><AdminAssignments /></EducatorRoute>
        } />
        <Route path="/educator/support" element={
          <EducatorRoute><EducatorSupport /></EducatorRoute>
        } />

        {/* Keep old admin routes working as redirects */}
        <Route path="/admin" element={<Navigate to="/educator/subjects" replace />} />
        <Route path="/admin/add" element={<Navigate to="/educator/subjects/add" replace />} />
        <Route path="/admin/edit/:id" element={<Navigate to="/educator/subjects/edit/:id" replace />} />
        <Route path="/admin/assignments" element={<Navigate to="/educator/assignments" replace />} />

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
