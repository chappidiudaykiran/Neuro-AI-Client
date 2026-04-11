import { useState, useEffect } from 'react'
import { getCourses } from '../api/courses'
import { getAdminAssignments, upsertAdminAssignment, deleteAdminAssignment } from '../api/assignments'

const emptyQuestion = () => ({ question: '', options: ['', '', '', ''], correctAnswer: 0 })

export default function AdminAssignments() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedCategory, setExpandedCategory] = useState(null)
  const [expandedSubject, setExpandedSubject] = useState(null)
  const [assignments, setAssignments] = useState([])
  const [assLoading, setAssLoading] = useState(false)

  // Editor state
  const [editingModule, setEditingModule] = useState(null)
  const [questions, setQuestions] = useState([])
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const categoryMeta = {
    'CS Core': {
      icon: (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>),
      gradient: 'from-emerald-500 to-teal-600',
      badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
      border: 'border-emerald-200 dark:border-emerald-800/40',
      dot: 'bg-emerald-500',
    },
    'GATE Prep': {
      icon: (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>),
      gradient: 'from-violet-500 to-purple-600',
      badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300',
      border: 'border-violet-200 dark:border-violet-800/40',
      dot: 'bg-violet-500',
    },
    'Programming': {
      icon: (<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>),
      gradient: 'from-sky-500 to-blue-600',
      badge: 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300',
      border: 'border-sky-200 dark:border-sky-800/40',
      dot: 'bg-sky-500',
    },
  }

  useEffect(() => {
    getCourses()
      .then(res => setCourses(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const toggleCategory = (category) => {
    setExpandedCategory(prev => prev === category ? null : category)
  }

  const toggleSubject = async (subject) => {
    if (expandedSubject === subject._id) {
      setExpandedSubject(null)
      setEditingModule(null)
      setAssignments([])
      return
    }
    setExpandedSubject(subject._id)
    setEditingModule(null)
    setAssLoading(true)
    try {
      const res = await getAdminAssignments(subject._id)
      setAssignments(res.data)
    } catch {
      setAssignments([])
    }
    setAssLoading(false)
  }

  const startEditing = (subjectId, moduleNumber) => {
    const existing = assignments.find(a => a.moduleNumber === moduleNumber)
    if (existing) {
      setQuestions(existing.questions.map(q => ({ ...q, options: [...q.options] })))
      setEditingModule({ subjectId, moduleNumber, assignmentId: existing._id })
    } else {
      setQuestions([emptyQuestion(), emptyQuestion(), emptyQuestion(), emptyQuestion(), emptyQuestion()])
      setEditingModule({ subjectId, moduleNumber })
    }
    setMessage('')
  }

  const cancelEditing = () => {
    setEditingModule(null)
    setQuestions([])
    setMessage('')
  }

  const updateQuestion = (qIdx, field, value) => {
    setQuestions(prev => prev.map((q, i) => {
      if (i !== qIdx) return q
      if (field === 'question') return { ...q, question: value }
      if (field === 'correctAnswer') return { ...q, correctAnswer: Number(value) }
      return q
    }))
  }

  const updateOption = (qIdx, optIdx, value) => {
    setQuestions(prev => prev.map((q, i) => {
      if (i !== qIdx) return q
      const opts = [...q.options]
      opts[optIdx] = value
      return { ...q, options: opts }
    }))
  }

  const addQuestion = () => {
    if (questions.length >= 10) return
    setQuestions(prev => [...prev, emptyQuestion()])
  }

  const removeQuestion = (idx) => {
    if (questions.length <= 1) return
    setQuestions(prev => prev.filter((_, i) => i !== idx))
  }

  const handleSave = async () => {
    for (const q of questions) {
      if (!q.question.trim()) return setMessage('All questions must have text.')
      if (q.options.some(o => !o.trim())) return setMessage('All options must be filled in.')
    }
    setSaving(true)
    setMessage('')
    try {
      await upsertAdminAssignment({
        subjectId: editingModule.subjectId,
        moduleNumber: editingModule.moduleNumber,
        questions
      })
      const res = await getAdminAssignments(editingModule.subjectId)
      setAssignments(res.data)
      setEditingModule(null)
      setQuestions([])
      setMessage('✓ Assignment saved successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to save assignment.')
    }
    setSaving(false)
  }

  const handleDelete = async (id, moduleNumber) => {
    if (!window.confirm(`Delete custom assignment for Module ${moduleNumber}? Students will see auto-generated questions instead.`)) return
    try {
      await deleteAdminAssignment(id)
      setAssignments(prev => prev.filter(a => a._id !== id))
      if (editingModule?.assignmentId === id) cancelEditing()
      setMessage('✓ Assignment deleted.')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to delete.')
    }
  }

  if (loading) return <div className="page theme-auth"><div className="loading-center"><div className="spinner" /></div></div>

  return (
    <div className="page theme-auth">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-16">
        <div className="card shadow-xl border-t-8 border-t-accent bg-bg2 rounded-3xl p-6 sm:p-10">
          {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-text">Manage Assignments</h1>
            <p className="text-sm text-text3 mt-1">Select a category, then expand a subject to manage module assignments.</p>
          </div>
          <span className="text-xs font-semibold text-text3 bg-bg3 border border-border rounded-full px-3.5 py-1.5 self-start">
            {courses.length} subjects
          </span>
        </div>

        {/* Message Toast */}
        {message && (
          <div className={`mb-4 px-4 py-2.5 rounded-xl text-sm font-medium border ${message.startsWith('✓') ? 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/40' : 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/40'}`}>
            {message}
          </div>
        )}

        {/* Categories */}
        <div className="space-y-4">
          {['CS Core', 'GATE Prep', 'Programming'].map(category => {
            const catCourses = courses.filter(c => c.category === category)
            if (catCourses.length === 0) return null

            const meta = categoryMeta[category] || categoryMeta['CS Core']
            const isOpenCategory = expandedCategory === category

            return (
              <div key={category} className={`rounded-2xl border bg-bg2 overflow-hidden transition-all duration-300 ${isOpenCategory ? meta.border + ' shadow-md' : 'border-border hover:border-border2'}`}>
                {/* Category Header */}
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-5 py-4 transition-colors hover:bg-bg3/50"
                  onClick={() => toggleCategory(category)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${meta.gradient} text-white shadow-sm`}>
                      {meta.icon}
                    </div>
                    <div className="text-left">
                      <h3 className="text-[15px] font-bold text-text">{category}</h3>
                      <p className="text-xs text-text3">{catCourses.length} subject{catCourses.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <svg className={`w-4 h-4 text-text3 transition-transform duration-300 ${isOpenCategory ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Expanded Subjects */}
                {isOpenCategory && (
                  <div className={`border-t ${meta.border}`}>
                    {catCourses.map(subject => {
                      const totalModules = Math.floor((subject.videos?.length || 0) / 5)
                      if (totalModules === 0) return null
                      const isOpenSub = expandedSubject === subject._id

                      return (
                        <div key={subject._id} className={`border-b border-border/40 last:border-b-0 ${isOpenSub ? 'bg-bg3/30' : ''}`}>
                          {/* Subject Row */}
                          <button
                            type="button"
                            className="w-full flex items-center justify-between px-5 py-3.5 gap-4 transition-colors hover:bg-bg3/40"
                            onClick={() => toggleSubject(subject)}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className={`w-2 h-2 rounded-full shrink-0 ${meta.dot}`} />
                              <span className="text-sm font-semibold text-text truncate text-left">{subject.name}</span>
                              <span className="hidden sm:inline-block text-[11px] font-medium text-text3 shrink-0">
                                {totalModules} module{totalModules !== 1 ? 's' : ''}
                              </span>
                            </div>
                            <svg className={`w-4 h-4 text-text3 shrink-0 transition-transform duration-300 ${isOpenSub ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>

                          {/* Expanded Module List */}
                          {isOpenSub && (
                            <div className="px-5 pb-4 space-y-3">
                              {assLoading ? (
                                <div className="text-center py-6 text-text3 text-sm">Loading modules...</div>
                              ) : (
                                <>
                                  {/* Inline Editor */}
                                  {editingModule && editingModule.subjectId === subject._id && (
                                    <div className="rounded-xl border border-accent/30 bg-bg p-4 space-y-4 mb-2">
                                      <div className="flex items-center justify-between border-b border-border/50 pb-3">
                                        <h4 className="text-sm font-bold text-text flex items-center gap-2">
                                          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                                          {editingModule.assignmentId ? 'Edit' : 'Create'} — Module {editingModule.moduleNumber}
                                        </h4>
                                        <button onClick={cancelEditing} className="text-xs text-text3 hover:text-red-500 font-medium transition-colors">✕ Close</button>
                                      </div>

                                      {questions.map((q, qIdx) => (
                                        <div key={qIdx} className="rounded-lg border border-border bg-bg2 p-3.5 space-y-2.5">
                                          <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-bold text-accent uppercase tracking-wider">Q{qIdx + 1}</span>
                                            {questions.length > 1 && (
                                              <button onClick={() => removeQuestion(qIdx)} className="text-[11px] text-red-500 hover:text-red-600 font-medium transition-colors">Remove</button>
                                            )}
                                          </div>
                                          <input
                                            type="text"
                                            value={q.question}
                                            onChange={e => updateQuestion(qIdx, 'question', e.target.value)}
                                            placeholder="Question text..."
                                            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text placeholder:text-text3 focus:outline-none focus:border-accent transition"
                                          />
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {q.options.map((opt, optIdx) => (
                                              <div key={optIdx} className="flex items-center gap-2">
                                                <input
                                                  type="radio"
                                                  name={`correct-${qIdx}`}
                                                  checked={q.correctAnswer === optIdx}
                                                  onChange={() => updateQuestion(qIdx, 'correctAnswer', optIdx)}
                                                  className="accent-accent shrink-0 w-3.5 h-3.5"
                                                />
                                                <input
                                                  type="text"
                                                  value={opt}
                                                  onChange={e => updateOption(qIdx, optIdx, e.target.value)}
                                                  placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                                                  className={`flex-1 rounded-lg border px-3 py-2 text-sm text-text placeholder:text-text3 focus:outline-none transition ${q.correctAnswer === optIdx ? 'border-green-400 dark:border-green-700 bg-green-50/50 dark:bg-green-900/20 focus:border-green-500' : 'border-border bg-bg focus:border-accent'}`}
                                                />
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      ))}

                                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-border/50">
                                        {questions.length < 10 && (
                                          <button onClick={addQuestion} className="text-xs font-medium text-text3 hover:text-accent border border-dashed border-border hover:border-accent px-3 py-1.5 rounded-lg transition-all">
                                            + Add Question ({questions.length}/10)
                                          </button>
                                        )}
                                        <div className="flex items-center gap-2 self-end">
                                          <button onClick={cancelEditing} className="text-xs font-medium text-text3 hover:text-text bg-bg3 px-3.5 py-1.5 rounded-lg transition-all">Cancel</button>
                                          <button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="text-xs font-semibold text-white bg-accent hover:bg-accent/90 px-4 py-1.5 rounded-lg shadow-sm transition-all disabled:opacity-50"
                                          >
                                            {saving ? 'Saving...' : 'Save Assignment'}
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Module Rows */}
                                  <div className="space-y-2">
                                    {Array.from({ length: totalModules }).map((_, idx) => {
                                      const modNum = idx + 1
                                      const existing = assignments.find(a => a.moduleNumber === modNum)
                                      const isEditing = editingModule?.moduleNumber === modNum && editingModule?.subjectId === subject._id

                                      return (
                                        <div key={modNum} className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-all ${isEditing ? 'border-accent/40 bg-accent/5' : existing ? 'border-green-300 dark:border-green-800/50 bg-green-50/50 dark:bg-green-950/20' : 'border-border bg-bg hover:border-border2'}`}>
                                          <div className="flex items-center gap-3 min-w-0">
                                            <div className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold shrink-0 ${existing ? 'bg-green-500 text-white' : 'bg-bg3 text-text3 border border-border'}`}>
                                              {modNum}
                                            </div>
                                            <div className="min-w-0">
                                              <span className="text-sm font-semibold text-text">Module {modNum}</span>
                                              <span className={`ml-2 text-[11px] font-medium ${existing ? 'text-green-600 dark:text-green-400' : 'text-text3'}`}>
                                                {existing ? `Custom · ${existing.questions.length}Q` : 'Auto-generated'}
                                              </span>
                                            </div>
                                          </div>
                                          {!isEditing && (
                                            <div className="flex items-center gap-2 shrink-0">
                                              <button
                                                onClick={() => startEditing(subject._id, modNum)}
                                                className="text-xs font-semibold text-accent bg-accent/5 hover:bg-accent/10 border border-accent/20 px-3 py-1 rounded-lg transition-all"
                                              >
                                                {existing ? 'Edit' : 'Create'}
                                              </button>
                                              {existing && (
                                                <button
                                                  onClick={() => handleDelete(existing._id, modNum)}
                                                  className="text-xs font-semibold text-red-500 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-lg transition-all"
                                                >
                                                  Delete
                                                </button>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      )
                                    })}
                                  </div>
                                </>
                              )}
                            </div>
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
        </div>
      </div>
    </div>
  )
}
