import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getCourses } from '../api/courses'
import { getSlug } from './CategoryCard'
import ecurveLogo from '../assets/ecurve_logo_transparent.png'
import ecurveLogoDark from '../assets/ecurve_logo_darkmode.png'
import educatorAvatar from '../assets/educator.jpg'
import userIcon from '../assets/user icon.png'

const CATEGORIES = ['GATE Prep', 'Programming', 'CS Core']

function NavbarSearch({ navigate }) {
  const [courses, setCourses] = useState([])

  useEffect(() => {
    getCourses().then(r => setCourses(r.data)).catch(() => {})
  }, [])

  const handleSearch = (value) => {
    const q = value.trim().toLowerCase()
    if (!q) return
    // Match category
    const catMatch = CATEGORIES.find(c => c.toLowerCase().includes(q) || q.includes(c.toLowerCase()))
    if (catMatch) { navigate(`/courses/category/${getSlug(catMatch)}`); return }
    // Match subject/course name
    const courseMatch = courses.find(c => c.name?.toLowerCase().includes(q) || q.includes(c.name?.toLowerCase()))
    if (courseMatch) { navigate(`/courses/${courseMatch._id}`); return }
    // Fallback
    navigate('/courses')
  }

  return (
    <div className="hidden md:flex items-center ml-16 max-w-[200px]">
      <div className="flex items-center w-full rounded-lg border border-border bg-bg3 px-3 py-1.5 transition-all focus-within:border-accent focus-within:bg-bg2">
        <svg className="w-3.5 h-3.5 text-text3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <input
          type="text"
          placeholder="Search courses…"
          className="ml-2 w-full bg-transparent text-[13px] text-text placeholder:text-text3 outline-none"
          onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(e.target.value) }}
        />
      </div>
    </div>
  )
}

