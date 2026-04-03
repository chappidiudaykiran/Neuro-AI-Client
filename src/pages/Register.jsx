import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { googleAuth, registerUser } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import GoogleSignInButton from '../components/GoogleSignInButton'

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'student',
    age: '', gender: '1', learningStyle: '0'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((p) => ({ ...p, [k]: val }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password || !form.age) {
      setError('Please fill all fields.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const payload = {
        ...form,
        age: Number(form.age),
        gender: Number(form.gender),
        learningStyle: Number(form.learningStyle),
      }
      const res = await registerUser(payload)
      login(res.data.user, res.data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleRegister = async (credential) => {
    setError('')
    setLoading(true)
    try {
      const payload = {
        credential,
        role: form.role,
        age: Number(form.age) || 20,
        gender: Number(form.gender),
        learningStyle: Number(form.learningStyle) || 0,
      }
      const res = await googleAuth(payload)
      login(res.data.user, res.data.token)
      navigate(res.data.user.role === 'educator' ? '/educator' : '/')
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Google sign-up failed: backend is unreachable.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page theme-auth">
      <div className="container w-full max-w-5xl pt-6 sm:pt-8">
        <div className="fade-up mb-8 text-center">
          <h2 className="mb-2 text-[18px] font-extrabold leading-tight text-text sm:text-[20px]">
            Create your account
          </h2>
          <p className="text-xs text-text2">Create your account to get started</p>
        </div>

        <div className="card auth-card fade-up-2 mx-auto max-w-[470px]">
          {error && <div className="alert alert-error">{error}</div>}

          <div className="mb-5">
            <GoogleSignInButton
              onCredential={handleGoogleRegister}
              onError={(msg) => setError(msg)}
            />
          </div>
          <div className="auth-divider mb-5 text-center text-[11px] uppercase tracking-[0.18em]">or fill details manually</div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label auth-label">Full Name</label>
              <input className="input auth-input" placeholder="Your full name" value={form.name} onChange={set('name')} required />
            </div>
            <div className="form-group">
              <label className="label auth-label">Email</label>
              <input className="input auth-input" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
            </div>
            <div className="form-group grid grid-cols-2 gap-4">
              <div>
                <label className="label auth-label">Age</label>
                <input className="input auth-input" type="number" min="18" max="30" placeholder="22" value={form.age} onChange={set('age')} required />
              </div>
              <div>
                <label className="label auth-label">Gender</label>
                <select className="input auth-input" value={form.gender} onChange={set('gender')}>
                  <option value="1">Male</option>
                  <option value="0">Female</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="label auth-label">Learning Style</label>
              <select className="input auth-input" value={form.learningStyle} onChange={set('learningStyle')}>
                <option value="0">Visual (Images, videos, diagrams)</option>
                <option value="1">Auditory (Listening, speaking, discussions)</option>
                <option value="2">Kinesthetic (Hands-on, interactive, practice)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="label auth-label">Password</label>
              <input className="input auth-input" type="password" placeholder="Min 6 characters" value={form.password} onChange={set('password')} required minLength={6} />
            </div>

            <button className="btn btn-primary w-full" type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account ->'}
            </button>
          </form>

          <p className="mt-5 text-center text-[13px] text-text2">
            Already have an account? <Link to="/login" className="text-accent">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
