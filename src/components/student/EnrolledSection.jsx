import { useState, useEffect } from 'react'
import { getMySubjects } from '../../api/courses'
import { useAuth } from '../../context/AuthContext'
import CourseCard from '../CourseCard'

export default function EnrolledSection() {
  const { updateUser } = useAuth()
  const [enrolledSubjects, setEnrolledSubjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMySubjects()
      .then((res) => {
        setEnrolledSubjects(res.data || [])
        // Sync enrolled IDs into auth context
        const ids = (res.data || []).map(s => s._id)
        updateUser({ selectedSubjects: ids })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="w-full flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin"/></div>
  }

  if (enrolledSubjects.length === 0) return null // Hide section if no enrolled subjects

  return (
    <div className="fade-up">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="font-heading text-2xl font-extrabold tracking-tight text-text">Continue Learning</h2>
        <span className="inline-flex items-center justify-center bg-accent/10 border border-accent/20 text-accent text-xs font-bold px-2.5 py-0.5 rounded-full">
          {enrolledSubjects.length} enrolled
        </span>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrolledSubjects.map((sub, i) => (
           <div key={sub._id} className="fade-up hover:-translate-y-1 transition-transform duration-300" style={{ animationDelay: `${i * 100}ms` }}>
             <CourseCard course={sub} index={i} isEnrolled={true} />
           </div>
        ))}
      </div>
    </div>
  )
}
