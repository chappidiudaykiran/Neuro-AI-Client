import { useState, useEffect } from 'react'
import { submitAssignment, getCustomAssignment } from '../api/assignments'

// Generate a deterministic hash from a string
const hash = (str) => {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

// Extract key topic words from a video title for question generation
const extractTopic = (title) => {
  // Remove common prefixes like "Engineering Mathematics 01 |"
  const parts = title.split('|')
  const topic = parts.length > 1 ? parts.slice(1).join('|').trim() : title.trim()
  // Remove channel-like suffixes after last dash
  const cleaned = topic.split(' - ')[0].trim()
  return cleaned || title
}

// Generate a meaningful question + 4 options from a video title, with exactly 1 correct answer
// All options reference the topic so the correct answer isn't blatantly obvious
const generateQuestion = (video, index) => {
  const topic = extractTopic(video.title)
  const seed = hash(video.title + index)

  // Different question templates to keep things varied
  const questionSets = [
    {
      question: `What is the primary focus of "${topic}"?`,
      options: [
        `Understanding the foundational concepts and core principles behind ${topic}`,
        `Memorizing all formulas and equations related to ${topic} without context`,
        `Skipping theoretical aspects and only practicing ${topic} numericals`,
        `Learning ${topic} through unrelated analogies from other fields`
      ],
      correct: 0
    },
    {
      question: `Which approach best describes how "${topic}" should be studied?`,
      options: [
        `Ignoring practical examples and focusing only on ${topic} definitions`,
        `Building conceptual understanding of ${topic} through step-by-step analysis`,
        `Randomly studying ${topic} topics without following any structured order`,
        `Only reading about ${topic} without solving any practice problems`
      ],
      correct: 1
    },
    {
      question: `What would be the most effective learning outcome after studying "${topic}"?`,
      options: [
        `Being able to only recognize ${topic} keywords without understanding them`,
        `Having a vague overview of ${topic} without any depth`,
        `Gaining thorough understanding and ability to apply ${topic} concepts in problems`,
        `Memorizing ${topic} content word-by-word from textbooks`
      ],
      correct: 2
    },
    {
      question: `How does "${topic}" contribute to the overall subject knowledge?`,
      options: [
        `${topic} is unrelated to the rest of the syllabus`,
        `${topic} only matters for theoretical exams, not practical applications`,
        `${topic} is an optional topic with no real significance`,
        `${topic} builds essential foundations that connect to advanced topics in the subject`
      ],
      correct: 3
    },
    {
      question: `Which statement about "${topic}" is most accurate?`,
      options: [
        `${topic} requires understanding both theory and practical problem-solving`,
        `${topic} can be fully mastered by reading summaries alone`,
        `${topic} has no real-world applications outside of exams`,
        `${topic} does not require any prerequisite knowledge`
      ],
      correct: 0
    },
    {
      question: `What is the recommended way to master "${topic}"?`,
      options: [
        `Skip the fundamentals and jump to advanced ${topic} problems`,
        `Only watch videos about ${topic} without taking notes`,
        `Combine conceptual learning with regular practice of ${topic} problems`,
        `Avoid ${topic} practice problems until the day before the exam`
      ],
      correct: 2
    },
    {
      question: `Why is "${topic}" important in this module?`,
      options: [
        `${topic} is included only as filler content with no significance`,
        `${topic} provides critical concepts needed for solving higher-level problems`,
        `${topic} is purely historical and has no modern relevance`,
        `${topic} is a duplicate of already covered material`
      ],
      correct: 1
    }
  ]

  const selectedSet = questionSets[seed % questionSets.length]

  return {
    id: index,
    question: selectedSet.question,
    options: selectedSet.options,
    correctAnswer: selectedSet.correct,
    videoTitle: video.title
  }
}

export default function AssignmentView({ subjectId, moduleNumber, videos, existingSubmission, onComplete }) {
  const [answers, setAnswers] = useState({})
  const [revealed, setRevealed] = useState({}) // tracks which questions have been answered & revealed
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [isRetaking, setIsRetaking] = useState(false)
  const [customQuestions, setCustomQuestions] = useState(null)
  const [fetchingCustom, setFetchingCustom] = useState(true)

  const startIndex = (moduleNumber - 1) * 5
  const moduleVideos = (videos || []).slice(startIndex, startIndex + 5)

  // Fetch custom assignment on mount
  useEffect(() => {
    setFetchingCustom(true)
    getCustomAssignment(subjectId, moduleNumber)
      .then(res => {
        if (res.data && res.data.questions && res.data.questions.length > 0) {
          setCustomQuestions(res.data.questions.map((q, i) => ({
            id: i,
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            videoTitle: ''
          })))
        }
      })
      .catch(() => {}) // No custom assignment, fall back to auto-generated
      .finally(() => setFetchingCustom(false))
  }, [subjectId, moduleNumber])

  // Use custom questions if available, otherwise auto-generate
  const questions = customQuestions || moduleVideos.map((v, i) => generateQuestion(v, i))

  // Helper: get score from submission (handles legacy submissions without score field)
  const getScore = (sub) => {
    if (!sub) return { score: 0, total: 5 }
    if (sub.score !== undefined && sub.score !== null) {
      return { score: sub.score, total: sub.totalQuestions || 5 }
    }
    // Fallback: parse from content field
    if (sub.content) {
      const correctCount = (sub.content.match(/\(CORRECT\)/g) || []).length
      const totalCount = (sub.content.match(/\(CORRECT\)|\(INCORRECT\)/g) || []).length
      return { score: correctCount, total: totalCount || 5 }
    }
    return { score: 0, total: 5 }
  }

  const handleOptionSelect = (qId, optIdx) => {
    // If already revealed, don't allow changing
    if (revealed[qId]) return
    
    setAnswers(prev => ({ ...prev, [qId]: optIdx }))
    setRevealed(prev => ({ ...prev, [qId]: true }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (Object.keys(answers).length < questions.length) {
      return setError(`Please answer all ${questions.length} questions before submitting.`)
    }
    
    const calculatedScore = questions.reduce((acc, q) => acc + (answers[q.id] === q.correctAnswer ? 1 : 0), 0)
    const contentPayload = questions.map(q => `Q: ${q.question}\nA: ${q.options[answers[q.id]]} ${answers[q.id] === q.correctAnswer ? '(CORRECT)' : '(INCORRECT)'}`).join('\n\n')
    
    setLoading(true)
    setError('')
    try {
      await submitAssignment({ 
        subjectId, 
        moduleNumber, 
        content: contentPayload,
        score: calculatedScore,
        totalQuestions: questions.length
      })
      setSuccess(true)
      setTimeout(() => {
        if (onComplete) onComplete()
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit assignment.')
    } finally {
      setLoading(false)
    }
  }

  // Loading custom assignment
  if (fetchingCustom) return <div className="flex min-h-[70vh] flex-col items-center justify-center rounded-xl bg-bg2 text-text p-8 border border-border w-full"><div className="spinner" /></div>

  // Retake shield
  if (existingSubmission && !isRetaking && !success) {
    const { score: displayScore, total: displayTotal } = getScore(existingSubmission)
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center rounded-xl bg-bg2 text-text p-8 border border-border w-full">
        <div className="text-center fade-in max-w-md">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mb-3 font-heading text-2xl font-bold">Knowledge Check Passed</h2>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-bg3/50 px-4 py-2 border border-border">
            <span className="font-bold text-text2 text-sm">Score:</span>
            <span className={`font-black text-lg tracking-wide ${displayScore >= 3 ? 'text-accent' : 'text-red-500'}`}>
              {displayScore} / {displayTotal}
            </span>
          </div>
          <p className="text-text2 mb-8 leading-relaxed">You have already completed the assessment for <span className="text-text font-semibold">Module {moduleNumber}</span>. Your results have been officially recorded.</p>
          <button 
            onClick={() => { setIsRetaking(true); setAnswers({}); setRevealed({}) }}
            className="btn btn-outline px-6 shadow-sm"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    )
  }

  const score = questions.reduce((acc, q) => acc + (answers[q.id] === q.correctAnswer ? 1 : 0), 0)
  const allAnswered = Object.keys(answers).length === questions.length

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center rounded-xl bg-bg2 text-text p-6 border border-border overflow-hidden relative w-full">
      {success ? (
        <div className="text-center fade-in">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/20 text-accent">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mb-2 font-heading text-xl font-bold">Assignment Submitted!</h2>
          <p className="text-text2 mb-2">Great job completing Module {moduleNumber}.</p>
          <div className="inline-flex items-center gap-2 rounded-full bg-bg3/50 px-4 py-2 border border-border">
            <span className="font-bold text-text2 text-sm">Your Score:</span>
            <span className={`font-black text-lg ${score >= 3 ? 'text-accent' : 'text-red-500'}`}>{score}/{questions.length}</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full w-full max-w-3xl fade-in text-center">
          <div className="shrink-0">
            <div className="mb-2 sm:mb-3 inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
              Milestone: Module {moduleNumber} Complete
            </div>
            <h2 className="mb-2 sm:mb-4 font-heading text-xl sm:text-2xl font-bold">Module {moduleNumber} Knowledge Check</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0 text-left w-full mt-2">
            <div className="flex-1 overflow-y-auto pr-2 pb-4 space-y-5" style={{ scrollbarWidth: 'thin' }}>
              <div className="text-sm text-text2 bg-bg3/50 p-4 sm:p-5 rounded-xl border border-border/50 text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l10 6.5v7L12 22 2 15.5v-7L12 2z"/></svg>
                </div>
                <p className="font-semibold text-text mb-1 sm:mb-2 relative z-10">Multiple Choice Assessment</p>
                <p className="text-text3 relative z-10">Each question is based on a specific video in this module. Select the best answer — you'll get instant feedback!</p>
              </div>

              {error && <div className="alert alert-error sticky top-0 z-20 shadow-md">{error}</div>}

              <div className="flex flex-col gap-6">
                {questions.map((q, qIndex) => {
                  const isRevealed = revealed[q.id]
                  const selectedAnswer = answers[q.id]
                  
                  return (
                    <div key={q.id} className="p-4 sm:p-5 rounded-xl border border-border bg-bg2 shadow-sm transition-colors hover:border-accent/30">
                      {q.videoTitle && (
                        <div className="mb-1 text-[11px] text-text3 font-medium tracking-wide uppercase">
                          From: {extractTopic(q.videoTitle)}
                        </div>
                      )}
                      <h3 className="font-bold text-sm text-text mb-4 leading-relaxed">
                        <span className="text-accent mr-2">{qIndex + 1}.</span>
                        {q.question}
                      </h3>
                      <div className="flex flex-col gap-2.5">
                        {q.options.map((opt, optIndex) => {
                          const isSelected = selectedAnswer === optIndex
                          const isCorrect = optIndex === q.correctAnswer

                          let borderClass = 'border-border/50 hover:bg-bg3 hover:border-border'
                          let bgClass = ''
                          let radioClass = 'border-text3 bg-transparent'
                          let textClass = 'text-text2'

                          if (isRevealed) {
                            if (isCorrect) {
                              // Always highlight the correct answer in green
                              borderClass = 'border-green-500/50'
                              bgClass = 'bg-green-500/10'
                              radioClass = 'border-green-500 bg-green-500'
                              textClass = 'font-medium text-green-600 dark:text-green-400'
                            } else if (isSelected && !isCorrect) {
                              // Highlight the wrong selection in red
                              borderClass = 'border-red-500/50'
                              bgClass = 'bg-red-500/10'
                              radioClass = 'border-red-500 bg-red-500'
                              textClass = 'font-medium text-red-500 dark:text-red-400'
                            } else {
                              // Dim the other options
                              borderClass = 'border-border/30'
                              textClass = 'text-text3'
                            }
                          } else if (isSelected) {
                            borderClass = 'border-accent bg-accent/5'
                            radioClass = 'border-accent bg-accent'
                            textClass = 'font-medium text-text'
                          }

                          return (
                            <div 
                              key={optIndex} 
                              onClick={() => handleOptionSelect(q.id, optIndex)}
                              className={`flex items-start gap-3 p-3 rounded-lg transition-all duration-300 border ${borderClass} ${bgClass} ${isRevealed ? 'cursor-default' : 'cursor-pointer'}`}
                            >
                              <div className={`flex mt-0.5 h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${radioClass}`}>
                                {(isSelected || (isRevealed && isCorrect)) && <div className="h-1.5 w-1.5 rounded-full bg-white"></div>}
                              </div>
                              <div className="flex-1 flex items-center gap-2">
                                <span className={`text-sm select-none transition-colors duration-300 ${textClass}`}>{opt}</span>
                                {isRevealed && isCorrect && (
                                  <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                )}
                                {isRevealed && isSelected && !isCorrect && (
                                  <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="shrink-0 flex items-center justify-between border-t border-border pt-4 mt-2 bg-bg2">
              <div className="text-xs text-text3 font-medium">
                {Object.keys(answers).length} of {questions.length} answered
                {allAnswered && <span className="ml-3 font-bold text-accent">Score: {score}/{questions.length}</span>}
              </div>
              <button 
                type="submit" 
                className="btn btn-primary px-6 sm:px-8 shadow-lg shadow-accent/20" 
                disabled={loading || !allAnswered}
              >
                {loading ? 'Submitting...' : 'Submit Quiz'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
