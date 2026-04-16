import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMySubjects } from '../api/courses'
import { getAllMySubmissions } from '../api/assignments'

export default function Assignments() {
  const [subjects, setSubjects] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [expandedSubjects, setExpandedSubjects] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const toggleSubject = (id) => {
    setExpandedSubjects(prev => {
      if (prev.has(id)) {
        return new Set()
      }
      return new Set([id])
    })
  }

  useEffect(() => {
    Promise.all([getMySubjects(), getAllMySubmissions()])
      .then(([subRes, submissRes]) => {
        setSubjects(subRes.data)
        setSubmissions(submissRes.data)
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load assignments.')
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="page theme-dashboard"><div className="loading-center"><div className="spinner" /></div></div>

  return (
    <div className="page theme-dashboard">
      <div className="container pb-16 pt-6 sm:pt-10 max-w-4xl mx-auto">
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-accent/20 via-purple-500/10 to-transparent p-6 sm:p-8 border border-white/5 dark:border-white/10 relative overflow-hidden flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent/20 text-accent shadow-inner mt-1">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="relative z-10 text-center sm:text-left">
            <h1 className="font-heading text-4xl font-extrabold tracking-tight text-text fade-up">My Assignments</h1>
            <p className="mt-1.5 text-text2 max-w-xl fade-up-2 leading-relaxed">Track your progress and reflect on your learning journey. Complete video modules to unlock your knowledge checks.</p>
          </div>
        </div>
        {error && <div className="alert alert-error mb-6">{error}</div>}

        {subjects.length === 0 ? (
          <div className="card text-center py-12 fade-up">
            <h2 className="text-xl font-bold mb-2">No subjects enrolled</h2>
            <p className="text-text2 mb-6">Enroll in subjects to see their assignments here.</p>
            <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6 items-start fade-up-2">
            {[...subjects]
              .sort((a, b) => {
                const aOpen = expandedSubjects.has(a._id)
                const bOpen = expandedSubjects.has(b._id)
                if (aOpen && !bOpen) return -1
                if (!aOpen && bOpen) return 1
                return 0
              })
              .map(subject => {
              const totalModules = Math.floor((subject.videos?.length || 0) / 5)
              if (totalModules === 0) return null

              return (
                <div key={subject._id} className={`card p-0 overflow-hidden border-border bg-bg3/50 dark:bg-surface/30 shadow-sm transition-all duration-300 hover:border-accent/30 ${expandedSubjects.has(subject._id) ? 'col-span-full' : ''}`}>
                  <div 
                    className="bg-bg2/80 backdrop-blur-md border-b border-border px-6 py-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-bg3 transition-all group"
                    onClick={() => toggleSubject(subject._id)}
                  >
                    <div className="flex-1 min-w-0">
                      <h2 className="font-heading text-xl font-bold tracking-tight text-text group-hover:text-accent transition-colors truncate">{subject.name}</h2>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <span className="inline-flex items-center rounded-md bg-bg3 px-2 py-0.5 text-[11px] font-medium text-text3">
                          {totalModules} Module{totalModules !== 1 ? 's' : ''}
                        </span>
                        <span className="text-xs text-text3 flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-accent/70"></span>
                          {submissions.filter(s => s.subjectId === subject._id).length} completed
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent px-4 py-2">
                        {expandedSubjects.has(subject._id) ? (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                            Back
                          </>
                        ) : (
                          <>
                            Take Quiz
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                  {expandedSubjects.has(subject._id) && (
                    <div className="p-6 flex flex-col gap-4 animate-fade-in bg-bg/30">
                    {Array.from({ length: totalModules }).map((_, idx) => {
                      const moduleNum = idx + 1
                      const submission = submissions.find(s => s.subjectId === subject._id && s.moduleNumber === moduleNum)
                      
                      return (
                        <div key={moduleNum} className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-5 rounded-2xl border p-5 transition-all duration-300 hover:shadow-md ${submission ? 'border-l-4 border-l-accent border-y-transparent border-r-transparent bg-gradient-to-r from-accent/5 to-transparent dark:from-accent/10' : 'border-border bg-bg2 hover:border-accent/30'}`}>
                          <div className="flex items-start gap-4">
                            <div className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-sm transition-transform group-hover:scale-110 ${submission ? 'bg-accent text-white shadow-accent/30' : 'bg-surface text-text3'}`}>
                              {submission ? (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                              ) : moduleNum}
                            </div>
                            <div className="flex-1">
                              <div className="font-heading font-bold text-base flex items-center gap-3">
                                Module {moduleNum} Knowledge Check
                                {submission && (() => {
                                  const s = submission.score !== undefined && submission.score !== null 
                                    ? submission.score 
                                    : submission.content ? (submission.content.match(/\(CORRECT\)/g) || []).length : 0
                                  const t = submission.totalQuestions || 5
                                  return (
                                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-widest ${s >= 3 ? 'bg-accent/10 text-accent dark:bg-accent/20 dark:text-accent' : 'bg-red-500/10 text-red-500 dark:bg-red-500/20 dark:text-red-400'}`}>
                                    SCORE: {s}/{t}
                                  </span>
                                  )
                                })()}
                              </div>
                              <div className="text-sm mt-1.5 leading-relaxed">
                                {submission ? (
                                  <div className="text-text3 text-xs flex items-center gap-2 font-medium">
                                    <svg className="w-4 h-4 text-accent/80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Assessment completed and locked on {new Date(submission.createdAt).toLocaleDateString()}
                                  </div>
                                ) : (
                                  <span className="text-text3 flex items-center gap-1.5 font-medium">
                                    <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                    Locked &bull; Complete videos {(moduleNum-1)*5 + 1} to {moduleNum*5}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          {!submission && (
                            <Link to={`/courses/${subject._id}/assignment/${moduleNum}`} className="btn btn-primary text-sm shrink-0 self-start sm:self-auto py-2 px-6 rounded-xl shadow-lg shadow-accent/20 group-hover:shadow-accent/40 transition-shadow">
                              Start Module
                            </Link>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
