import { useNavigate } from 'react-router-dom'

export default function CourseCard({ course, index = 0 }) {
  const navigate = useNavigate()



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
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <h3 className="mb-2 font-heading text-[15px] font-bold text-text group-hover:text-accent transition-colors">
            {course.name}
          </h3>
          {course.description && (
            <p className="text-[12px] leading-relaxed text-text2 line-clamp-2 mb-3">{course.description}</p>
          )}
        </div>
        <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-accent group-hover:gap-2.5 transition-all">
          Start Learning
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </span>
      </div>
    </div>
  )
}
