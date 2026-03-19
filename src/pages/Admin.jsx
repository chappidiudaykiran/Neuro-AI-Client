import { useState } from 'react'
import AdminSubjectForm from '../components/AdminSubjectForm'
import AdminCourseList from '../components/AdminCourseList'

export default function AdminDashboard() {
  const [editingCourse, setEditingCourse] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleSuccess = () => {
    setRefreshTrigger(prev => prev + 1)
    setEditingCourse(null)
  }

  const handleEdit = (course) => {
    setEditingCourse(course)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="page theme-auth border-t border-border bg-bg">
      <div className="container py-12">
        <div className="page-header text-center mb-10">
          <h1 className="page-title fade-up text-3xl font-extrabold font-heading text-text">Content Management</h1>
          <p className="page-subtitle fade-up-2 text-text2 mt-2">Add, edit, or remove curated YouTube video links for subjects</p>
        </div>
        <div className="fade-up max-w-4xl mx-auto">
          <AdminSubjectForm 
            initialData={editingCourse} 
            onCancelEdit={() => setEditingCourse(null)} 
            onSuccess={handleSuccess} 
          />
          <AdminCourseList 
            onEdit={handleEdit} 
            refreshTrigger={refreshTrigger} 
          />
        </div>
      </div>
    </div>
  )
}
