import { useState, useEffect } from 'react'
import { getResults, getPreview } from '../api/predict'
import { getMyFeedback } from '../api/feedback'
import { getMySubjects } from '../api/courses'
import { useAuth } from '../context/AuthContext'
import PredictionBadge from '../components/PredictionBadge'
import SuggestionCard from '../components/SuggestionCard'
import { Link } from 'react-router-dom'
import { Settings, Target, Sparkles, CalendarDays, Rocket } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()

  const [latest, setLatest] = useState(null)
  const [history, setHistory] = useState([])
  const [enrolledSubjects, setEnrolledSubjects] = useState([])
  const [mlPayload, setMlPayload] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res1, res2, res3, res4] = await Promise.all([
          getResults().catch((e) => { console.error('getResults err:', e); return { data: [] } }),
          getMyFeedback().catch((e) => { console.error('getFeedback err:', e); return { data: [] } }),
          getMySubjects().catch((e) => { console.error('getSubjects err:', e); return { data: [] } }),
          getPreview().catch((e) => { console.error('getPreview err:', e); return { data: null } })
        ])

        const data = res1.data || []
        console.log('Latest Prediction Data:', data)
        if (data.length > 0) setLatest(data[0])
        setHistory(data.slice(1))
        setEnrolledSubjects(res3.data || [])
        setMlPayload(res4.data || null)
      } catch (err) {
        console.error('Dashboard sync error:', err)
        setError('Failed to sync dashboard data.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 15000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <div className="page page-auth"><div className="loading-center"><div className="spinner" /></div></div>
  }

  return (
    <div className="page theme-dashboard">
      <div className="container pb-16">
        <div className="page-header border-none !pb-2 mt-4">
          <h1 className="font-heading text-5xl font-extrabold tracking-tight hero-gradient-text fade-up pb-2">
            Hey, {user?.name?.split(' ')[0]}
          </h1>
          <p className="mt-3 text-lg text-text2 fade-up-2 text-balance max-w-2xl leading-relaxed">
            Welcome to your AI-powered learning workspace. Here are your personalized academic insights based on your recent activity.
          </p>
        </div>

        {error && <div className="alert alert-error my-4">{error}</div>}

        {mlPayload && (
          <div className="fade-up-2 mb-8">
            <details className="group glass-panel rounded-xl cursor-pointer">
              <summary className="p-4 font-heading text-sm font-semibold flex items-center gap-2 select-none text-text2 hover:text-text transition-colors">
                <Settings size={16} /> View Raw ML matrix input
              </summary>
              <div className="p-4 pt-0 border-t border-black/10 dark:border-white/5 text-xs font-mono text-green-600 dark:text-green-400 bg-black/5 dark:bg-black/20 overflow-x-auto">
                <pre>
{JSON.stringify({
  "student_id": user?._id || 'UUID-MISSING',
  "features": {
    "Age": mlPayload.Age,
    "Gender": mlPayload.Gender,
    "LearningStyle": mlPayload.LearningStyle,
    "StudyHours": mlPayload.StudyHours,
    "Attendance": mlPayload.Attendance,
    "OnlineCourses": mlPayload.OnlineCourses,
    "Discussions": mlPayload.Discussions,
    "Internet": mlPayload.Internet
  }
}, null, 2)}
                </pre>
              </div>
            </details>
          </div>
        )}

        {!latest ? (
          <div className="glass-panel fade-up py-20 text-center flex flex-col items-center bg-gradient-to-br from-blue-600/5 to-violet-600/5 dark:from-blue-500/10 dark:to-violet-500/10">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-black/5 dark:bg-white/10 text-accent backdrop-blur-md shadow-xl border border-black/10 dark:border-white/20">
              <Rocket size={40} />
            </div>
            <h2 className="mb-3 font-heading text-3xl font-extrabold">No predictions yet</h2>
            <p className="mx-auto mb-8 max-w-[420px] text-base text-text2">
              Watch some course videos and submit feedback on a subject. Neural AI will automatically generate your personalized report here.
            </p>
            <Link to="/courses" className="btn btn-primary px-8 py-3 rounded-xl shadow-lg shadow-blue-500/20">
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
            {/* Left Column: Big metrics & history */}
            <div className="lg:col-span-7 flex flex-col gap-6 fade-up">
              
              {/* Main Badge Card */}
              <div className="glass-panel p-7 sm:p-9 bg-gradient-to-br from-blue-600/5 to-violet-600/5 dark:from-blue-500/10 dark:to-violet-500/10 border-blue-500/20">
                <div className="mb-8 flex items-center justify-between flex-wrap gap-4 border-b border-black/10 dark:border-white/10 pb-5">
                  <h2 className="font-heading text-2xl font-extrabold text-text">Current Academic State</h2>
                  <span className="badge bg-black/5 dark:bg-white/10 text-text opacity-80 backdrop-blur-md px-3 py-1 text-xs border border-black/10 dark:border-white/5">
                    Updated {new Date(latest.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="scale-[1.02] sm:scale-100 transform origin-left">
                  <PredictionBadge prediction={latest} />
                </div>
              </div>

              {/* What does this mean? */}
              <div className="glass-panel p-7 sm:p-8 fade-up-2">
                <h3 className="mb-4 font-heading text-xl font-bold flex items-center gap-2 text-text">
                  <Sparkles size={24} className="text-accent2" /> AI Insights
                </h3>
                <div className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-[15px] leading-relaxed text-text2 shadow-inner">
                  {latest.state === 'optimal' && <p>You are in the <strong className="text-green-500 font-semibold dark:text-green-400">Optimal Zone</strong>. Your stress levels are well-managed and your understanding is solid. Keep up your current routine and use this time to deepen your knowledge.</p>}
                  {latest.state === 'burnout_risk' && <p>You are at <strong className="text-amber-500 font-semibold dark:text-amber-400">Burnout Risk</strong>. Your performance is good, but your stress is abnormally high. Consider taking short structured breaks and avoid continuous long study sessions.</p>}
                  {latest.state === 'academic_gap' && <p>There is an <strong className="text-blue-500 font-semibold dark:text-blue-400">Academic Gap</strong>. You are currently relaxed but your test readiness is low. Increase your dedicated study hours and practice more mock tests.</p>}
                  {latest.state === 'critical' && <p>This is a <strong className="text-red-500 font-semibold dark:text-red-400">Critical State</strong>. Both your stress is high and performance is lagging. Do not panic—seek support from your mentors, and restart by focusing strictly on easier foundation topics.</p>}
                </div>
              </div>

              {/* History */}
              {history.length > 0 && (
                <div className="glass-panel p-7 sm:p-8 fade-up-3">
                  <h2 className="mb-6 font-heading text-xl font-bold flex items-center gap-2">
                    <CalendarDays size={20} className="text-blue-400" /> Previous Trends
                  </h2>
                  <div className="space-y-3">
                    {history.slice(0, 5).map((h, i) => (
                      <div key={i} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                        <span className="text-sm font-medium text-text3">
                          {new Date(h.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <div className="flex flex-wrap gap-2.5">
                          <span className="badge badge-info shadow-sm">Grade: {['Critical', 'Pass', 'Merit', 'Distinction'][h.grade]}</span>
                          <span className="badge badge-medium shadow-sm">Stress: {['Low', 'Medium', 'High'][h.stress]}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Recommendations */}
            <div className="lg:col-span-5 flex flex-col gap-6 fade-up-2">
              <div className="glass-panel p-7 sm:p-8 h-full">
                <h2 className="mb-6 font-heading text-xl font-extrabold flex items-center gap-2 text-text">
                  <Target size={24} className="text-emerald-400 drop-shadow-md" /> Priority Actions
                </h2>
                
                {latest.suggestions?.length > 0 ? (
                  <div className="flex flex-col gap-3.5 relative">
                    <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-blue-500/50 via-blue-500/20 to-transparent hidden sm:block" />
                    {latest.suggestions.map((s, i) => (
                      <div key={i} className="relative z-10 hover:-translate-y-1 transition-transform duration-300">
                        <SuggestionCard suggestion={s} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 px-6 rounded-2xl border border-dashed border-black/20 dark:border-white/20 text-center bg-black/5 dark:bg-white/5">
                    <p className="text-[15px] text-text2 max-w-[250px] mx-auto">
                      No specific subject priority actions at this moment. You are doing well.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
