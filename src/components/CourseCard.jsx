import { useNavigate } from 'react-router-dom'
import { tagBadgeClass, tagLabel } from '../utils/helpers'

export default function CourseCard({ course }) {
  const navigate = useNavigate()

  return (
    <div
      className="card cursor-pointer transition duration-200 hover:-translate-y-1 hover:border-border2"
      onClick={() => navigate(`/courses/${course._id}`)}
    >
      {/* Thumbnail strip */}
      <div className={`mb-4 flex h-28 items-center justify-center rounded-[10px] border text-4xl ${getCategoryTone(course.category)}`}>
        {getCategoryIcon(course.category)}
      </div>

      {/* Badges row */}
      <div className="mb-2.5 flex flex-wrap items-center gap-2">
        <span className={`badge ${tagBadgeClass(course.stressTag)}`}>
          {tagLabel(course.stressTag)}
        </span>
        <span className="rounded-full bg-bg3 px-2 py-0.5 text-[11px] text-text3">
          {course.category}
        </span>
      </div>

      <h3 className="mb-1.5 font-heading text-base font-bold leading-tight">
        {course.name}
      </h3>

      <p className="mb-3.5 text-[13px] leading-relaxed text-text2">
        {course.description || `Learn ${course.shortName} with curated video lectures.`}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-text3">
          {course.videos?.length ?? 0} videos
        </span>
        <span className="text-xs font-medium text-accent">
          Start {'>'}
        </span>
      </div>
    </div>
  )
}

function getCategoryTone(cat) {
  const map = {
    'GATE Prep': 'border-blue-400/20 bg-blue-500/10',
    'CS Core': 'border-violet-400/20 bg-violet-500/10',
    Programming: 'border-emerald-400/20 bg-emerald-500/10',
  }
  return map[cat] || 'border-white/10 bg-white/5'
}

function getCategoryIcon(cat) {
  const map = {
    'GATE Prep':   'ðŸŽ¯',
    'CS Core':     'ðŸ§©',
    'Programming': 'ðŸ’»',
  }
  return map[cat] || 'ðŸ“–'
}
