import { useState, useEffect } from 'react'
import { getStudents } from '../api/predict'
import { gradeLabel, stressLabel, stateLabel } from '../utils/helpers'
import { useAuth } from '../context/AuthContext'

function StudentDetailModal({ student, onClose }) {
  if (!student) return null;
  
  const learningStyles = ['Visual', 'Auditory', 'Reading/Writing', 'Kinesthetic'];
  const genderLabels = ['Female', 'Male', 'Non-binary', 'Other'];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-lg animate-fade-up rounded-2xl border-2 border-border bg-bg p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-black text-black dark:text-white uppercase tracking-tight">Student Profile</h2>
          <button onClick={onClose} className="text-text3 hover:text-red-500 transition-colors text-2xl font-black">&times;</button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-bg2 border-2 border-border shadow-inner">
            <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-black shadow-lg">
              {student.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div className="text-xl font-black text-black dark:text-white">{student.name}</div>
              <div className="text-sm text-text2 font-medium">{student.email}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Age', value: student.age },
              { label: 'Gender', value: genderLabels[student.gender] ?? 'Other' },
              { label: 'Learning Style', value: learningStyles[student.learningStyle] ?? 'Standard' },
              { label: 'Attendance', value: `${student.attendancePercent}%` },
              { label: 'Extracurricular', value: student.extracurricular ? 'Yes' : 'No' },
              { label: 'Extra Resources', value: student.usesExtraResources ? 'Used' : 'Not Used' },
            ].map((item, idx) => (
              <div key={idx} className="p-3 rounded-lg border border-border bg-bg3/30">
                <div className="text-[10px] font-black uppercase text-text3 tracking-[0.1em] mb-1">{item.label}</div>
                <div className="text-sm font-bold text-text">{item.value || 'N/A'}</div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-border">
             <div className="text-[10px] font-black uppercase text-text3 tracking-[0.1em] mb-2">Registration Date</div>
             <div className="text-sm font-medium text-text">{new Date(student.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</div>
          </div>
        </div>

        <button onClick={onClose} className="btn btn-primary w-full mt-8 shadow-lg font-black uppercase tracking-widest py-3">
          Close Profile
        </button>
      </div>
    </div>
  )
}

export default function EducatorDashboard() {
  const { user } = useAuth()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    getStudents()
      .then((r) => setStudents(r.data))
      .catch(() => setError('Failed to load student data.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = students.filter((s) => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || s.latestPrediction?.state === filter
    return matchSearch && matchFilter
  })

  const stateCounts = {
    optimal: students.filter((s) => s.latestPrediction?.state === 'optimal').length,
    burnout_risk: students.filter((s) => s.latestPrediction?.state === 'burnout_risk').length,
    academic_gap: students.filter((s) => s.latestPrediction?.state === 'academic_gap').length,
    critical: students.filter((s) => s.latestPrediction?.state === 'critical').length,
  }

  const states = [
    { key: 'optimal', label: 'Optimal', tone: 'text-green-300 border-green-500/40 bg-green-500/10' },
    { key: 'burnout_risk', label: 'Burnout Risk', tone: 'text-amber-300 border-amber-500/40 bg-amber-500/10' },
    { key: 'academic_gap', label: 'Academic Gap', tone: 'text-blue-300 border-blue-500/40 bg-blue-500/10' },
    { key: 'critical', label: 'Critical', tone: 'text-red-300 border-red-500/40 bg-red-500/10' },
  ]

  return (
    <div className="page theme-dashboard">
      <div className="container py-12 px-4 sm:px-8">
        <div className="fade-up mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-bg2 p-8 rounded-3xl border-2 border-border shadow-xl">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center border-2 border-accent/20 shadow-inner">
                {/* User Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 group">
                  <h1 className="text-3xl font-black text-black dark:text-white tracking-tight">{user?.name || 'Educator Profile'}</h1>
                  {/* Shield Check Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500 fill-emerald-500/10 group-hover:scale-110 transition-transform"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
                </div>
                <div className="flex items-center gap-2 text-text3 font-medium">
                  {/* Mail Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  <span>{user?.email}</span>
                </div>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent text-white text-[10px] font-black uppercase tracking-wider shadow-sm mt-2">
                  Verified Educator
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0 md:pl-10">
              <div className="text-center md:text-left">
                <div className="text-4xl font-black text-black dark:text-white">{students.length}</div>
                <div className="text-xs font-black uppercase tracking-widest text-text3">Total Students</div>
              </div>
            </div>
          </div>
        </div>

        <div className="page-header mb-10">
          <h2 className="text-xl font-black text-black dark:text-white flex items-center gap-3">
            <span className="w-2 h-8 bg-accent rounded-full"></span>
            Real-time Behavior Predictions
          </h2>
          <p className="text-text2 mt-1 font-medium">Monitoring student neurological and psychological states using ML insights.</p>
        </div>



        <div className="fade-up-2 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <input className="input w-full" placeholder="Search students by name..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-2">
              {states.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setFilter(filter === s.key ? 'all' : s.key)}
                  className={`px-4 py-2 rounded-xl border-2 font-black text-[10px] uppercase tracking-wider transition-all shadow-sm ${filter === s.key ? s.tone : 'border-border bg-white dark:bg-bg3 text-text3 hover:border-border2'}`}
                >
                  {s.label} ({stateCounts[s.key]})
                </button>
              ))}
              {filter !== 'all' && (
                <button onClick={() => setFilter('all')} className="text-[10px] font-black uppercase text-accent hover:underline px-2">Clear</button>
              )}
            </div>
          </div>
        </div>

        <div className="fade-up-2 mb-10">
          <h2 className="text-xl font-black text-black dark:text-white mb-6 flex items-center gap-3">
            <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
            Class Distribution Insights
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {states.map((s) => {
              const count = stateCounts[s.key]
              const pct = students.length > 0 ? ((count / students.length) * 100).toFixed(0) : 0
              return (
                <div key={s.key} className={`p-6 rounded-3xl border-2 shadow-md flex flex-col items-center justify-center transition-transform hover:scale-[1.02] ${s.tone}`}>
                  <div className="text-4xl font-black mb-1">{pct}%</div>
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-80">{s.label}</div>
                  <div className="mt-4 w-full bg-black/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-current h-full" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : (
          <div className="card fade-up-2 overflow-hidden p-0 border-2 border-border shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[14px]">
                <thead>
                  <tr className="border-b-2 border-border bg-bg3">
                    {['Student Info', 'Age/Gender', 'Predicted Grade', 'Stress level', 'Predicted State', 'Focus Suggestions', 'Last Analysis'].map((h) => (
                      <th key={h} className="px-5 py-4 text-left text-[11px] font-black uppercase tracking-widest text-black/50 dark:text-white/50">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={7} className="px-4 py-20 text-center text-text3 font-bold text-lg">No students matching your search.</td></tr>
                  ) : filtered.map((s, i) => {
                    const p = s.latestPrediction
                    return (
                      <tr 
                        key={s._id} 
                        className={`group ${i % 2 === 0 ? 'bg-white dark:bg-bg2' : 'bg-bg dark:bg-bg'} hover:bg-accent/5 transition-colors cursor-pointer`}
                        onClick={() => setSelectedStudent(s)}
                      >
                        <td className="px-5 py-5">
                          <div className="font-black text-black dark:text-white text-base flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-xs font-black ring-1 ring-blue-500/20">{s.name?.[0]?.toUpperCase()}</div>
                            {s.name}
                          </div>
                          <div className="text-[12px] text-text3 font-medium">{s.email}</div>
                        </td>
                        <td className="px-5 py-5 font-bold text-text2">
                          <div className="flex items-center gap-2">
                             <span className="text-black dark:text-white">{s.age || 20} Yrs</span>
                             <span className="w-1.5 h-1.5 rounded-full bg-border"></span>
                             <span className="opacity-70">{s.gender === 0 ? 'Female' : 'Male'}</span>
                          </div>
                        </td>
                        <td className="px-5 py-5">{p ? <span className="px-3 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-black text-[11px] border border-blue-200">{gradeLabel(p.grade)}</span> : <span className="text-text3">-</span>}</td>
                        <td className="px-5 py-5">{p ? <span className="px-3 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-black text-[11px] border border-amber-200">{stressLabel(p.stress)}</span> : <span className="text-text3">-</span>}</td>
                        <td className="px-5 py-5">{p ? <span className="px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-black text-[11px] border border-emerald-200">{stateLabel(p.state)}</span> : <span className="text-text3">-</span>}</td>
                        <td className="px-5 py-5">
                          {p?.suggestions?.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {p.suggestions.slice(0, 2).map((sg, j) => <span key={j} className="rounded-md border border-border bg-bg2 px-2.5 py-1 text-[11px] font-bold text-text dark:text-white shadow-sm">{sg.subject}</span>)}
                              {p.suggestions.length > 2 && <span className="text-[11px] text-text3 font-bold">+{p.suggestions.length - 2} more</span>}
                            </div>
                          ) : <span className="text-text3">-</span>}
                        </td>
                        <td className="px-5 py-5 text-[11px] font-bold text-text3 uppercase tracking-tighter">{p ? new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="h-16" />
      </div>
    </div>
  )
}
