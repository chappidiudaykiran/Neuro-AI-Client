import { actionIcon } from '../utils/helpers'

const actionLabel = {
  focus_more: 'Focus More',
  take_break: 'Take a Break',
  on_track:   'On Track',
  seek_help:  'Seek Help',
  keep_going: 'Keep Going',
}

const actionTone = {
  focus_more: 'border-blue-500/20 bg-blue-500/10',
  take_break: 'border-amber-500/20 bg-amber-500/10',
  on_track: 'border-green-500/20 bg-green-500/10',
  seek_help: 'border-violet-500/20 bg-violet-500/10',
  keep_going: 'border-emerald-500/20 bg-emerald-500/10',
}

export default function SuggestionCard({ suggestion }) {
  const { subject, action, message } = suggestion
  const icon  = actionIcon(action)
  const label = actionLabel[action] ?? action
  const tone = actionTone[action] ?? 'border-border bg-bg2'
  const iconTone = {
    focus_more: 'text-blue-300 border-blue-500/20 bg-blue-500/10',
    take_break: 'text-amber-300 border-amber-500/20 bg-amber-500/10',
    on_track: 'text-green-300 border-green-500/20 bg-green-500/10',
    seek_help: 'text-violet-300 border-violet-500/20 bg-violet-500/10',
    keep_going: 'text-emerald-300 border-emerald-500/20 bg-emerald-500/10',
  }[action] || 'text-text2 border-border bg-bg3'

  const chipTone = {
    focus_more: 'text-blue-300 bg-blue-500/10',
    take_break: 'text-amber-300 bg-amber-500/10',
    on_track: 'text-green-300 bg-green-500/10',
    seek_help: 'text-violet-300 bg-violet-500/10',
    keep_going: 'text-emerald-300 bg-emerald-500/10',
  }[action] || 'text-text2 bg-bg3'

  return (
    <div className={`flex items-start gap-4 rounded-2xl border p-5 transition hover:border-border2 ${tone}`}>
      {/* Icon bubble */}
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-xl ${iconTone}`}>
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <span className="font-heading text-[15px] font-bold text-text">
            {subject}
          </span>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${chipTone}`}>
            {label}
          </span>
        </div>
        <p className="text-[13px] leading-relaxed text-text2">
          {message}
        </p>
      </div>
    </div>
  )
}
