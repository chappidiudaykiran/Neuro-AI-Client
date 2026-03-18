import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ecurveLogo from '../assets/ecurve_logo_transparent.png'
import ecurveLogoDark from '../assets/ecurve_logo_darkmode.png'

export default function Navbar() {
  const { user, logout, isAdmin, isEducator } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'))
  const menuRef = useRef(null)
  const roleLabel = user?.role 

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setIsDark(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setIsDark(true)
    }
  }

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
      <div className="container flex items-center justify-between w-full h-full">
        {/* Logo Section & Mobile Toggle */}
        <div className="flex items-center shrink-0 gap-1 sm:gap-2 -ml-2 sm:-ml-0">
          {user && (
            <button 
              type="button" 
              className="md:hidden p-1.5 text-text2 hover:bg-bg3 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen((v) => !v)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          )}
          <NavLink to="/" className="flex items-center">
            <img 
              src={isDark ? ecurveLogoDark : ecurveLogo} 
              alt="Ecurve" 
              className="h-[22px] w-auto max-w-[140px] object-contain sm:h-7 md:h-8" 
              style={isDark ? { filter: 'brightness(0) invert(1)' } : {}}
            />
          </NavLink>
        </div>

        {/* Center Nav Links (Desktop) */}
        {user && (
          <div className="hidden md:flex flex-1 justify-center">
            <div className="nav-links">
              <NavLink to="/courses" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
                Courses
              </NavLink>
              <NavLink to="/dashboard" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
                Dashboard
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
                  Content Admin
                </NavLink>
              )}
              {isEducator && (
                <NavLink to="/educator" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
                  Student Insights
                </NavLink>
              )}
            </div>
          </div>
        )}

        {/* Right Section (Profile / Auth) */}
        <div className="flex items-center justify-end shrink-0 gap-3">
          <button 
            type="button" 
            onClick={toggleTheme}
            className="p-1.5 text-text2 hover:bg-bg3 rounded-lg transition-colors flex items-center justify-center h-8 w-8 ml-auto sm:ml-0"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? (
              <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd"></path></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
            )}
          </button>

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-xl bg-bg2 px-3 py-1.5 text-left border border-transparent hover:border-border transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span className="hidden sm:flex flex-col leading-tight text-right mr-1">
                    <span className="text-[13px] font-bold uppercase text-text">{user.name}</span>
                    <span className="mt-1 text-[10px] capitalize text-text3">{roleLabel}</span>
                  </span>
                  {user.photo ? (
                    <img src={user.photo} alt="User" className="h-8 w-8 rounded-full object-cover border border-border" />
                  ) : (
                    <span className="inline-block h-8 w-8 rounded-full bg-bg3 border border-border" />
                  )}
                </span>
                <span className="text-text3 text-xs">▾</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-border bg-bg2 p-1.5 shadow-lg shadow-black/10">
                  <div className="sm:hidden px-3 py-2 border-b border-border/50 mb-1">
                    <div className="text-[13px] font-bold uppercase text-text">{user.name}</div>
                    <div className="text-[11px] capitalize text-text3">{roleLabel}</div>
                  </div>
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
                    className="w-full rounded-lg px-3 py-2 text-left text-[13px] text-red-600 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink to="/login" className="btn btn-ghost text-[13px]">Login</NavLink>
              <NavLink to="/register" className="btn btn-primary px-[18px] py-[7px] text-[13px]">
                Sign Up
              </NavLink>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Links Dropdown */}
      {user && mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-border shadow-2xl p-4 flex flex-col gap-2 z-40 animate-fade-up">
          <NavLink to="/courses" className={({ isActive }) => 'nav-link text-center text-base py-3' + (isActive ? ' active' : '')} onClick={() => setMobileMenuOpen(false)}>
            Courses
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => 'nav-link text-center text-base py-3' + (isActive ? ' active' : '')} onClick={() => setMobileMenuOpen(false)}>
            Dashboard
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => 'nav-link text-center text-base py-3' + (isActive ? ' active' : '')} onClick={() => setMobileMenuOpen(false)}>
              Content Admin
            </NavLink>
          )}
          {isEducator && (
            <NavLink to="/educator" className={({ isActive }) => 'nav-link text-center text-base py-3' + (isActive ? ' active' : '')} onClick={() => setMobileMenuOpen(false)}>
              Student Insights
            </NavLink>
          )}
        </div>
      )}
    </nav>
  )
}
