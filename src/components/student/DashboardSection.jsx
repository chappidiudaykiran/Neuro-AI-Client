import { useState, useEffect } from 'react'
import { getResults, getPreview } from '../../api/predict'
import { useAuth } from '../../context/AuthContext'
import PredictionBadge from '../PredictionBadge'
import SuggestionCard from '../SuggestionCard'
import { Link } from 'react-router-dom'
import { Settings, Target, Sparkles, CalendarDays, Rocket } from 'lucide-react'

export default function DashboardSection() {
  const { user } = useAuth()
  const [latest, setLatest] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getResults().catch(() => ({ data: [] }))
        const data = res.data || []
        if (data.length > 0) setLatest(data[0])
        setHistory(data.slice(1))
      } catch (err) {
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
    return <div className="flex justify-center py-10"><div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin"/></div>
  }

  return (
    <div className="fade-up">
      <div className="mb-6 flex items-center justify-between border-b border-border/50 pb-4">
        <div>
          <h2 className="font-heading text-2xl font-extrabold tracking-tight text-text">AI Prediction Dashboard</h2>
          <p className="mt-1 text-sm text-text2">Real-time academic insights based on your learning activity.</p>
        </div>
      </div>

      {error && <div className="alert alert-error my-4">{error}</div>}

      {!latest ? (
        <div className="glass-panel py-16 text-center flex flex-col items-center bg-gradient-to-br from-blue-600/5 to-violet-600/5 dark:from-blue-500/10 dark:to-violet-500/10">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-black/5 dark:bg-white/10 text-accent backdrop-blur-md shadow-xl border border-black/10 dark:border-white/20">
            <Rocket size={32} />
          </div>
          <h3 className="mb-2 font-heading text-2xl font-extrabold">No predictions yet</h3>
          <p className="mx-auto mb-6 max-w-[380px] text-sm text-text2">
            Watch some course videos and submit feedback on a subject to generate your personalized report.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-7 flex flex-col gap-6 fade-up">
            
            {/* Main Badge Card */}
            <div className="glass-panel p-6 sm:p-8 bg-gradient-to-br from-blue-600/5 to-violet-600/5 dark:from-blue-500/10 dark:to-violet-500/10 border-blue-500/20">
              <div className="mb-6 flex items-center justify-between flex-wrap gap-4 border-b border-black/10 dark:border-white/10 pb-4">
                <h3 className="font-heading text-xl font-extrabold text-text">Current State</h3>
                <span className="badge bg-black/5 dark:bg-white/10 text-text opacity-80 backdrop-blur-md px-3 py-1 text-xs border border-black/10 dark:border-white/5">
                  Updated {new Date(latest.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="scale-[1.02] sm:scale-100 transform origin-left">
                <PredictionBadge prediction={latest} />
              </div>
            </div>

            {/* AI Insights Details */}
            <div className="glass-panel p-6 fade-up-2">
              <h4 className="mb-4 font-heading text-lg font-bold flex items-center gap-2 text-text">
                <Sparkles size={20} className="text-accent2" /> Actionable Meaning
              </h4>
              <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-sm leading-relaxed text-text2 shadow-inner">
                {latest.state === 'optimal' && <p>You are in the <strong className="text-green-500 font-semibold dark:text-green-400">Optimal Zone</strong>. Keep up your current routine and use this time to deepen your knowledge.</p>}
                {latest.state === 'burnout_risk' && <p>You are at <strong className="text-amber-500 font-semibold dark:text-amber-400">Burnout Risk</strong>. Consider taking short structured breaks and avoid continuous long study sessions.</p>}
                {latest.state === 'academic_gap' && <p>There is an <strong className="text-blue-500 font-semibold dark:text-blue-400">Academic Gap</strong>. Increase your dedicated study hours and practice more mock tests.</p>}
                {latest.state === 'critical' && <p>This is a <strong className="text-red-500 font-semibold dark:text-red-400">Critical State</strong>. Seek support from mentors and rest before tackling heavy topics.</p>}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 flex flex-col gap-6 fade-up-2">
            
            {/* Priority Actions */}
            <div className="glass-panel p-6 h-full">
              <h4 className="mb-5 font-heading text-lg font-extrabold flex items-center gap-2 text-text">
                <Target size={20} className="text-emerald-400 drop-shadow-md" /> Priority Subjects
              </h4>
              
              {latest.suggestions?.length > 0 ? (
                <div className="flex flex-col gap-3 relative">
                  <div className="absolute left-5 top-5 bottom-5 w-px bg-gradient-to-b from-blue-500/50 via-blue-500/20 to-transparent hidden sm:block" />
                  {latest.suggestions.map((s, i) => (
                    <div key={i} className="relative z-10 hover:-translate-x-1 transition-transform duration-300">
                      <SuggestionCard suggestion={s} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 px-6 rounded-2xl border border-dashed border-black/20 dark:border-white/20 text-center bg-black/5 dark:bg-white/5">
                  <p className="text-sm text-text2">No priority items at this time.</p>
                </div>
              )}
            </div>
            
            {/* History Mini */}
            {history.length > 0 && (
              <div className="glass-panel p-6 fade-up-3">
                <h4 className="mb-4 font-heading text-lg font-bold flex items-center gap-2">
                  <CalendarDays size={18} className="text-blue-400" /> Recent Trends
                </h4>
                <div className="space-y-2">
                  {history.slice(0, 3).map((h, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                      <span className="text-xs font-medium text-text3">
                        {new Date(h.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="badge badge-info shadow-sm text-[10px] scale-90">Grade: {['Critical', 'Pass', 'Merit', 'Distinction'][h.grade]}</span>
                        <span className="badge badge-medium shadow-sm text-[10px] scale-90">Stress: {['Low', 'Medium', 'High'][h.stress]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        </div>
      )}
    </div>
  )
}
