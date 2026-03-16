import { useState, useEffect } from 'react'
import { getCourses } from '../api/courses'
import CourseCard from '../components/CourseCard'

const FILTERS = ['All', 'GATE Prep', 'CS Core', 'Programming']
const STRESS_FILTERS = ['All Stress', 'High Stress', 'Medium Stress', 'Low Stress']

export default function Courses() {
  const [courses, setCourses]       = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [catFilter, setCatFilter]   = useState('All')
  const [stressFilter, setStressFilter] = useState('All Stress')
  const [search, setSearch]         = useState('')

  useEffect(() => {
    getCourses()
      .then(r => setCourses(r.data))
      .catch(() => setError('Failed to load courses.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = courses.filter(c => {
    const matchCat    = catFilter === 'All' || c.category === catFilter
    const matchStress = stressFilter === 'All Stress' ||
      c.stressTag === stressFilter.toLowerCase().replace(' ', '_')
    const matchSearch = !search ||
      c.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchStress && matchSearch
  })

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title fade-up">Course Library</h1>
          <p className="page-subtitle fade-up-2">
            {courses.length} subjects Â· watch videos Â· get AI-powered insights
          </p>
        </div>

        {/* Search + filters */}
        <div className="fade-up-2 mb-8">
          <input
            placeholder="Search subjects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input mb-4 max-w-[360px]"
          />

          <div className="flex flex-wrap gap-2">
            {FILTERS.map(f => (
              <button key={f}
                onClick={() => setCatFilter(f)}
                className={`btn rounded-full px-3.5 py-1.5 text-xs ${catFilter === f
                  ? 'border border-accent bg-accent text-bg'
                  : 'border border-border bg-bg2 text-text2'}`}>
                {f}
              </button>
            ))}

            <div className="mx-1 w-px bg-border" />

            {STRESS_FILTERS.map(f => (
              <button key={f}
                onClick={() => setStressFilter(f)}
                className={`btn rounded-full px-3.5 py-1.5 text-xs ${stressFilter === f
                  ? 'border border-accent bg-accent/15 text-accent'
                  : 'border border-border bg-bg2 text-text2'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading && (
          <div className="loading-center"><div className="spinner" /></div>
        )}
        {error && <div className="alert alert-error">{error}</div>}
        {!loading && !error && filtered.length === 0 && (
          <div className="py-16 text-center text-text2">
            No courses match your filters.
          </div>
        )}
        {!loading && !error && (
          <div className="grid-3 fade-up-3">
            {filtered.map(c => <CourseCard key={c._id} course={c} />)}
          </div>
        )}

        <div className="h-16" />
      </div>
    </div>
  )
}
