import { useNavigate } from 'react-router-dom'

export default function CourseCard({ course, index = 0 }) {
  const navigate = useNavigate()

  // Generate repeatable random-looking data based on course ID for UI aesthetics
  const idStr = course._id.toString()
  const getHash = (str) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    return Math.abs(hash)
  }
  const hash = getHash(idStr)
  const rating = (4.0 + (hash % 10) / 10).toFixed(1) // 4.0 to 4.9
  const learners = ((hash % 500) + 10) + 'k+'

  // Assortment of unique vibrant themes with custom abstract background icons representing tech concepts
  const designs = [
    {
      gradient: 'from-emerald-600 to-teal-900',
      tagColor: 'bg-emerald-600',
      icon: (
        <svg className="absolute -right-2 -top-2 h-40 w-40 text-white opacity-10 transition-transform duration-500 group-hover:scale-110 group-hover:opacity-20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none" />
        </svg>
      )
    },
    {
      gradient: 'from-rose-700 to-red-950',
      tagColor: 'bg-rose-600',
      icon: (
        <svg className="absolute -right-4 -top-4 h-44 w-44 text-white opacity-10 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 group-hover:opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    },
    {
      gradient: 'from-blue-600 to-indigo-900',
      tagColor: 'bg-blue-600',
      icon: (
        <svg className="absolute -right-6 -top-2 h-44 w-44 text-white opacity-10 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      )
    },
    {
      gradient: 'from-purple-600 to-fuchsia-900',
      tagColor: 'bg-purple-600',
      icon: (
        <svg className="absolute -right-6 top-0 h-44 w-44 text-white opacity-10 transition-transform duration-500 group-hover:scale-110 group-hover:opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      gradient: 'from-amber-500 to-orange-800',
      tagColor: 'bg-amber-600',
      icon: (
        <svg className="absolute -right-2 -top-2 h-40 w-40 text-white opacity-10 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110 group-hover:opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      )
    },
    {
      gradient: 'from-cyan-600 to-slate-900',
      tagColor: 'bg-cyan-600',
      icon: (
        <svg className="absolute -right-4 -top-2 h-40 w-40 text-white opacity-10 transition-transform duration-500 group-hover:scale-110 group-hover:opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      gradient: 'from-pink-500 to-rose-900',
      tagColor: 'bg-pink-600',
      icon: (
        <svg className="absolute -right-2 -top-4 h-44 w-44 text-white opacity-10 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110 group-hover:opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    {
      gradient: 'from-violet-600 to-indigo-950',
      tagColor: 'bg-violet-600',
      icon: (
        <svg className="absolute -right-6 top-4 h-40 w-40 text-white opacity-10 transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-110 group-hover:opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      gradient: 'from-fuchsia-600 to-pink-900',
      tagColor: 'bg-fuchsia-600',
      icon: (
        <svg className="absolute -right-4 -top-6 h-48 w-48 text-white opacity-10 transition-transform duration-500 group-hover:rotate-180 group-hover:opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      gradient: 'from-lime-600 to-green-900',
      tagColor: 'bg-lime-600',
      icon: (
        <svg className="absolute -right-2 top-2 h-36 w-36 text-white opacity-10 transition-transform duration-500 group-hover:scale-125 group-hover:opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ]
  const design = designs[index % designs.length]

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-[20px] border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-bg2 cursor-pointer"
      onClick={() => navigate(`/courses/${course._id}`)}
    >
      {/* Top Half: Colored banner */}
      <div className={`relative h-44 p-6 bg-gradient-to-br ${design.gradient} overflow-hidden`}>
        {/* Abstract Background Icon */}
        {design.icon}

        {/* Rating Badge */}
        <div className="absolute right-4 top-4 flex items-center gap-1 rounded bg-black/30 px-2.5 py-1 text-[11px] font-extrabold text-white backdrop-blur-sm z-10">
          <svg className="h-3 w-3 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {rating}
        </div>
        
        {/* Course info top */}
        <div className="flex h-full flex-col justify-end text-white relative z-10">
          <h2 className="mb-3 font-heading text-[1.4rem] font-extrabold leading-[1.15] tracking-tight drop-shadow-md pr-6">
            {course.name}
          </h2>
          <div className={`flex w-fit items-center gap-1.5 rounded-md ${design.tagColor} px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm ring-1 ring-white/20`}>
             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
             {course.videos?.length || 0} Modules
          </div>
        </div>
      </div>

      {/* Bottom Half: Details */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-2.5 font-heading text-lg font-bold text-text group-hover:text-accent transition-colors">
          {course.shortName} - Core Curriculum
        </h3>
        
        <div className="mb-6 flex items-center gap-2 text-[13px] text-text2 font-medium">
          <svg className="w-4 h-4 text-text3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          Beginner to Advanced
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-text3 uppercase tracking-wide">
            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            {learners} interested
          </div>
          <div className="text-[13px] font-bold text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-500 transition-colors">
            Explore now
          </div>
        </div>
      </div>
    </div>
  )
}
