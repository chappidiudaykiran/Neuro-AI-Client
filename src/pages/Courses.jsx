import { useState, useEffect } from 'react'
import { getCategoriesSummary, getMySubjects } from '../api/courses'
import CategoryCard from '../components/CategoryCard'
import CourseCard from '../components/CourseCard'

export default function Courses() {
  const [categories, setCategories] = useState([])
  const [enrolledSubjects, setEnrolledSubjects] = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')

  useEffect(() => {
    Promise.all([
      getCategoriesSummary(),
      getMySubjects().catch(() => ({ data: [] }))
    ])
      .then(([r, enrolledRes]) => {
          const sorted = r.data.sort((a, b) => {
            const order = ['GATE Prep', 'Programming', 'CS Core'];
            const indexA = order.indexOf(a.category);
            const indexB = order.indexOf(b.category);
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            return indexA !== -1 ? -1 : indexB !== -1 ? 1 : a.category.localeCompare(b.category);
          });
          setCategories(sorted);
          setEnrolledSubjects(enrolledRes.data || []);
      })
      .catch((err) => {
         console.error(err);
         setError(`Dev Error: ${err.message || 'Network failed'}`);
      })
      .finally(() => setLoading(false))
  }, [])

  const getDecorativePath = (cat) => {
    if (cat === 'CS Core') return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    if (cat === 'GATE Prep') return (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 14v7" />
      </>
    )
    if (cat === 'Programming') return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  }

  const getSlug = (cat) => {
     if (cat === 'CS Core') return 'cs-core'
     if (cat === 'GATE Prep') return 'gate-prep'
     if (cat === 'Programming') return 'programming'
     return cat.toLowerCase().replace(/\s+/g, '-')
  }

  return (
    <div className="page theme-courses">
      <div className="container">
        <div className="page-header text-center mb-0 -mt-1 sm:-mt-3">
          <h1 className="page-title fade-up mb-0 text-4xl sm:text-5xl font-extrabold tracking-tight">Course Library</h1>
        </div>

        {/* My Enrolled Subjects */}
        {!loading && enrolledSubjects.length > 0 && (
          <div className="fade-up-1 mt-6 mb-10 max-w-6xl mx-auto">
            <h2 className="mb-4 font-heading text-lg font-bold">My Enrolled Subjects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledSubjects.map((c, i) => (
                <CourseCard key={c._id} course={c} index={i} />
              ))}
            </div>
          </div>
        )}

        {!loading && enrolledSubjects.length > 0 && (
          <hr className="border-border max-w-6xl mx-auto mb-8" />
        )}

        {/* Content */}
        <h2 className="mb-5 font-heading text-lg font-bold max-w-6xl mx-auto">Explore Categories</h2>
        {loading && (
          <div className="loading-center"><div className="spinner" /></div>
        )}
        {error && <div className="alert alert-error text-center mx-auto max-w-md">{error}</div>}
        
        {!loading && !error && categories.length === 0 && (
          <div className="py-20 bg-bg2 rounded-2xl border border-border text-center text-text2 shadow-inner fade-up">
            No categories available at the moment.
          </div>
        )}

        {!loading && !error && categories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 fade-up-3 mb-20 max-w-6xl mx-auto">
            {categories.map(({ category, count }) => (
               <CategoryCard key={category} category={category} count={count} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
