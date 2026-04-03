import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCourseById } from '../api/courses'
import { getMySubmissions } from '../api/assignments'
import AssignmentView from '../components/AssignmentView'

export default function AssignmentPage() {
  const { id, moduleNumber } = useParams()
  const [course, setCourse] = useState(null)
  const [mySubmissions, setMySubmissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getCourseById(id),
      getMySubmissions(id).catch(() => ({ data: [] }))
    ])
    .then(([courseRes, subRes]) => {
      setCourse(courseRes.data)
      setMySubmissions(subRes.data)
    })
    .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="page theme-video"><div className="loading-center"><div className="spinner" /></div></div>

  if (!course) {
    return (
      <div className="page theme-video">
        <div className="container mt-10">
          <div className="alert alert-error">Subject not found.</div>
          <Link to="/courses" className="btn btn-outline mt-3">Back to courses</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page min-h-screen bg-bg">
      <div className="container py-10 max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link to={`/courses/${id}`} className="btn btn-outline btn-sm sm:btn-md shrink-0 border-border/50 hover:bg-bg3 text-text3 hover:text-text transition-colors shadow-sm">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to Course Playlist
            </Link>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-heading font-bold text-text2 truncate max-w-sm">{course.name}</h1>
          </div>
        </div>
        
        <div className="rounded-2xl shadow-xl shadow-bg3/20 ring-1 ring-border/50">
          <AssignmentView 
            subjectId={id} 
            moduleNumber={Number(moduleNumber)} 
            videos={course?.videos || []} 
            existingSubmission={mySubmissions.find(s => s.moduleNumber === Number(moduleNumber) && (s.subjectId === id || s.subjectId?._id === id))}
            onComplete={() => { getMySubmissions(id).then(r => setMySubmissions(r.data)) }}
          />
        </div>
      </div>
    </div>
  )
}
