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
        {!loading && !error && filtered.length > 0 && (
          <div className="space-y-16 fade-up-3">
            {Array.from(new Set(filtered.map(c => c.category))).sort((a, b) => {
              const order = ['CS Core', 'GATE Prep', 'Programming'];
              const indexA = order.indexOf(a);
              const indexB = order.indexOf(b);
              if (indexA !== -1 && indexB !== -1) return indexA - indexB;
              if (indexA !== -1) return -1;
              if (indexB !== -1) return 1;
              return a.localeCompare(b);
            }).map(category => (
              <div key={category}>
                <h2 className="text-2xl font-bold font-heading mb-6 border-b border-border pb-2 inline-block text-text capitalize">{category}</h2>
                <div className="grid-3">
                  {filtered.filter(c => c.category === category).map((c) => (
                    <CourseCard key={c._id} course={c} index={filtered.findIndex(tc => tc._id === c._id)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="h-16" />
      </div>
    </div>
  )
}
