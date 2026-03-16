import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { googleAuth, registerUser } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import GoogleSignInButton from '../components/GoogleSignInButton'

const LEARNING_STYLES = [
  { value: 0, label: 'Visual - learn by watching' },
  { value: 1, label: 'Reading - learn by reading' },
  { value: 2, label: 'Kinesthetic - learn by doing' },
]

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
      setError(err.response?.data?.message || 'Google sign-up failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_70%_50%_at_70%_50%,rgba(0,212,170,0.08),transparent)] p-5 pt-24">
      <div className="w-full max-w-[520px]">
        <div className="fade-up mb-8 text-center">
          <Link to="/" className="font-heading text-[22px] font-extrabold text-accent">NeuroLearn</Link>
          <h1 className="mb-2 mt-5 font-heading text-[28px] font-extrabold tracking-tight">Create your account</h1>
          <p className="text-sm text-text2">Step {step} of 2 - {step === 1 ? 'Basic info' : 'Learning profile'}</p>
          <div className="mt-4 flex justify-center gap-2">
            {[1, 2].map((s) => (
              <div key={s} className={`h-1 w-12 rounded ${s <= step ? 'bg-accent' : 'bg-surface'}`} />
            ))}
          </div>
        </div>

        <div className="card fade-up-2">
          {error && <div className="alert alert-error">{error}</div>}

          {step === 1 && (
            <>
              <div className="mb-5">
                <GoogleSignInButton
                  onCredential={handleGoogleRegister}
                  onError={(msg) => setError(msg)}
                />
              </div>
              <div className="mb-5 text-center text-xs uppercase tracking-[0.2em] text-text3">or fill details manually</div>
            </>
          )}

          {step === 1 ? (
            <form onSubmit={nextStep}>
              <div className="form-group">
                <label className="label">Full Name</label>
                <input className="input" placeholder="Your full name" value={form.name} onChange={set('name')} required />
              </div>
              <div className="form-group">
                <label className="label">Email</label>
                <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
              </div>
              <div className="form-group">
                <label className="label">Password</label>
                <input className="input" type="password" placeholder="Min 6 characters" value={form.password} onChange={set('password')} required minLength={6} />
              </div>

              <div className="form-group mb-6">
                <label className="label">I am a</label>
                <div className="flex gap-2.5">
                  {['student', 'educator'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, role: r }))}
                      className={`btn flex-1 border text-sm capitalize ${form.role === r
                        ? 'border-accent bg-accent/15 text-accent'
                        : 'border-border bg-bg3 text-text2'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <button className="btn btn-primary w-full" type="submit">Continue -&gt;</button>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-1 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="form-group">
                  <label className="label">Age</label>
                  <input className="input" type="number" min="15" max="35" placeholder="22" value={form.age} onChange={set('age')} required />
                </div>
                <div className="form-group">
                  <label className="label">Gender</label>
                  <select className="input" value={form.gender} onChange={set('gender')}>
                    <option value="1">Male</option>
                    <option value="0">Female</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="label">Learning Style</label>
                <select className="input" value={form.learningStyle} onChange={set('learningStyle')}>
                  {LEARNING_STYLES.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="label">Class Attendance - {form.attendancePercent}%</label>
                <input className="w-full accent-accent" type="range" min="60" max="100" step="5" value={form.attendancePercent} onChange={set('attendancePercent')} />
                <div className="mt-1 flex justify-between text-[11px] text-text3"><span>60%</span><span>100%</span></div>
              </div>

              <div className="mb-6 flex flex-col gap-3">
                {[
                  { key: 'usesExtraResources', label: 'I use extra resources (books, YouTube, notes)' },
                  { key: 'extracurricular', label: 'I participate in extracurricular activities' },
                ].map((opt) => (
                  <label key={opt.key} className="flex cursor-pointer items-center gap-3 rounded-[10px] border border-border bg-bg3 p-3">
                    <input className="h-4 w-4 accent-accent" type="checkbox" checked={form[opt.key]} onChange={set(opt.key)} />
                    <span className="text-[13px] text-text2">{opt.label}</span>
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
