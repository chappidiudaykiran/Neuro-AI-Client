import { useState, useEffect } from 'react'
import { getStudents } from '../api/predict'
import { gradeLabel, stressLabel, stateLabel } from '../utils/helpers'

export default function Educator() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
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
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title fade-up">Educator Dashboard</h1>
          <p className="page-subtitle fade-up-2">{students.length} students - real-time AI predictions</p>
        </div>

        <div className="grid-4 fade-up mb-8">
          {states.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setFilter(filter === s.key ? 'all' : s.key)}
              className={`rounded-2xl border p-5 text-center transition ${filter === s.key ? s.tone : 'border-border bg-bg2 text-text2 hover:border-border2'}`}
            >
              <div className="font-heading text-3xl font-extrabold">{stateCounts[s.key]}</div>
              <div className="mt-1 text-xs">{s.label}</div>
            </button>
          ))}
        </div>

        <div className="fade-up-2 mb-5">
          <input className="input max-w-[320px]" placeholder="Search students by name..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : (
          <div className="card fade-up-2 overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[13px]">
                <thead>
                  <tr className="border-b border-border bg-bg3">
                    {['Student', 'Grade', 'Stress', 'State', 'Suggestions', 'Last Updated'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-text3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-10 text-center text-text3">No students found.</td></tr>
                  ) : filtered.map((s, i) => {
                    const p = s.latestPrediction
                    return (
                      <tr key={s._id} className={`border-b border-border ${i % 2 ? 'bg-white/[0.01]' : ''} hover:bg-bg3`}>
                        <td className="px-4 py-3">
                          <div className="font-medium">{s.name}</div>
                          <div className="text-[11px] text-text3">{s.email}</div>
                        </td>
                        <td className="px-4 py-3">{p ? <span className="badge badge-info">{gradeLabel(p.grade)}</span> : <span className="text-text3">-</span>}</td>
                        <td className="px-4 py-3">{p ? <span className="badge badge-medium">{stressLabel(p.stress)}</span> : <span className="text-text3">-</span>}</td>
                        <td className="px-4 py-3">{p ? <span className="badge badge-high">{stateLabel(p.state)}</span> : <span className="text-text3">-</span>}</td>
                        <td className="px-4 py-3">
                          {p?.suggestions?.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {p.suggestions.slice(0, 2).map((sg, j) => <span key={j} className="rounded-full border border-border bg-bg3 px-2 py-0.5 text-[11px] text-text2">{sg.subject}</span>)}
                              {p.suggestions.length > 2 && <span className="text-[11px] text-text3">+{p.suggestions.length - 2} more</span>}
                            </div>
                          ) : <span className="text-text3">-</span>}
                        </td>
                        <td className="px-4 py-3 text-xs text-text3">{p ? new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '-'}</td>
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
