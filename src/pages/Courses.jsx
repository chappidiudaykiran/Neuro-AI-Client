import { useState, useEffect } from 'react'
import { getCourses } from '../api/courses'
import CourseCard from '../components/CourseCard'

export default function Courses() {
  const [courses, setCourses]       = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [search, setSearch]         = useState('')

  useEffect(() => {
    getCourses()
      .then(r => setCourses(r.data))
      .catch(() => setError('Failed to load courses.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = courses.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="page theme-courses">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title fade-up">Course Library</h1>
          <p className="page-subtitle fade-up-2">
            {courses.length} subjects
          </p>
        </div>

        {/* Search */}
        <div className="fade-up-2 mb-8">
          <input
            placeholder="Search subjects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input mb-4 max-w-[360px]"
          />
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
            {filtered.map((c, i) => <CourseCard key={c._id} course={c} index={i} />)}
          </div>
        )}

        <div className="h-16" />
      </div>
    </div>
  )
}
