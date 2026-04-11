import { useState } from 'react'
import AdminCourseList from '../components/AdminCourseList'

export default function AdminDashboard() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  return (
    <div className="page theme-auth">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-16">
        <div className="card shadow-xl border-t-8 border-t-accent bg-bg2 rounded-3xl p-6 sm:p-10">
          <AdminCourseList 
            refreshTrigger={refreshTrigger} 
            onRefresh={() => setRefreshTrigger(p => p + 1)}
          />
        </div>
      </div>
    </div>
  )
}
