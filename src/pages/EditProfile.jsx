import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { updateProfile } from '../api/auth'

const genderOptions = [
  { value: 1, label: 'Male' },
  { value: 0, label: 'Female' },
]

const learningStyleOptions = [
  { value: 0, label: 'Visual' },
  { value: 1, label: 'Auditory' },
  { value: 2, label: 'Kinesthetic' },
]

export default function EditProfile() {
  const navigate = useNavigate()
  const { user, updateUser, loading } = useAuth()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const initialForm = useMemo(() => ({
    name: user?.name || '',
    age: Number(user?.age ?? 20),
    gender: Number(user?.gender ?? 1),
    learningStyle: Number(user?.learningStyle ?? 0),
    attendancePercent: Number(user?.attendancePercent ?? 80),
    usesExtraResources: Boolean(user?.usesExtraResources),
    extracurricular: Boolean(user?.extracurricular),
    photo: user?.photo || '',
  }), [user])
  const [form, setForm] = useState(initialForm)
  // imageFile state if needed
  const [imageFile, setImageFile] = useState(null)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="spinner" />
      </div>
    )
  }
  if (!user) {
    return (
      <div className="page page-auth">
        <div className="container max-w-2xl pb-8 pt-3 sm:pt-4">
          <div className="alert alert-error mt-10 text-center">No user data found. Please log in again.</div>
        </div>
      </div>
    )
  }

  const setField = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    if (!form.name.trim()) {
      setError('Name is required.')
      setSaving(false)
      return
    }

    try {
      const payload = {
        ...form,
        age: Number(form.age),
        gender: Number(form.gender),
        learningStyle: Number(form.learningStyle),
        attendancePercent: Number(form.attendancePercent),
      }
      const res = await updateProfile(payload)
      updateUser(res.data.user)
      setSuccess(res.data?.message || 'Profile updated successfully.')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page page-auth">
      <div className="container max-w-2xl pb-8 pt-3 sm:pt-4">
        <button
          type="button"
          className="mb-6 inline-flex items-center gap-2 rounded-lg bg-bg2 px-3 py-1.5 text-sm font-medium text-text2 hover:bg-bg3 hover:text-text"
          onClick={() => navigate(-1)}
        >
          <span aria-hidden="true">&larr;</span>
          <span>Return</span>
        </button>

        <div className="mb-5">
          <h1 className="text-2xl font-bold text-text">Edit Profile</h1>
          <p className="text-text2">Update your personal details and learning preferences.</p>
        </div>

        <div className="card">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group flex flex-col items-center mb-4">
              <label className="label mb-2">Profile Image</label>
              <div className="mb-2">
                {form.photo ? (
                  <img src={form.photo} alt="Profile" className="h-20 w-20 rounded-full object-cover border border-border" />
                ) : (
                  <img src="https://ui-avatars.com/api/?name=User&background=cccccc&color=222222&size=80" alt="Default Avatar" className="h-20 w-20 rounded-full object-cover border border-border" />
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              <small className="mt-2 text-text2">Upload a new image to change your profile photo.</small>
            </div>
            <div className="form-group">
              <label className="label">Name</label>
              <input className="input" value={form.name} onChange={setField('name')} placeholder="Your name" required />
            </div>

            <div className="form-group">
              <label className="label">Email</label>
              <input className="input" value={user?.email || ''} disabled />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="form-group mb-0">
                <label className="label">Age</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  className="input"
                  value={form.age}
                  onChange={setField('age')}
                  required
                />
              </div>

              <div className="form-group mb-0">
                <label className="label">Attendance (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="input"
                  value={form.attendancePercent}
                  onChange={setField('attendancePercent')}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="form-group mb-0">
                <label className="label">Gender</label>
                <select className="input" value={form.gender} onChange={setField('gender')}>
                  {genderOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group mb-0">
                <label className="label">Learning Style</label>
                <select className="input" value={form.learningStyle} onChange={setField('learningStyle')}>
                  {learningStyleOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <button className="btn btn-primary w-full" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile'}
            </button>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="flex items-center gap-2 rounded-xl border border-border bg-bg2 px-3 py-2 text-sm text-text2">
                <input
                  type="checkbox"
                  checked={form.usesExtraResources}
                  onChange={setField('usesExtraResources')}
                />
                Uses extra resources
              </label>

              <label className="flex items-center gap-2 rounded-xl border border-border bg-bg2 px-3 py-2 text-sm text-text2">
                <input
                  type="checkbox"
                  checked={form.extracurricular}
                  onChange={setField('extracurricular')}
                />
                Participates in extracurricular activities
              </label>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
