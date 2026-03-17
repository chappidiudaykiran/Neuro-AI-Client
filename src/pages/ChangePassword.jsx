import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { changePassword } from '../api/auth'

function SecurityBadgeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l8 4v6c0 5-3.4 8.7-8 10-4.6-1.3-8-5-8-10V7l8-4z" />
      <rect x="9" y="11" width="6" height="5" rx="1" />
      <path d="M10 11V9.8A2 2 0 0 1 12 8a2 2 0 0 1 2 1.8V11" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.85 10.85 0 0 1 12 19c-7 0-11-7-11-7a21.77 21.77 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A10.68 10.68 0 0 1 12 4c7 0 11 8 11 8a21.8 21.8 0 0 1-3.17 4.27" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <path d="M1 1l22 22" />
    </svg>
  )
}

export default function ChangePassword() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [show, setShow] = useState({ current: false, next: false, confirm: false })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showSuccessAnim, setShowSuccessAnim] = useState(false)

  const setField = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError('Please fill all fields.')
      return
    }

    if (form.newPassword.length < 6) {
      setError('New password must be at least 6 characters.')
      return
    }

    if (form.newPassword !== form.confirmPassword) {
      setError('New password and confirm password do not match.')
      return
    }

    setLoading(true)
    try {
      const res = await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      })
      setSuccess(res.data?.message || 'Password updated successfully.')
      setShowSuccessAnim(false)
      requestAnimationFrame(() => setShowSuccessAnim(true))
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page page-auth">
      <div className="container max-w-xl pb-6 pt-3 sm:pt-4">
        <button
          type="button"
          className="mb-6 inline-flex items-center gap-2 rounded-lg bg-bg2 px-3 py-1.5 text-sm font-medium text-text2 hover:bg-bg3 hover:text-text"
          onClick={() => navigate(-1)}
        >
          <span aria-hidden="true">←</span>
          <span>Return</span>
        </button>

        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-600 shadow-sm">
            <SecurityBadgeIcon />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text">Change Password</h1>
            <p className="text-text2">Update your account password</p>
          </div>
        </div>

        <div className="card min-h-[390px]">
          {error && <div className="alert alert-error">{error}</div>}
          {success && (
            <div
              className={[
                'mb-4 rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-3 text-green-700',
                'transition-all duration-500 ease-out',
                showSuccessAnim ? 'translate-y-0 scale-100 opacity-100 shadow-[0_0_0_6px_rgba(34,197,94,0.12)]' : 'translate-y-1 scale-[0.98] opacity-0',
              ].join(' ')}
            >
              <div className="flex items-center gap-2 text-sm font-semibold">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-white">✓</span>
                Password changed successfully
              </div>
              <p className="mt-1 text-sm text-green-700/90">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-group">
              <label className="label">Current Password</label>
              <div className="flex items-center gap-2">
                <input
                  className="input"
                  type={show.current ? 'text' : 'password'}
                  placeholder="Enter current password"
                  value={form.currentPassword}
                  onChange={setField('currentPassword')}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline px-3"
                  onClick={() => setShow((s) => ({ ...s, current: !s.current }))}
                  aria-label={show.current ? 'Hide current password' : 'Show current password'}
                  title={show.current ? 'Hide password' : 'Show password'}
                >
                  {show.current ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="label">New Password</label>
              <div className="flex items-center gap-2">
                <input
                  className="input"
                  type={show.next ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={form.newPassword}
                  onChange={setField('newPassword')}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline px-3"
                  onClick={() => setShow((s) => ({ ...s, next: !s.next }))}
                  aria-label={show.next ? 'Hide new password' : 'Show new password'}
                  title={show.next ? 'Hide password' : 'Show password'}
                >
                  {show.next ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="label">Confirm New Password</label>
              <div className="flex items-center gap-2">
                <input
                  className="input"
                  type={show.confirm ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={form.confirmPassword}
                  onChange={setField('confirmPassword')}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline px-3"
                  onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
                  aria-label={show.confirm ? 'Hide confirm password' : 'Show confirm password'}
                  title={show.confirm ? 'Hide password' : 'Show password'}
                >
                  {show.confirm ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <button className="btn btn-primary w-full" type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
