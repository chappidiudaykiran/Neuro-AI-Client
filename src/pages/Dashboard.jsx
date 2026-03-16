import { useState, useEffect } from 'react'
import { triggerPredict, getResults } from '../api/predict'
import { useAuth } from '../context/AuthContext'
import PredictionBadge from '../components/PredictionBadge'
import SuggestionCard from '../components/SuggestionCard'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { user } = useAuth()

  const [latest, setLatest] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [predicting, setPredicting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    getResults()
      .then((r) => {
        const data = r.data
        if (data.length > 0) setLatest(data[0])
        setHistory(data.slice(1))
      })
      .catch(() => setError('Failed to load results.'))
      .finally(() => setLoading(false))
  }, [])

  const handlePredict = async () => {
    setPredicting(true)
    setError('')
    setSuccess('')
    try {
      const res = await triggerPredict()
      setLatest(res.data)
      setHistory((prev) => (prev.length > 0 ? [prev[0], ...prev.slice(1)] : prev))
      setSuccess('Prediction updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Prediction failed. Make sure you submitted feedback for at least one subject.')
    } finally {
      setPredicting(false)
    }
  }

  if (loading) {
    return <div className="page"><div className="loading-center"><div className="spinner" /></div></div>
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="page-title fade-up">Hey, {user?.name?.split(' ')[0]}</h1>
              <p className="page-subtitle fade-up-2">Your AI-powered learning dashboard</p>
            </div>
            <button className="btn btn-primary fade-up mt-2 px-6" onClick={handlePredict} disabled={predicting}>
              {predicting ? 'Analysing...' : 'Run New Prediction'}
            </button>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {!latest ? (
          <div className="card fade-up py-14 text-center">
            <div className="mb-4 text-4xl">Target</div>
            <h2 className="mb-2 font-heading text-2xl font-bold">No predictions yet</h2>
            <p className="mx-auto mb-7 max-w-[420px] text-text2">
              Watch a few subject videos and submit feedback, then run a prediction to see your personalized report.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/courses" className="btn btn-primary">Browse Courses -&gt;</Link>
              <button className="btn btn-outline" onClick={handlePredict} disabled={predicting}>{predicting ? 'Running...' : 'Run Prediction Anyway'}</button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-7">
            <div className="fade-up">
              <h2 className="mb-4 flex flex-wrap items-center gap-2.5 font-heading text-lg font-bold">
                Latest Prediction
                <span className="text-[11px] font-normal text-text3">
                  {new Date(latest.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </span>
              </h2>
              <PredictionBadge prediction={latest} />
            </div>

            {latest.suggestions?.length > 0 && (
              <div className="fade-up-2">
                <h2 className="mb-4 font-heading text-lg font-bold">Subject Recommendations</h2>
                <div className="flex flex-col gap-2.5">
                  {latest.suggestions.map((s, i) => <SuggestionCard key={i} suggestion={s} />)}
                </div>
              </div>
            )}

            <div className="card fade-up-3">
              <h3 className="mb-3 font-heading text-base font-bold">What does this mean?</h3>
              <div className="space-y-2 text-[13px] leading-relaxed text-text2">
                {latest.state === 'optimal' && <p>You are in the <strong className="text-green-400">optimal zone</strong>. Keep your routine and deepen understanding.</p>}
                {latest.state === 'burnout_risk' && <p>You are at <strong className="text-amber-300">burnout risk</strong>. Take breaks and avoid long nonstop sessions.</p>}
                {latest.state === 'academic_gap' && <p>There is an <strong className="text-blue-300">academic gap</strong>. Increase structured study time.</p>}
                {latest.state === 'critical' && <p>This is a <strong className="text-red-400">critical state</strong>. Seek mentor support and restart with easy topics.</p>}
              </div>
            </div>

            {history.length > 0 && (
              <div className="fade-up-4">
                <h2 className="mb-3.5 font-heading text-lg font-bold">Previous Predictions</h2>
                <div className="space-y-2">
                  {history.slice(0, 5).map((h, i) => (
                    <div key={i} className="card flex flex-wrap items-center justify-between gap-3 px-4 py-3.5">
                      <span className="text-xs text-text3">{new Date(h.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <div className="flex flex-wrap gap-2.5">
                        <span className="badge badge-info">Grade: {['Fail', 'Pass', 'Merit', 'Distinction'][h.grade]}</span>
                        <span className="badge badge-medium">Stress: {['Low', 'Medium', 'High'][h.stress]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="h-16" />
      </div>
    </div>
  )
}
