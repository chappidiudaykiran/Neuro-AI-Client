import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ecurveLogo from '../assets/ecurve logo.jpg'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const roleLabel = user?.role 

  const handleLogout = () => { logout(); navigate('/login') }
  const handleOpenChangePassword = () => {
    setMenuOpen(false)
    navigate('/change-password')
  }

  useEffect(() => {
    const onDocClick = (e) => {
      if (!menuRef.current?.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  return (
    <nav className="navbar">
      <div className="container flex items-center justify-between w-full">
        <NavLink to="/" className="-ml-10 mr-auto flex items-center gap-2 pr-4 sm:-ml-14">
          <img src={ecurveLogo} alt="Ecurve" className="h-7 w-auto max-w-[190px] object-contain sm:h-8 md:h-9" />
        </NavLink>

        {user && (
          <div className="nav-links ml-2">
            <NavLink to="/courses"
              className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              Courses
            </NavLink>
            <NavLink to="/dashboard"
              className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              Dashboard
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin"
                className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
                Admin
              </NavLink>
            )}
          </div>
        )}

        <div className="ml-6 flex items-center gap-3 sm:ml-10">
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-xl bg-bg2 px-3 py-1.5 text-left"
              >
                <span className="flex items-center gap-2">
                  <span className="flex flex-col leading-tight">
                    <span className="text-[13px] font-bold uppercase text-text">{user.name}</span>
                    <span className="mt-1 text-[11px] capitalize text-text3">{roleLabel}</span>
                  </span>
                  {user.photo ? (
                    <img src={user.photo} alt="User" className="h-7 w-7 rounded-full object-cover border border-border" />
                  ) : (
                    <span className="inline-block h-7 w-7 rounded-full bg-bg3 border border-border" />
                  )}
                </span>
                <span className="text-text3">▾</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-border bg-bg2 p-1.5 shadow-[0_12px_24px_-14px_rgba(30,58,138,0.45)]">
                  <button
                    type="button"
                    className="w-full rounded-lg px-3 py-2 text-left text-[13px] text-text2 hover:bg-bg3"
                    onClick={() => { setMenuOpen(false); navigate('/edit-profile') }}
                  >
                    Edit Profile
                  </button>
                  <button
                    type="button"
                    className="w-full rounded-lg px-3 py-2 text-left text-[13px] text-text2 hover:bg-bg3"
                    onClick={handleOpenChangePassword}
                  >
                    Change Password
                  </button>
                  <button
                    type="button"
                    className="w-full rounded-lg px-3 py-2 text-left text-[13px] text-red-600 hover:bg-bg3"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
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
