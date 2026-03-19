import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../api/auth'
import { useAuth } from '../context/AuthContext'

const EDUCATOR_EMAIL = import.meta.env.VITE_EDUCATOR_EMAIL || 'educator@gmail.com'

export default function EducatorLogin() {
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
      const isEducatorAccount = res.data.user.role === 'educator'
      
      if (!isEducatorAccount) {
        setError('This is not an Educator account. Please use Student or Admin login.')
        setLoading(false)
        return
      }

      login(res.data.user, res.data.token)
      navigate('/educator')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page theme-auth">
      <div className="container w-full max-w-5xl pt-4 sm:pt-6">
        <div className="auth-content-frame">
          <div className="fade-up mb-9 text-center">
            <h1 className="mb-2 mt-1 font-heading text-[28px] font-extrabold tracking-tight text-text">
              Educator Portal Access
            </h1>
            <p className="text-sm text-text2">
              Sign in to view real-time student ML insights
            </p>
          </div>

          <div className="card auth-card fade-up-2 mx-auto max-w-[420px] shadow-2xl shadow-blue-900/10 border-blue-500/20">
            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group hover:border-blue-500 transition-colors">
              <label className="label auth-label text-blue-700 dark:text-blue-300">Educator Email</label>
                <input className="input auth-input focus:border-blue-500 focus:ring-blue-500/20" type="email" placeholder={EDUCATOR_EMAIL} value={form.email} onChange={set('email')} required />
              </div>

              <div className="form-group mb-6 hover:border-blue-500 transition-colors">
                <label className="label auth-label text-blue-700 dark:text-blue-300">Password</label>
                <input className="input auth-input focus:border-blue-500 focus:ring-blue-500/20" type="password" placeholder="********" value={form.password} onChange={set('password')} required />
              </div>

              <button className="btn w-full bg-blue-600 hover:bg-blue-700 text-white border-transparent" type="submit" disabled={loading}>
                {loading ? 'Authenticating...' : 'View Student Insights ›'}
              </button>
            </form>

            <div className="mt-8 text-center pt-5 border-t border-border">
              <Link to="/login" className="text-[14px] font-semibold text-text2 hover:text-blue-600">
                &larr; Back to Main Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
