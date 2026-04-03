import { useState, useEffect } from 'react'
import { getCourses } from '../api/courses'
import { getAdminAssignments, upsertAdminAssignment, deleteAdminAssignment } from '../api/assignments'

const emptyQuestion = () => ({ question: '', options: ['', '', '', ''], correctAnswer: 0 })

export default function AdminAssignments() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedCategory, setExpandedCategory] = useState(null)
  const [expandedSubject, setExpandedSubject] = useState(null)
  const [assignments, setAssignments] = useState([]) // assignments for expanded subject
  const [assLoading, setAssLoading] = useState(false)

  // Editor state
  const [editingModule, setEditingModule] = useState(null)
  const [questions, setQuestions] = useState([])
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    getCourses()
      .then(res => setCourses(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const getCategoryStyles = (cat) => {
    switch(cat) {
      case 'CS Core': 
        return { 
          card: 'border-emerald-200 dark:border-emerald-900/50', 
          header: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-100 border-emerald-200',
          badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
        };
      case 'GATE Prep': 
        return { 
          card: 'border-violet-200 dark:border-violet-900/50', 
          header: 'bg-violet-50 dark:bg-violet-900/20 text-violet-900 dark:text-violet-100 border-violet-200',
          badge: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200',
        };
      case 'Programming': 
        return { 
          card: 'border-sky-200 dark:border-sky-900/50', 
          header: 'bg-sky-50 dark:bg-sky-900/20 text-sky-900 dark:text-sky-100 border-sky-200',
          badge: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200',
        };
      default: 
        return { 
          card: 'border-border', 
          header: 'bg-bg2 text-text border-border', 
          badge: 'bg-bg3 text-text3',
        };
    }
  }

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
      // Refresh assignments for this subject
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
    <div className="page theme-auth border-t border-border bg-bg">
      <div className="w-full px-4 sm:px-10 pt-10 pb-12">
        <div className="fade-up w-full mx-auto">
          <div className="card shadow-md border-t-8 border-t-accent">
            {/* Header */}
            <div className="mb-6 border-b-2 border-border pb-4 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-black text-black dark:text-white">Manage Assignments</h1>
                <p className="text-text3 text-sm mt-1">Select a category, then click on a subject to manage assignments.</p>
              </div>
              <span className="hidden sm:inline-block bg-black dark:bg-white text-white dark:text-black px-5 py-1.5 rounded-full text-sm font-black shadow-lg">
                {courses.length} Total Subjects
              </span>
            </div>

            {message && (
              <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-semibold ${message.startsWith('✓') ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700' : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-700'}`}>
                {message}
              </div>
            )}

            {/* Categories */}
            <div className="space-y-6">
              {['CS Core', 'GATE Prep', 'Programming'].map(category => {
                const catCourses = courses.filter(c => c.category === category);
                if (catCourses.length === 0) return null;
                
                const isOpenCategory = expandedCategory === category;
                const styles = getCategoryStyles(category);

                return (
                  <div key={category} className={`border-2 rounded-2xl bg-bg dark:bg-bg2 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${isOpenCategory ? 'ring-4 ring-offset-2 ring-offset-bg dark:ring-offset-bg2' : ''} ${styles.card}`}>
                    <div 
                      className={`px-6 py-5 border-b-2 font-heading font-black uppercase tracking-widest flex justify-between items-center text-base sm:text-lg text-black dark:text-white cursor-pointer select-none transition-colors hover:opacity-90 ${styles.header}`}
                      onClick={() => toggleCategory(category)}
                    >
                      <div className="flex items-center gap-3 drop-shadow-sm">
                        <span className="w-3 h-3 rounded-full bg-black dark:bg-white shadow-sm"></span>
                        {category} Bundle
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-5 py-2 rounded-full text-xs font-black shadow-md hidden sm:inline-block ${styles.badge}`}>
                          {catCourses.length} Subjects
                        </span>
                        <svg className={`w-5 h-5 transition-transform duration-300 ${isOpenCategory ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    
                    {isOpenCategory && (
                      <div className="p-3 sm:p-5 bg-bg2/40 space-y-4 animate-fade-in">
                        {catCourses.map(subject => {
                          const totalModules = Math.floor((subject.videos?.length || 0) / 5)
                          if (totalModules === 0) return null
                          const isOpenSub = expandedSubject === subject._id

                          return (
                            <div key={subject._id} className={`rounded-xl border-t-0 border-l-[6px] border-r border-b overflow-hidden transition-all duration-300 ${styles.row} ${isOpenSub ? `${styles.accent} shadow-md` : 'border-l-border/30 border-t-border/30 border-r-border/30 border-b-border/30 hover:border-l-accent/40'}`}>
                              {/* Subject Header - Click to toggle */}
                              <div
                                className="px-4 py-3 sm:px-5 sm:py-4 flex items-center justify-between gap-4 cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => toggleSubject(subject)}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black shadow-sm ${isOpenSub ? 'bg-accent text-white' : 'bg-white dark:bg-bg3 text-text3 border border-black/5 dark:border-white/5'}`}>
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                  </div>
                                  <div className="min-w-0">
                                    <h3 className="font-heading font-black text-sm sm:text-lg text-text truncate group-hover:text-accent transition-colors">{subject.name}</h3>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span className="text-xs font-bold text-text3">{totalModules} module{totalModules !== 1 ? 's' : ''}</span>
                                    </div>
                                  </div>
                                </div>
                                <svg className={`w-5 h-5 text-text3 shrink-0 transition-transform duration-300 ${isOpenSub ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>

                              {/* Expanded: Module list */}
                              {isOpenSub && (
                                <div className="border-t border-black/5 dark:border-white/5 bg-white/50 dark:bg-black/20 p-3 sm:p-4 space-y-4 animate-fade-in relative backdrop-blur-sm">
                                  {assLoading ? (
                                    <div className="text-center py-6 text-text3 text-sm font-semibold">Loading curriculum data...</div>
                                  ) : (
                                    <>
                                      {/* Inline Editor */}
                                      {editingModule && editingModule.subjectId === subject._id && (
                                        <div className="p-4 sm:p-5 rounded-2xl border-2 border-accent bg-bg shadow-md mb-4 animate-fade-in">
                                          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/50">
                                            <h3 className="font-bold text-text flex items-center gap-2">
                                              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                                              {editingModule.assignmentId ? 'Editing' : 'Creating'} — <span className="text-accent underline decoration-2 underline-offset-4">Module {editingModule.moduleNumber}</span>
                                            </h3>
                                            <button onClick={cancelEditing} className="text-xs text-text3 hover:text-red-500 font-bold transition-colors">✕ CLOSE</button>
                                          </div>
                                          <div className="space-y-4">
                                            {questions.map((q, qIdx) => (
                                              <div key={qIdx} className="rounded-xl border border-border bg-bg2 p-4 space-y-3 relative group/question">
                                                <div className="flex items-center justify-between">
                                                  <span className="text-xs font-black text-accent tracking-widest uppercase">Question {qIdx + 1}</span>
                                                  {questions.length > 1 && (
                                                    <button onClick={() => removeQuestion(qIdx)} className="text-[10px] sm:text-xs text-red-500 hover:text-red-700 bg-red-500/10 hover:bg-red-500/20 px-2 py-1 rounded font-bold transition-colors">REMOVE</button>
                                                  )}
                                                </div>
                                                <input
                                                  type="text"
                                                  value={q.question}
                                                  onChange={e => updateQuestion(qIdx, 'question', e.target.value)}
                                                  placeholder="Enter question text here..."
                                                  className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm font-medium text-text placeholder:text-text3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition shadow-sm"
                                                />
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                                  {q.options.map((opt, optIdx) => (
                                                    <div key={optIdx} className="flex items-center gap-2">
                                                      <input
                                                        type="radio"
                                                        name={`correct-${qIdx}`}
                                                        checked={q.correctAnswer === optIdx}
                                                        onChange={() => updateQuestion(qIdx, 'correctAnswer', optIdx)}
                                                        className="accent-accent shrink-0 w-4 h-4"
                                                        title="Mark as correct answer"
                                                      />
                                                      <input
                                                        type="text"
                                                        value={opt}
                                                        onChange={e => updateOption(qIdx, optIdx, e.target.value)}
                                                        placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                                                        className={`flex-1 rounded-lg border px-3 py-2.5 text-sm font-medium text-text placeholder:text-text3 shadow-sm focus:outline-none focus:ring-1 transition ${q.correctAnswer === optIdx ? 'border-green-400 dark:border-green-700 bg-green-50/50 dark:bg-green-900/20 focus:border-green-500 focus:ring-green-500' : 'border-border bg-bg focus:border-accent focus:ring-accent hover:border-border/80'}`}
                                                      />
                                                    </div>
                                                  ))}
                                                </div>
                                              </div>
                                            ))}

                                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 mt-4 border-t border-border/50">
                                              {questions.length < 10 && (
                                                <button onClick={addQuestion} className="btn bg-bg border-dashed border-2 border-border text-text hover:border-accent hover:text-accent px-4 py-2 text-xs font-bold tracking-widest uppercase rounded-lg transition-all">
                                                  + Add Question ({questions.length}/10)
                                                </button>
                                              )}
                                              <div className="flex items-center gap-2 self-end w-full sm:w-auto">
                                                <button onClick={cancelEditing} className="btn bg-bg3 text-text3 hover:text-text hover:bg-border/50 px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex-1 sm:flex-none">Cancel</button>
                                                <button
                                                  onClick={handleSave}
                                                  disabled={saving}
                                                  className="btn bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-lg shadow-md shadow-blue-500/30 transition-all disabled:opacity-50 flex-1 sm:flex-none"
                                                >
                                                  {saving ? 'Saving...' : '✓ Save Assignment'}
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      {/* Module rows */}
                                      {Array.from({ length: totalModules }).map((_, idx) => {
                                        const modNum = idx + 1
                                        const existing = assignments.find(a => a.moduleNumber === modNum)
                                        const isEditing = editingModule?.moduleNumber === modNum && editingModule?.subjectId === subject._id

                                        return (
                                          <div key={modNum} className={`rounded-xl border p-3 sm:p-4 transition-all ${isEditing ? 'border-accent/80 bg-accent/10 ring-2 ring-accent/20' : existing ? 'border-green-400 dark:border-green-600 bg-green-50/50 dark:bg-green-900/10 hover:border-green-500 shadow-sm' : 'border-border bg-bg hover:border-border/80 hover:shadow-sm'}`}>
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                                              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                                                <div className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg text-sm font-black shadow-sm shrink-0 ${existing ? 'bg-green-500 text-white shadow-green-500/30' : 'bg-bg3 text-text3 border border-border'}`}>
                                                  {modNum}
                                                </div>
                                                <div className="min-w-0">
                                                  <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-bold text-sm text-text">Module {modNum}</span>
                                                    {existing && (
                                                      <span className="hidden sm:inline-block text-[10px] font-semibold text-text3">
                                                        Updated {new Date(existing.updatedAt).toLocaleDateString()}
                                                      </span>
                                                    )}
                                                  </div>
                                                  <span className={`inline-flex items-center text-[10px] font-black tracking-widest px-2.5 py-0.5 rounded-md shadow-sm border ${existing ? 'bg-green-100 border-green-200 dark:bg-green-900/60 dark:border-green-800 text-green-700 dark:text-green-400' : 'bg-bg2 border-border text-text3'}`}>
                                                    {existing ? `CUSTOM · ${existing.questions.length} QUESTIONS` : 'AUTO-GENERATED'}
                                                  </span>
                                                </div>
                                              </div>
                                              {!isEditing && (
                                                <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto mt-1 sm:mt-0">
                                                  <button
                                                    onClick={() => startEditing(subject._id, modNum)}
                                                    className="btn bg-white dark:bg-blue-600 text-blue-800 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-700 border border-blue-200 dark:border-blue-500/50 px-4 py-1.5 text-[11px] shadow-sm transition-all uppercase font-black tracking-widest rounded-lg h-8 flex items-center justify-center"
                                                  >
                                                    {existing ? 'Edit' : 'Create'}
                                                  </button>
                                                  {existing && (
                                                    <button
                                                      onClick={() => handleDelete(existing._id, modNum)}
                                                      className="btn bg-white dark:bg-red-600 text-red-700 dark:text-white hover:bg-red-50 dark:hover:bg-red-700 border border-red-200 dark:border-red-500/50 px-4 py-1.5 text-[11px] shadow-sm transition-all uppercase font-black tracking-widest rounded-lg h-8 flex items-center justify-center"
                                                    >
                                                      Drop
                                                    </button>
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        )
                                      })}
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
    </div>
  )
}
