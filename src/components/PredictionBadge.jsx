import { gradeLabel, stressLabel, stateLabel } from '../utils/helpers'
import { GraduationCap, Activity, Scale } from 'lucide-react'

export default function PredictionBadge({ prediction }) {
  const { grade, stress, state } = prediction

  const gradeTone = {
    0: 'from-red-500/10 to-transparent border-red-500/20',
    1: 'from-amber-500/10 to-transparent border-amber-500/20',
    2: 'from-blue-500/10 to-transparent border-blue-500/20',
    3: 'from-green-500/10 to-transparent border-green-500/20',
  }[grade] || 'from-white/5 to-transparent border-black/10 dark:border-white/10'

  const stressTone = {
    0: 'from-green-500/10 to-transparent border-green-500/20',
    1: 'from-amber-500/10 to-transparent border-amber-500/20',
    2: 'from-red-500/10 to-transparent border-red-500/20',
  }[stress] || 'from-white/5 to-transparent border-black/10 dark:border-white/10'

  const stateTone = {
    optimal:         'from-green-500/10 to-transparent border-green-500/20',
    monitor:         'from-blue-500/10 to-transparent border-blue-500/20',
    burnout_risk:    'from-amber-500/10 to-transparent border-amber-500/20',
    underperforming: 'from-violet-500/10 to-transparent border-violet-500/20',
    at_risk:         'from-orange-500/10 to-transparent border-orange-500/20',
    critical:        'from-red-500/10 to-transparent border-red-500/20',
    academic_gap:    'from-blue-500/10 to-transparent border-blue-500/20',
  }[state] || 'from-white/5 to-transparent border-black/10 dark:border-white/10'

  const gradeTextColor = {
    0: 'text-red-600 dark:text-red-400',
    1: 'text-amber-600 dark:text-amber-400',
    2: 'text-blue-600 dark:text-blue-400',
    3: 'text-green-600 dark:text-green-400',
  }[grade] || 'text-text'

  const stressTextColor = {
    0: 'text-green-600 dark:text-green-400',
    1: 'text-amber-600 dark:text-amber-400',
    2: 'text-red-600 dark:text-red-400',
  }[stress] || 'text-text'

  const stateTextColor = {
    optimal:         'text-green-600 dark:text-green-400',
    monitor:         'text-blue-600 dark:text-blue-400',
    burnout_risk:    'text-amber-600 dark:text-amber-400',
    underperforming: 'text-violet-600 dark:text-violet-400',
    at_risk:         'text-orange-600 dark:text-orange-400',
    critical:        'text-red-600 dark:text-red-400',
    academic_gap:    'text-blue-600 dark:text-blue-400',
  }[state] || 'text-text'

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {/* Grade Card */}
      <div className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 transition-all hover:-translate-y-1 hover:shadow-lg ${gradeTone} text-text`}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-[11px] font-bold uppercase tracking-widest opacity-80 text-text2">Predicted Grade</div>
          <div className={`p-2 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 backdrop-blur-sm shadow-sm ${gradeTextColor}`}><GraduationCap size={20} /></div>
        </div>
        <div className={`font-heading text-3xl font-black mb-1 ${gradeTextColor}`}>
          {gradeLabel(grade)}
        </div>
        <div className="text-[13px] text-text2 font-medium mt-1">
          Level {grade} / 3 Metrics
        </div>
      </div>

      {/* Stress Card */}
      <div className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 transition-all hover:-translate-y-1 hover:shadow-lg ${stressTone} text-text`}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-[11px] font-bold uppercase tracking-widest opacity-80 text-text2">Stress Level</div>
          <div className={`p-2 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 backdrop-blur-sm shadow-sm ${stressTextColor}`}><Activity size={20} /></div>
        </div>
        <div className={`font-heading text-3xl font-black mb-1 ${stressTextColor}`}>
          {stressLabel(stress)}
        </div>
        <div className="text-[13px] text-text2 font-medium mt-1">
          {stress === 0 ? 'Optimal state' : stress === 1 ? 'Manageable capacity' : 'Critical pressure'}
        </div>
      </div>

      {/* State Card */}
      <div className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 transition-all hover:-translate-y-1 hover:shadow-lg ${stateTone} text-text`}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-[11px] font-bold uppercase tracking-widest opacity-80 text-text2">Overall State</div>
          <div className={`p-2 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 backdrop-blur-sm shadow-sm ${stateTextColor}`}><Scale size={20} /></div>
        </div>
        <div className={`font-heading text-2xl font-black mb-1 whitespace-nowrap overflow-hidden text-ellipsis ${stateTextColor}`}>
          {stateLabel(state)}
        </div>
        <div className="text-[13px] text-text2 font-medium mt-1">
          {state === 'optimal'         && 'All systems go!'}
          {state === 'monitor'         && 'Check-in recommended'}
          {state === 'burnout_risk'    && 'Pacing required'}
          {state === 'underperforming' && 'Motivation needed'}
          {state === 'at_risk'         && 'Support required'}
          {state === 'critical'        && 'Intervention needed'}
          {state === 'academic_gap'    && 'Focus needed'}
        </div>
      </div>
    </div>
  )
}
