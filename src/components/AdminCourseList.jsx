import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCourses, deleteSubject } from '../api/courses'

export default function AdminCourseList({ refreshTrigger, onRefresh }) {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  const getCategoryStyles = (cat) => {
    switch(cat) {
      case 'CS Core': 
        return { 
          card: 'border-emerald-300 dark:border-emerald-800 ring-4 ring-emerald-100/20', 
          header: 'bg-emerald-200/80 dark:bg-emerald-900/80 text-black dark:text-white border-emerald-300',
          badge: 'bg-emerald-600 text-white',
          row: 'bg-emerald-100/70 dark:bg-emerald-900/40 border-emerald-200',
          accent: 'border-emerald-600'
        };
      case 'GATE Prep': 
        return { 
          card: 'border-violet-300 dark:border-violet-800 ring-4 ring-violet-100/20', 
          header: 'bg-violet-200/80 dark:bg-violet-900/80 text-black dark:text-white border-violet-300',
          badge: 'bg-violet-600 text-white',
          row: 'bg-violet-100/70 dark:bg-violet-900/40 border-violet-200',
          accent: 'border-violet-600'
        };
      case 'Programming': 
        return { 
          card: 'border-sky-300 dark:border-sky-800 ring-4 ring-sky-100/20', 
          header: 'bg-sky-200/80 dark:bg-sky-900/80 text-black dark:text-white border-sky-300',
          badge: 'bg-sky-600 text-white',
          row: 'bg-sky-100/70 dark:bg-sky-900/40 border-sky-200',
          accent: 'border-sky-600'
        };
      default: 
        return { 
          card: 'border-border', 
          header: 'bg-bg2 text-text', 
          badge: 'badge-info',
          row: 'bg-bg2',
          accent: 'border-accent'
        };
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
    <div className="card shadow-md border-t-8 border-t-accent">
      <div className="mb-6 border-b-2 border-border pb-4 flex justify-between items-center">
        <h2 className="text-2xl font-black text-black dark:text-white">Manage Existing Subjects</h2>
        <span className="bg-black dark:bg-white text-white dark:text-black px-5 py-1.5 rounded-full text-sm font-black shadow-lg">{courses.length} Total</span>
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
              <div key={category} className={`border-2 rounded-2xl bg-bg dark:bg-bg2 shadow-lg overflow-hidden mb-12 transition-shadow hover:shadow-xl ${styles.card}`}>
                <div className={`px-6 py-5 border-b-2 font-heading font-black uppercase tracking-widest flex justify-between items-center text-base sm:text-lg text-black dark:text-white ${styles.header}`}>
                  <div className="flex items-center gap-3 drop-shadow-sm">
                    <span className="w-3 h-3 rounded-full bg-black dark:bg-white shadow-sm"></span>
                    {category} Subjects
                  </div>
                  <span className={`px-5 py-2 rounded-full text-xs font-black shadow-md ${styles.badge}`}>{catCourses.length} Registered</span>
                </div>
                <div className="overflow-x-auto p-1 sm:p-2">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <tbody className="divide-y divide-black/10 dark:divide-white/10">
                      {catCourses.map(c => (
                        <tr key={c._id} className={`${styles.row} group border-b border-black/5 dark:border-white/5`}>
                          <td className={`px-4 py-4 font-black text-black dark:text-white group-hover:text-accent transition-colors text-lg border-l-6 ${styles.accent}`}>{c.name}</td>
                          <td className="px-4 py-4 text-center">
                            <span className="text-[13px] font-black bg-white dark:bg-bg3 text-black dark:text-white rounded-lg py-1.5 px-3 border-2 border-black/10 dark:border-white/10 shadow-sm">{c.videos?.length || 0} Lessons</span>
                          </td>
                          <td className="px-4 py-4 text-right space-x-3">
                            <button onClick={() => navigate(`/admin/edit/${c._id}`)} className="btn bg-white dark:bg-blue-600 text-blue-800 dark:text-white hover:bg-black hover:text-white border-2 border-blue-300 dark:border-blue-500/30 px-6 py-2 text-[12px] shadow-md transition-all uppercase font-black tracking-widest rounded-xl">Edit</button>
                            <button onClick={() => handleDelete(c._id, c.name)} className="btn bg-white dark:bg-red-600 text-red-700 dark:text-white hover:bg-black hover:text-white border-2 border-red-300 dark:border-red-500/30 px-6 py-2 text-[12px] shadow-md transition-all uppercase font-black tracking-widest rounded-xl">Drop</button>
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
