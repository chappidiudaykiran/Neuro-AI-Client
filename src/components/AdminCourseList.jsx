import { useState, useEffect } from 'react'
import { getCourses, deleteSubject } from '../api/courses'

export default function AdminCourseList({ onEdit, refreshTrigger }) {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  const getCategoryStyles = (cat) => {
    switch(cat) {
      case 'CS Core': 
        return { 
          card: 'border-emerald-200 dark:border-emerald-900/50 ring-4 ring-emerald-50 dark:ring-emerald-900/10', 
          header: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50',
          badge: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-700/50' 
        };
      case 'GATE Prep': 
        return { 
          card: 'border-indigo-200 dark:border-indigo-900/50 ring-4 ring-indigo-50 dark:ring-indigo-900/10', 
          header: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-950 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900/50',
          badge: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-700/50' 
        };
      case 'Programming': 
        return { 
          card: 'border-amber-200 dark:border-amber-900/50 ring-4 ring-amber-50 dark:ring-amber-900/10', 
          header: 'bg-amber-50 dark:bg-amber-500/10 text-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-900/50',
          badge: 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-700/50' 
        };
      default: 
        return { card: 'border-border dark:border-border', header: 'bg-bg2 border-border text-text', badge: 'badge-info' };
    }
  }

  const fetchCourses = () => {
    setLoading(true)
    getCourses()
      .then(res => setCourses(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchCourses()
  }, [refreshTrigger])

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) return
    try {
      await deleteSubject(id)
      fetchCourses()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete subject')
    }
  }

  if (loading) return <div className="text-center py-10 opacity-50">Loading existing courses...</div>

  return (
    <div className="card shadow-sm mt-8 border-t-4 border-t-accent/50">
      <div className="mb-4 border-b border-border pb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-text">Manage Existing Subjects</h2>
        <span className="badge badge-medium font-bold">{courses.length} Total</span>
      </div>

      {courses.length === 0 ? (
        <p className="text-center text-text3 py-6">No courses published yet. Let's make one!</p>
      ) : (
        <div className="space-y-8">
          {['CS Core', 'GATE Prep', 'Programming'].map(category => {
            const catCourses = courses.filter(c => c.category === category);
            if (catCourses.length === 0) return null;
            
            const styles = getCategoryStyles(category);
            
            return (
              <div key={category} className={`border rounded-2xl bg-bg shadow-sm overflow-hidden mb-12 transition-shadow hover:shadow-md ${styles.card}`}>
                <div className={`px-6 py-4 border-b font-heading font-black uppercase tracking-widest flex justify-between items-center text-sm sm:text-base ${styles.header}`}>
                  <div className="flex items-center gap-3 drop-shadow-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-current opacity-70 shadow-sm"></span>
                    {category} Subjects
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-[11px] font-extrabold shadow-sm ${styles.badge}`}>{catCourses.length} Registered</span>
                </div>
                <div className="overflow-x-auto p-2 sm:p-4">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="text-text3 uppercase font-extrabold text-[10px] tracking-wider border-b border-border/60">
                      <tr>
                        <th className="px-5 py-4 w-1/2">Subject Pipeline</th>
                        <th className="px-5 py-4">Playlist Size</th>
                        <th className="px-5 py-4 text-right">Database Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40 text-text2 bg-bg2">
                      {catCourses.map(c => (
                        <tr key={c._id} className="hover:bg-bg3/50 transition-colors group">
                          <td className="px-5 py-5 font-bold text-text group-hover:text-accent transition-colors text-[15px]">{c.name}</td>
                          <td className="px-5 py-5">
                            <span className="text-xs font-bold bg-bg3 text-text2 rounded-lg py-1.5 px-3 border border-border shadow-sm">{c.videos?.length || 0} Lessons</span>
                          </td>
                          <td className="px-5 py-5 text-right space-x-3">
                            <button onClick={() => onEdit(c)} className="btn bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white border border-blue-200 dark:border-blue-500/30 px-5 py-2 text-[11px] shadow-sm transition-all uppercase font-bold tracking-widest rounded-lg">Edit</button>
                            <button onClick={() => handleDelete(c._id, c.name)} className="btn bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-600 dark:hover:bg-red-600 hover:text-white border border-red-200 dark:border-red-500/30 px-5 py-2 text-[11px] shadow-sm transition-all uppercase font-bold tracking-widest rounded-lg">Drop</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
