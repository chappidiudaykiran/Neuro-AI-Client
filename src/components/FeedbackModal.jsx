import { useState } from 'react'
import { submitFeedback } from '../api/feedback'

const STARS = [1, 2, 3, 4, 5]

function StarRating({ label, value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="mb-4.5">
      <div className="mb-2 text-[13px] text-text2">{label}</div>
      <div className="flex gap-1.5">
        {STARS.map(s => (
          <button key={s}
            type="button"
            onMouseEnter={() => setHover(s)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(s)}
            className={`text-2xl transition duration-150 ${s <= (hover || value) ? 'scale-110 text-amber-400' : 'text-text3 opacity-40'}`}>
            ★
          </button>
        ))}
      </div>
    </div>
  )
}

export default function FeedbackModal({ subject, watchData, onClose, onSubmitted }) {
  const [form, setForm] = useState({
    difficultyRating: 0,
    stressFelt: 0,
    confidenceRating: 0,
    enjoyedSubject: null,
    feedbackText: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async () => {
    if (!form.difficultyRating || !form.stressFelt || !form.confidenceRating || form.enjoyedSubject === null) {
      setError('Please answer all questions before submitting.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await submitFeedback({
        subjectId:        subject._id,
        subjectName:      subject.name,
        subjectTag:       subject.stressTag,
        difficultyRating: form.difficultyRating,
        stressFelt:       form.stressFelt,
        confidenceRating: form.confidenceRating,
        enjoyedSubject:   form.enjoyedSubject,
        feedbackText:     form.feedbackText,
        watchMinutes:     watchData.watchMinutes,
        completionPct:    watchData.completionPct,
      })
      onSubmitted?.()
    } catch {
      setError('Failed to save feedback. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    /* backdrop */
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 p-5">
      <div className="w-full max-w-[440px] animate-fade-up rounded-2xl border border-border2 bg-bg2 p-8">
        <h2 className="mb-1 font-heading text-xl font-bold">
          Quick Feedback
        </h2>
        <p className="mb-6 text-[13px] text-text2">
          How was <strong className="text-text">{subject.name}</strong>? Takes 10 seconds and helps personalise your plan.
        </p>

        <StarRating label="How difficult was this topic?" value={form.difficultyRating}
          onChange={v => set('difficultyRating', v)} />
        <StarRating label="How stressed did you feel?" value={form.stressFelt}
          onChange={v => set('stressFelt', v)} />
        <StarRating label="How confident do you feel now?" value={form.confidenceRating}
          onChange={v => set('confidenceRating', v)} />

        <div className="mb-6">
          <div className="mb-2.5 text-[13px] text-text2">Did you enjoy this subject?</div>
          <div className="flex gap-2.5">
            {[true, false].map(val => (
              <button key={String(val)}
                type="button"
                onClick={() => set('enjoyedSubject', val)}
                className={`btn flex-1 border text-sm ${form.enjoyedSubject === val
                  ? (val ? 'border-green-500 bg-green-500/20 text-green-300' : 'border-red-500 bg-red-500/20 text-red-300')
                  : 'border-border bg-bg3 text-text2'}`}>
                {val ? 'Yes' : 'No'}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="mb-2.5 block text-[13px] text-text2">Any feedback or comments? (Optional)</label>
          <textarea
            className="w-full resize-none rounded-xl border border-border bg-bg3 p-3 text-sm text-text outline-none focus:border-accent"
            rows="3"
            placeholder="What could be improved? How did you find the explanations?"
            value={form.feedbackText}
            onChange={(e) => set('feedbackText', e.target.value)}
          ></textarea>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="flex gap-2.5">
          <button className="btn btn-outline flex-1" onClick={onClose}>
            Skip
          </button>
          <button className="btn btn-primary flex-[2]"
            onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Submit Feedback'}
          </button>
        </div>
      </div>
    </div>
  )
}
