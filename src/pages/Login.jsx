import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { googleAuth, loginUser } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import GoogleSignInButton from '../components/GoogleSignInButton'

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'test@gmail.com'
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'test@123'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [loginMode, setLoginMode] = useState('user')
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await loginUser(form)
      const isAdminAccount = res.data.user.role === 'admin'
      if (loginMode === 'admin') {
        if (!(form.email === ADMIN_EMAIL && form.password === ADMIN_PASSWORD)) {
          setError(`Only ${ADMIN_EMAIL} can login as admin.`)
          setLoading(false)
          return
        }
        if (!isAdminAccount) {
          setError('This is not an admin account. Please use User Login.')
          setLoading(false)
          return
        }
        login(res.data.user, res.data.token)
        navigate('/admin')
        return
      }
      if (isAdminAccount) {
        setError('Invalid email or password.')
        setLoading(false)
        return
      }
      login(res.data.user, res.data.token)
      navigate('/courses')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async (credential) => {
    setError('')
    setLoading(true)
    try {
      const res = await googleAuth({ credential })
      if (res.data.user.role === 'admin') {
        // Do not show any message, just do not log in
        setLoading(false)
        return
      }
      login(res.data.user, res.data.token)
      navigate('/courses')
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Google sign-in failed: backend is unreachable. Start server and verify MongoDB Atlas IP whitelist.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page theme-auth">
      <div className="container w-full max-w-5xl pt-4 sm:pt-6">
        <div className="auth-content-frame">
          <div className="fade-up mb-9 text-center">
            <h2 className="mb-2 text-[18px] font-extrabold leading-tight text-emerald-700 sm:text-[20px]">
              Neuro-AI Adaptive Educational Intelligence System
            </h2>
            <h1 className="mb-2 mt-1 font-heading text-[28px] font-extrabold tracking-tight text-emerald-950">
              {loginMode === 'admin' ? 'Admin Access' : 'Welcome back'}
            </h1>
            <p className="text-sm text-text2">
              {loginMode === 'admin' ? 'Sign in to the admin dashboard' : 'Log in to access your learning dashboard'}
            </p>
          </div>

          <div className="card auth-card fade-up-2 mx-auto max-w-[420px] shadow-2xl shadow-black/20">
            {error && <div className="alert alert-error">{error}</div>}

            {loginMode === 'user' && (
              <>
                <div className="mb-5">
                  <GoogleSignInButton
                    onCredential={handleGoogleLogin}
                    onError={(msg) => setError(msg)}
                  />
                </div>

                <div className="auth-divider mb-1 text-center text-xs uppercase tracking-[0.2em]">or</div>
              </>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="label auth-label">{loginMode === 'admin' ? 'Admin Email' : 'Email'}</label>
                <input className="input auth-input" type="email" placeholder={loginMode === 'admin' ? 'admin@example.com' : 'you@example.com'} value={form.email} onChange={set('email')} required />
              </div>

              <div className="form-group mb-6">
                <label className="label auth-label">Password</label>
                <input className="input auth-input" type="password" placeholder="********" value={form.password} onChange={set('password')} required />
              </div>

              <button className="btn btn-primary w-full" type="submit" disabled={loading}>
                {loading ? 'Logging in...' : (loginMode === 'admin' ? 'Admin Sign In ›' : 'Sign In')}
              </button>
            </form>

            {loginMode === 'user' && (
              <p className="mt-5 text-center text-[13px] text-text2">
                New user? <Link to="/register" className="text-accent">Create an account</Link>
              </p>
            )}

            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => {
                  const nextMode = loginMode === 'user' ? 'admin' : 'user'
                  setLoginMode(nextMode)
                  setError('')
                  setForm({ email: '', password: '' })
                }}
                className="text-[14px] text-text3 hover:text-accent"
              >
                {loginMode === 'user' ? 'Admin Login' : 'User Login'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
