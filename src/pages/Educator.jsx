import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStudents } from '../api/predict'
import { gradeLabel, stressLabel, stateLabel } from '../utils/helpers'
import { useAuth } from '../context/AuthContext'

function StudentDetailModal({ student, onClose }) {
  const navigate = useNavigate();
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
            <div className="w-16 h-16 rounded-full bg-blue-500 overflow-hidden flex items-center justify-center text-white text-2xl font-black shadow-lg">
              {student.photo ? (
                <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
              ) : (
                student.name?.[0]?.toUpperCase()
              )}
            </div>
            <div>
              <div className="text-xl font-black text-black dark:text-white">{student.name}</div>
              <div className="text-sm text-text2 font-medium">{student.email}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4">
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

        <div className="flex gap-4 mt-8">
          <button 
            onClick={() => {
              navigate(`/educator/support?targetUid=${student._id}`);
              onClose();
            }} 
            className="btn btn-primary flex-1 shadow-lg font-black uppercase tracking-widest py-3 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
            Chat with Student
          </button>
          <button onClick={onClose} className="btn bg-bg2 hover:bg-bg3 border border-border flex-1 shadow-md font-black uppercase tracking-widest py-3 text-text3">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default function EducatorDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
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
    monitor: students.filter((s) => s.latestPrediction?.state === 'monitor').length,
    burnout_risk: students.filter((s) => s.latestPrediction?.state === 'burnout_risk').length,
    underperforming: students.filter((s) => s.latestPrediction?.state === 'underperforming').length,
    at_risk: students.filter((s) => s.latestPrediction?.state === 'at_risk').length,
    critical: students.filter((s) => s.latestPrediction?.state === 'critical').length,
  }

  const states = [
    { key: 'optimal', label: 'Optimal', tone: 'text-green-300 border-green-500/40 bg-green-500/10' },
    { key: 'monitor', label: 'Monitor', tone: 'text-blue-300 border-blue-500/40 bg-blue-500/10' },
    { key: 'burnout_risk', label: 'Burnout Risk', tone: 'text-amber-300 border-amber-500/40 bg-amber-500/10' },
    { key: 'underperforming', label: 'Underperforming', tone: 'text-violet-300 border-violet-500/40 bg-violet-500/10' },
    { key: 'at_risk', label: 'At Risk', tone: 'text-orange-300 border-orange-500/40 bg-orange-500/10' },
    { key: 'critical', label: 'Critical', tone: 'text-red-300 border-red-500/40 bg-red-500/10' },
  ]

  return (
    <div className="page theme-dashboard">
      <div className="container max-w-[1600px] py-6 md:py-12 px-3 sm:px-8">
        <div className="fade-up mb-6 md:mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 bg-white dark:bg-bg2 p-4 md:p-8 rounded-2xl md:rounded-3xl border-2 border-border shadow-xl">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl bg-accent/10 overflow-hidden flex items-center justify-center border-2 border-accent/20 shadow-inner shrink-0">
                {user?.photo ? (
                  <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent md:w-10 md:h-10"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 group">
                  <h1 className="text-xl md:text-3xl font-black text-black dark:text-white tracking-tight">{user?.name || 'Educator Profile'}</h1>
                  {/* Shield Check Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500 fill-emerald-500/10 group-hover:scale-110 transition-transform"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
                </div>
                <div className="flex items-center gap-2 text-text3 font-medium text-xs md:text-sm">
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
                <div className="text-3xl md:text-4xl font-black text-black dark:text-white">{students.length}</div>
                <div className="text-xs font-black uppercase tracking-widest text-text3">Total Students</div>
              </div>
            </div>
          </div>
        </div>






        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : (
          <div className="card fade-up-2 overflow-hidden p-0 border-2 border-border shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[12px] md:text-[14px]">
                <thead>
                  <tr className="border-b-2 border-border bg-bg3">
                    {['Student Info', 'Age/Gender', 'Stress level', 'Predicted State', 'Focus Suggestions', 'Last Analysis'].map((h) => (
                      <th key={h} className="px-5 py-4 text-left text-[11px] font-black uppercase tracking-widest text-black/50 dark:text-white/50">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-20 text-center text-text3 font-bold text-lg">No students matching your search.</td></tr>
                  ) : filtered.map((s, i) => {
                    const p = s.latestPrediction
                    return (
                      <tr 
                        key={s._id} 
                        className={`group ${i % 2 === 0 ? 'bg-white dark:bg-bg2' : 'bg-bg dark:bg-bg'} hover:bg-accent/5 transition-colors cursor-pointer`}
                        onClick={() => navigate(`/educator/support?targetUid=${s._id}`)}
                      >
                        <td className="px-5 py-5">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 overflow-hidden flex items-center justify-center text-xs font-black ring-1 ring-blue-500/20 cursor-pointer hover:ring-accent transition-all"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedStudent(s);
                              }}
                            >
                              {s.photo ? (
                                <img src={s.photo} alt={s.name} className="w-full h-full object-cover" />
                              ) : (
                                s.name?.[0]?.toUpperCase()
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-black text-black dark:text-white text-base hover:text-accent transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedStudent(s);
                                }}
                              >
                                {s.name}
                              </span>
                              <span className="text-[12px] text-text3 font-medium">{s.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-5 font-bold text-text2">
                          <div className="flex items-center gap-2">
                             <span className="text-black dark:text-white">{s.age || 20} Yrs</span>
                             <span className="w-1.5 h-1.5 rounded-full bg-border"></span>
                             <span className="opacity-70">{s.gender === 0 ? 'Female' : 'Male'}</span>
                          </div>
                        </td>
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
      {selectedStudent && (
        <StudentDetailModal 
          student={selectedStudent} 
          onClose={() => setSelectedStudent(null)} 
        />
      )}
    </div>
  )
}
