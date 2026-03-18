import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { googleAuth, registerUser } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import GoogleSignInButton from '../components/GoogleSignInButton'



export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'student',
    age: '', gender: '1', learningStyle: '0', attendancePercent: '80',
    usesExtraResources: false, extracurricular: false,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((p) => ({ ...p, [k]: val }))
  }

  const nextStep = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) {
      setError('Please fill all fields.')
      return
    }
    setError('')
    setStep(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = {
        ...form,
        age: Number(form.age),
        gender: Number(form.gender),
        learningStyle: Number(form.learningStyle),
        attendancePercent: Number(form.attendancePercent),
      }
      const res = await registerUser(payload)
      login(res.data.user, res.data.token)
      navigate('/courses')
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
        learningStyle: Number(form.learningStyle),
        attendancePercent: Number(form.attendancePercent) || 80,
        usesExtraResources: form.usesExtraResources,
        extracurricular: form.extracurricular,
      }
      const res = await googleAuth(payload)
      login(res.data.user, res.data.token)
      navigate(res.data.user.role === 'educator' ? '/educator' : '/courses')
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Google sign-up failed: backend is unreachable. Start server and verify MongoDB Atlas IP whitelist.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page theme-auth">
      <div className="container w-full max-w-5xl pt-4 sm:pt-6">
        <div className="fade-up mb-8 text-center">
          <h2 className="mb-2 text-[18px] font-extrabold leading-tight text-text sm:text-[20px]">
            Create your account
          </h2>
          <p className="text-xs text-text2">Step {step} of 2 - {step === 1 ? 'Basic info' : 'Learning profile'}</p>
          <div className="mt-4 flex justify-center gap-2">
            {[1, 2].map((s) => (
              <div key={s} className={`h-1 w-10 rounded ${s <= step ? 'bg-accent' : 'bg-surface'}`} />
            ))}
          </div>
        </div>

        <div className="card auth-card fade-up-2 mx-auto max-w-[470px]">
          {error && <div className="alert alert-error">{error}</div>}

          {step === 1 && (
            <>
              <div className="mb-5">
                <GoogleSignInButton
                  onCredential={handleGoogleRegister}
                  onError={(msg) => setError(msg)}
                />
              </div>
              <div className="auth-divider mb-5 text-center text-[11px] uppercase tracking-[0.18em]">or fill details manually</div>
            </>
          )}

          {step === 1 ? (
            <form onSubmit={nextStep}>
              <div className="form-group">
                <label className="label auth-label">Full Name</label>
                <input className="input auth-input" placeholder="Your full name" value={form.name} onChange={set('name')} required />
              </div>
              <div className="form-group">
                <label className="label auth-label">Email</label>
                <input className="input auth-input" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
              </div>
              <div className="form-group">
                <label className="label auth-label">Password</label>
                <input className="input auth-input" type="password" placeholder="Min 6 characters" value={form.password} onChange={set('password')} required minLength={6} />
              </div>

              <div className="form-group mb-6">
                <label className="label auth-label">I am joining as a:</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="role" value="student" checked={form.role === 'student'} onChange={set('role')} className="accent-accent" />
                    <span className="text-sm font-medium">Student</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="role" value="educator" checked={form.role === 'educator'} onChange={set('role')} className="accent-accent" />
                    <span className="text-sm font-medium">Educator</span>
                  </label>
                </div>
              </div>

              <button className="btn btn-primary w-full" type="submit">Continue <span style={{fontSize: '18px', verticalAlign: 'middle'}}>&rarr;</span></button>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-1 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="form-group">
                  <label className="label auth-label">Age</label>
                  <input className="input auth-input" type="number" min="15" max="35" placeholder="22" value={form.age} onChange={set('age')} required />
                </div>
                <div className="form-group">
                  <label className="label auth-label">Gender</label>
                  <select className="input auth-input" value={form.gender} onChange={set('gender')}>
                    <option value="1">Male</option>
                    <option value="0">Female</option>
                  </select>
                </div>
              </div>



              <div className="mb-6 flex flex-col gap-3">
                {[
                  { key: 'usesExtraResources', label: 'I use extra resources (books, YouTube, notes)' },
                  { key: 'extracurricular', label: 'I participate in extracurricular activities' },
                ].map((opt) => (
                  <label key={opt.key} className="auth-option flex cursor-pointer items-center gap-3 rounded-[10px] border p-2.5">
                    <input className="h-4 w-4 accent-accent" type="checkbox" checked={form[opt.key]} onChange={set(opt.key)} />
                    <span className="text-[12px] text-text2">{opt.label}</span>
                  </label>
                ))}
              </div>

              <div className="flex gap-2.5">
                <button type="button" className="btn btn-outline flex-1" onClick={() => setStep(1)}>Back</button>
                <button className="btn btn-primary flex-[2]" type="submit" disabled={loading}>
                  {loading ? 'Creating account...' : 'Create Account ->'}
                </button>
              </div>
            </form>
          )}

          <p className="mt-5 text-center text-[13px] text-text2">
            Already have an account? <Link to="/login" className="text-accent">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
