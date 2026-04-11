import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCourseById } from '../api/courses'
import { getMySubmissions } from '../api/assignments'
import { ArrowLeft } from 'lucide-react'
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
            <Link 
              to={`/courses/${id}`} 
              className="group inline-flex items-center gap-2.5 rounded-xl border border-border/40 bg-bg2/40 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-text2 backdrop-blur-md transition-all duration-300 hover:border-accent/40 hover:bg-bg2/60 hover:text-accent shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              Return
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
