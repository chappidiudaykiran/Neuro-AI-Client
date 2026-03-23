import { useState } from 'react'
import AdminCourseList from '../components/AdminCourseList'

export default function AdminDashboard() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  return (
    <div className="page theme-auth border-t border-border bg-bg">
      <div className="w-full px-4 sm:px-10 pt-10 pb-12">
        <div className="fade-up w-full mx-auto">
          <AdminCourseList 
            refreshTrigger={refreshTrigger} 
            onRefresh={() => setRefreshTrigger(p => p + 1)}
          />
        </div>
      </div>
    </div>
  )
}
