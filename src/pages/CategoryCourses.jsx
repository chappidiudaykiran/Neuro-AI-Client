import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCoursesByCategory } from '../api/courses'
import CourseCard from '../components/CourseCard'

export default function CategoryCourses() {
  const { categorySlug } = useParams()
  
  const slugToCat = {
    'cs-core': 'CS Core',
    'gate-prep': 'GATE Prep',
    'programming': 'Programming',
  }
  const decodedCategory = slugToCat[categorySlug] || categorySlug?.replace(/-/g, ' ')

  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    getCoursesByCategory(categorySlug)
      .then(res => {
        setCourses(res.data)
      })
      .catch(err => setError(err.response?.data?.message || 'Failed to fetch subjects'))
      .finally(() => setLoading(false))
  }, [categorySlug])

  return (
    <div className="page theme-auth pb-20 border-t border-border bg-bg min-h-screen">
      <div className="container pt-10 pb-6 relative">
        
        {/* Isolated Back Button (Native Position) */}
        <div className="mb-0 relative z-20">
          <Link to="/courses" className="text-text3 hover:text-accent flex items-center gap-2 font-medium w-fit transition-colors bg-bg2 px-4 py-2 rounded-full border border-border shadow-sm text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Return
          </Link>
        </div>

        {/* Header Section (Pulled aggressively up towards Navbar) */}
        <div className="page-header text-center mb-8 max-w-3xl mx-auto w-full relative z-10 -mt-16 sm:-mt-24">
          <h1 className="page-title fade-up text-3xl sm:text-5xl font-extrabold font-heading text-text tracking-tight mb-2 capitalize drop-shadow-sm">
            {decodedCategory} <span className="bg-gradient-to-r from-accent to-blue-500 bg-clip-text text-transparent">Subjects</span>
          </h1>
          <p className="page-subtitle fade-up-2 text-text2 text-[16px] max-w-xl mx-auto">
            Choose a specific subject below to begin interactive video learning.
          </p>
        </div>   
        {loading ? (
          <div className="text-center py-20 fade-up">
            <div className="spinner mb-4" />
            <p className="text-text3 font-medium">Loading modules...</p>
          </div>
        ) : error ? (
          <div className="alert alert-error text-center p-6 mx-auto max-w-lg shadow-sm">
            <div className="font-bold mb-1">Error</div>
            {error}
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {courses.length > 0 ? (
              <div className="grid-3 fade-up-3">
                {courses.map((c, i) => (
                  <CourseCard key={c._id} course={c} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-bg2 rounded-2xl border border-border shadow-inner fade-up">
                <p className="text-text3 font-bold text-lg mb-2">No subjects found in this category.</p>
                <p className="text-text2">Check back later or populate the database.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
