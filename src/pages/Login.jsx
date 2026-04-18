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
      navigate('/')
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
      navigate('/')
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
      <div className="container w-full max-w-5xl pt-1 sm:pt-2">
        <div className="auth-content-frame">
          <div className="fade-up mb-9 text-center">
            <h1 className="mb-2 mt-1 font-heading text-[28px] font-extrabold tracking-tight text-text">
              Welcome back
            </h1>
            <p className="text-sm text-text2">
              Log in to access your learning dashboard
            </p>
          </div>

          <div className="card auth-card fade-up-2 mx-auto max-w-[420px] shadow-2xl shadow-black/20">
            {error && <div className="alert alert-error">{error}</div>}

            <div className="mb-5">
              <GoogleSignInButton
                onCredential={handleGoogleLogin}
                onError={(msg) => setError(msg)}
              />
            </div>

            <div className="auth-divider mb-1 text-center text-xs uppercase tracking-[0.2em]">or</div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="label auth-label">Email</label>
                <input className="input auth-input" type="email" placeholder="example@gmail.com" value={form.email} onChange={set('email')} required />
              </div>

              <div className="form-group mb-6">
                <label className="label auth-label">Password</label>
                <input className="input auth-input" type="password" placeholder="********" value={form.password} onChange={set('password')} required />
              </div>

              <button className="btn btn-primary w-full" type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Sign In'}
              </button>
            </form>

            <p className="mt-5 text-center text-[13px] text-text2">
              New user? <Link to="/register" className="text-accent">Create an account</Link>
              <br />
              <br />
              Are you a teacher? <Link to="/educator-login" className="text-accent">Educator Login Here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
