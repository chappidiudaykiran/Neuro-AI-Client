import { useState } from 'react'
import { Link } from 'react-router-dom'
import AdminCourseList from '../components/AdminCourseList'

export default function AdminDashboard() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  return (
    <div className="page theme-auth border-t border-border bg-bg">
      <div className="container py-12">
        <div className="page-header text-center mb-10 flex flex-col items-center">
          <h1 className="page-title fade-up text-3xl font-extrabold font-heading text-text">Content Management</h1>
          <p className="page-subtitle fade-up-2 text-text2 mt-2">Add, edit, or remove curated YouTube video links for subjects</p>
          <Link to="/admin/add" className="btn btn-primary mt-6 fade-up-3 px-8 py-3 text-sm font-bold uppercase tracking-wider shadow-md">
            + Add New Subject
          </Link>
        </div>
        <div className="fade-up max-w-4xl mx-auto">
          <AdminCourseList 
            refreshTrigger={refreshTrigger} 
            onRefresh={() => setRefreshTrigger(p => p + 1)}
          />
        </div>
      </div>
    </div>
  )
}
