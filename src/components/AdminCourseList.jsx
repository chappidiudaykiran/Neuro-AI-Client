import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCourses, deleteSubject } from '../api/courses'

export default function AdminCourseList({ refreshTrigger, onRefresh }) {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedCategory, setExpandedCategory] = useState(null)

  const categoryMeta = {
    'CS Core': {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
      ),
      gradient: 'from-emerald-500 to-teal-600',
      light: 'bg-emerald-50 dark:bg-emerald-950/30',
      badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
      border: 'border-emerald-200 dark:border-emerald-800/40',
      dot: 'bg-emerald-500',
    },
    'GATE Prep': {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
      ),
      gradient: 'from-violet-500 to-purple-600',
      light: 'bg-violet-50 dark:bg-violet-950/30',
      badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300',
      border: 'border-violet-200 dark:border-violet-800/40',
      dot: 'bg-violet-500',
    },
    'Programming': {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
      ),
      gradient: 'from-sky-500 to-blue-600',
      light: 'bg-sky-50 dark:bg-sky-950/30',
      badge: 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300',
      border: 'border-sky-200 dark:border-sky-800/40',
      dot: 'bg-sky-500',
    },
  }

  const fetchCourses = () => {
    setLoading(true)
    getCourses()
      .then(res => setCourses(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchCourses()
  }, [refreshTrigger])

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) return
    try {
      await deleteSubject(id)
      fetchCourses()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete subject')
    }
  }

  if (loading) return <div className="text-center py-10 opacity-50">Loading existing courses...</div>

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-text">Manage Subjects</h1>
          <p className="text-sm text-text3 mt-1">Organize, edit and manage your course catalog.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-text3 bg-bg3 border border-border rounded-full px-3.5 py-1.5">
            {courses.length} total subjects
          </span>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-bg2 p-16 text-center">
          <p className="text-text3 font-medium">No courses published yet. Create your first subject!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {['CS Core', 'GATE Prep', 'Programming'].map(category => {
            const catCourses = courses.filter(c => c.category === category)
            if (catCourses.length === 0) return null

            const meta = categoryMeta[category] || categoryMeta['CS Core']
            const isOpen = expandedCategory === category

            return (
              <div key={category} className={`rounded-2xl border bg-bg2 overflow-hidden transition-all duration-300 ${isOpen ? meta.border + ' shadow-md' : 'border-border hover:border-border2'}`}>
                {/* Category Header */}
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-5 py-4 transition-colors hover:bg-bg3/50"
                  onClick={() => setExpandedCategory(prev => prev === category ? null : category)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${meta.gradient} text-white shadow-sm`}>
                      {meta.icon}
                    </div>
                    <div className="text-left">
                      <h3 className="text-[15px] font-bold text-text">{category}</h3>
                      <p className="text-xs text-text3">{catCourses.length} subject{catCourses.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`hidden sm:inline-block text-[11px] font-semibold rounded-full px-3 py-1 ${meta.badge}`}>
                      {catCourses.length} registered
                    </span>
                    <svg className={`w-4 h-4 text-text3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Expanded Subject List */}
                {isOpen && (
                  <div className={`border-t ${meta.border}`}>
                    {catCourses.map((c, idx) => (
                      <div
                        key={c._id}
                        className={`flex items-center justify-between px-5 py-3.5 gap-4 transition-colors hover:bg-bg3/40 ${idx !== catCourses.length - 1 ? 'border-b border-border/50' : ''}`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${meta.dot}`} />
                          <span className="text-sm font-semibold text-text truncate">{c.name}</span>
                          <span className="hidden sm:inline-block text-[11px] font-medium text-text3 bg-bg3 border border-border rounded-md px-2 py-0.5 shrink-0">
                            {c.videos?.length || 0} lessons
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => navigate(`/educator/subjects/edit/${c._id}`)}
                            className="text-xs font-semibold text-accent hover:text-accent/80 bg-accent/5 hover:bg-accent/10 border border-accent/20 px-3.5 py-1.5 rounded-lg transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(c._id, c.name)}
                            className="text-xs font-semibold text-red-500 hover:text-red-600 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 px-3.5 py-1.5 rounded-lg transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="p-3 bg-bg3/30 border-t border-border/50">
                      <button
                        onClick={() => navigate('/educator/subjects/add')}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-border hover:border-accent focus:outline-none hover:bg-accent/5 text-text3 hover:text-accent text-sm font-semibold transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                        Add New {category} Subject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