export default function Navbar() {
  const { user, logout, isEducator } = useAuth()
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
        <div className="flex items-center shrink-0 gap-1 sm:gap-2">
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
              className="h-[22px] w-auto max-w-[100px] sm:max-w-[140px] border-none outline-none object-contain sm:h-7 md:h-8"
              style={isDark ? { filter: 'brightness(0) invert(1)' } : {}}
            />
          </NavLink>
        </div>

        {/* Search Bar (after logo) — hidden for educators */}
        {user && !isEducator && (
          <NavbarSearch navigate={navigate} />
        )}

        {/* Center Nav Links (Desktop) */}
        {user && (
          <div className="hidden md:flex flex-1 justify-center">
            <div className={`nav-links flex ${isEducator ? 'gap-1' : 'gap-0'}`}>
              <NavLink to="/" className={({ isActive }) => `nav-link${isEducator ? ' text-[13.5px] px-3.5' : ''}` + (isActive ? ' active' : '')} end>
                Home
              </NavLink>
              <NavLink to="/courses" className={({ isActive }) => `nav-link${isEducator ? ' text-[13.5px] px-3.5' : ''}` + (isActive ? ' active' : '')}>
                Courses
              </NavLink>
              {!isEducator && (
                <NavLink to="/dashboard" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
                  Dashboard
                </NavLink>
              )}
              {isEducator && (
                <NavLink to="/educator/subjects" className={({ isActive }) => 'nav-link text-[13.5px] px-3.5' + (isActive ? ' active' : '')}>
                  Subjects
                </NavLink>
              )}

              <NavLink to={isEducator ? '/educator/assignments' : '/assignments'} className={({ isActive }) => `nav-link${isEducator ? ' text-[13.5px] px-3.5' : ''}` + (isActive ? ' active' : '')}>
                Assignments
              </NavLink>
              
              {!isEducator && (
                <NavLink to="/support" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
                  Support
                </NavLink>
              )}

              {isEducator && (
                <>
                  <NavLink to="/educator" className={({ isActive }) => 'nav-link text-[13.5px] px-3.5' + (isActive ? ' active' : '')}>
                    Insights
                  </NavLink>
                  <NavLink to="/educator/support" className={({ isActive }) => 'nav-link text-[13.5px] px-3.5' + (isActive ? ' active' : '')}>
                    Support
                  </NavLink>
                </>
              )}
            </div>
          </div>
        )}

        {/* Right Section (Profile / Auth) */}
        <div className="flex items-center justify-end shrink-0 gap-3">
          <button 
            type="button" 
            onClick={toggleTheme}
            className="flex items-center justify-center h-9 w-9 rounded-full text-text2 hover:text-accent hover:bg-bg3 transition-all"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? (
              <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
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
                    <span className="text-[13px] font-bold uppercase text-text">
                      {user.role === 'educator' ? 'Educator' : user.name}
                    </span>
                    <span className="mt-1 text-[10px] capitalize text-text3">{roleLabel}</span>
                  </span>
                  {user.photo ? (
                    <img src={user.photo} alt="User" className="h-8 w-8 rounded-full object-cover border border-border" />
                  ) : (
                    <img src={isEducator ? educatorAvatar : userIcon} alt="User" className="h-8 w-8 rounded-full object-cover border border-border" />
                  )}
                </span>
                <span className="text-text3 text-xs">▾</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-border bg-bg2 p-1.5 shadow-lg shadow-black/10">
                  <div className="sm:hidden px-3 py-2 border-b border-border mb-1">
                    <div className="text-[13px] font-bold uppercase text-text">
                      {user.role === 'educator' ? 'Educator' : user.name}
                    </div>
                    <div className="text-[11px] capitalize text-text3">{roleLabel}</div>
                  </div>
                  {user.role === 'student' && (
                    <button
                      type="button"
                      className="w-full rounded-lg px-3 py-2 text-left text-[13px] text-text2 hover:bg-bg3"
                      onClick={() => { setMenuOpen(false); navigate('/edit-profile') }}
                    >
                      Edit Profile
                    </button>
                  )}
                  <button
                    type="button"
                    className="w-full rounded-lg px-3 py-2 text-left text-[13px] text-text2 hover:bg-bg3"
                    onClick={handleOpenChangePassword}
                  >
                    Change Password
                  </button>
                  <button
                    type="button"
                    className="w-full rounded-lg px-3 py-2 text-left text-[13px] text-red-500 hover:bg-red-500/10"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <NavLink to="/login" className={({isActive}) => `px-5 py-2 text-[13px] font-extrabold rounded-lg transition-all ${isActive ? 'bg-accent text-white shadow-md' : 'text-text2 hover:text-accent hover:bg-accent/5'}`}>Login</NavLink>
              <NavLink to="/register" className={({isActive}) => `px-5 py-2 text-[13px] font-extrabold rounded-lg transition-all ${isActive ? 'bg-accent text-white shadow-md' : 'text-text2 hover:text-accent hover:bg-accent/5'}`}>Sign Up</NavLink>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Links Dropdown */}
      {user && mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-bg2 border-b border-border shadow-2xl p-4 flex flex-col gap-2 z-40 animate-fade-up">
          <NavLink to="/" className={({ isActive }) => 'nav-link text-center text-base py-3' + (isActive ? ' active' : '')} onClick={() => setMobileMenuOpen(false)} end>
            Home
          </NavLink>
          <NavLink to="/courses" className={({ isActive }) => 'nav-link text-center text-base py-3' + (isActive ? ' active' : '')} onClick={() => setMobileMenuOpen(false)}>
            Courses
          </NavLink>
          {!isEducator && (
            <NavLink to="/dashboard" className={({ isActive }) => 'nav-link text-center text-base py-3' + (isActive ? ' active' : '')} onClick={() => setMobileMenuOpen(false)}>
              Dashboard
            </NavLink>
          )}
          {isEducator && (
            <NavLink to="/educator/subjects" className={({ isActive }) => 'nav-link text-center text-base py-3' + (isActive ? ' active' : '')} onClick={() => setMobileMenuOpen(false)}>
              Subjects
            </NavLink>
          )}
          <NavLink to={isEducator ? '/educator/assignments' : '/assignments'} className={({ isActive }) => 'nav-link text-center text-base py-3' + (isActive ? ' active' : '')} onClick={() => setMobileMenuOpen(false)}>
            Assignments
          </NavLink>
          <NavLink to={isEducator ? '/educator/support' : '/support'} className={({ isActive }) => 'nav-link text-center text-base py-3' + (isActive ? ' active' : '')} onClick={() => setMobileMenuOpen(false)}>
            Support
          </NavLink>
          {isEducator && (
            <NavLink to="/educator" className={({ isActive }) => 'nav-link text-center text-base py-3' + (isActive ? ' active' : '')} onClick={() => setMobileMenuOpen(false)}>
              Insights
            </NavLink>
          )}
        </div>
      )}
    </nav>
  )
}
