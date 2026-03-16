import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout, isEducator } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <nav className="navbar">
      <div className="container flex items-center justify-between w-full">
        <NavLink to="/" className="nav-logo">NeuroLearn</NavLink>

        {user && (
          <div className="nav-links">
            <NavLink to="/courses"
              className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              Courses
            </NavLink>
            <NavLink to="/dashboard"
              className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              Dashboard
            </NavLink>
            {isEducator && (
              <NavLink to="/educator"
                className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
                Educator
              </NavLink>
            )}
          </div>
        )}

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-[13px] text-text2">
                {user.name}
              </span>
              <button className="btn btn-outline px-4 py-1.5 text-[13px]"
                onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn btn-ghost text-[13px]">Login</NavLink>
              <NavLink to="/register" className="btn btn-primary px-[18px] py-[7px] text-[13px]">
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
