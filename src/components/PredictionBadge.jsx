import { gradeLabel, gradeColor, stressLabel, stressColor, stateLabel, stateColor } from '../utils/helpers'

export default function PredictionBadge({ prediction }) {
  const { grade, stress, state } = prediction
  const gradeTone = {
    0: 'border-red-500/25 bg-red-500/10 text-red-400',
    1: 'border-amber-500/25 bg-amber-500/10 text-amber-300',
    2: 'border-blue-500/25 bg-blue-500/10 text-blue-300',
    3: 'border-green-500/25 bg-green-500/10 text-green-400',
  }[grade] || 'border-white/10 bg-white/5 text-text'

  const stressTone = {
    0: 'border-green-500/25 bg-green-500/10 text-green-400',
    1: 'border-amber-500/25 bg-amber-500/10 text-amber-300',
    2: 'border-red-500/25 bg-red-500/10 text-red-400',
  }[stress] || 'border-white/10 bg-white/5 text-text'

  const stateTone = {
    optimal: 'border-green-500/25 bg-green-500/10 text-green-400',
    burnout_risk: 'border-amber-500/25 bg-amber-500/10 text-amber-300',
    academic_gap: 'border-blue-500/25 bg-blue-500/10 text-blue-300',
    critical: 'border-red-500/25 bg-red-500/10 text-red-400',
  }[state] || 'border-white/10 bg-white/5 text-text'

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {/* Grade */}
      <div className={`rounded-2xl border px-4 py-5 text-center ${gradeTone}`}>
        <div className="mb-2 text-[11px] uppercase tracking-wider text-text3">
          Predicted Grade
        </div>
        <div className="font-heading text-[26px] font-extrabold">
          {gradeLabel(grade)}
        </div>
        <div className="mt-1 text-[11px] text-text3">
          Level {grade} / 3
        </div>
      </div>

      {/* Stress */}
      <div className={`rounded-2xl border px-4 py-5 text-center ${stressTone}`}>
        <div className="mb-2 text-[11px] uppercase tracking-wider text-text3">
          Stress Level
        </div>
        <div className="font-heading text-[26px] font-extrabold">
          {stressLabel(stress)}
        </div>
        <div className="mt-1 text-[11px] text-text3">
          {stress === 0 ? 'All good' : stress === 1 ? 'Manageable' : 'Needs attention'}
        </div>
      </div>

      {/* State */}
      <div className={`rounded-2xl border px-4 py-5 text-center ${stateTone}`}>
        <div className="mb-2 text-[11px] uppercase tracking-wider text-text3">
          Your State
        </div>
        <div className="font-heading text-lg font-extrabold leading-tight">
          {stateLabel(state)}
        </div>
        <div className="mt-1.5 text-[11px] text-text3">
          {state === 'optimal'      && 'Keep it up!'}
          {state === 'burnout_risk' && 'Slow down a little'}
          {state === 'academic_gap' && 'Study more'}
          {state === 'critical'     && 'Needs support'}
        </div>
      </div>
    </div>
  )
}
