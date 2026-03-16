import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { googleAuth, loginUser } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import GoogleSignInButton from '../components/GoogleSignInButton'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

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
      login(res.data.user, res.data.token)
      navigate(res.data.user.role === 'educator' ? '/educator' : '/courses')
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
    login(res.data.user, res.data.token)
    navigate(res.data.user.role === 'educator' ? '/educator' : '/courses')
  } catch (err) {
    setError(err.response?.data?.message || 'Google sign-in failed.')
  } finally {
    setLoading(false)
  }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_70%_50%_at_30%_50%,rgba(0,153,255,0.06),transparent)] p-5 pt-24">
      <div className="w-full max-w-[420px]">
        <div className="fade-up mb-9 text-center">
          <Link to="/" className="font-heading text-[22px] font-extrabold text-accent">
            NeuroLearn
          </Link>
          <h1 className="mb-2 mt-5 font-heading text-[28px] font-extrabold tracking-tight">Welcome back</h1>
          <p className="text-sm text-text2">Sign in to continue learning</p>
        </div>

        <div className="card fade-up-2">
          {error && <div className="alert alert-error">{error}</div>}

          <div className="mb-5">
            <GoogleSignInButton
              onCredential={handleGoogleLogin}
              onError={(msg) => setError(msg)}
            />
          </div>

          <div className="mb-5 text-center text-xs uppercase tracking-[0.2em] text-text3">or</div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label">Email</label>
              <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
            </div>

            <div className="form-group mb-6">
              <label className="label">Password</label>
              <input className="input" type="password" placeholder="********" value={form.password} onChange={set('password')} required />
            </div>

            <button className="btn btn-primary w-full" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In ->'}
            </button>
          </form>

          <p className="mt-5 text-center text-[13px] text-text2">
            Don't have an account? <Link to="/register" className="text-accent">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
