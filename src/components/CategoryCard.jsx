import { Link } from 'react-router-dom'

export const getStyleForCategory = (cat) => {
  if (cat === 'CS Core') return { bg: 'from-emerald-600 to-teal-900', badge: 'bg-emerald-500' }
  if (cat === 'GATE Prep') return { bg: 'from-indigo-600 to-purple-900', badge: 'bg-indigo-500' }
  if (cat === 'Programming') return { bg: 'from-amber-500 to-orange-800', badge: 'bg-amber-500' }
  return { bg: 'from-blue-600 to-cyan-900', badge: 'bg-blue-500' } // Default Custom
}

export const getDecorativePath = (cat) => {
  if (cat === 'CS Core') return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
  if (cat === 'GATE Prep') return (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 14v7" />
    </>
  )
  if (cat === 'Programming') return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
}

export const getSlug = (cat) => {
   if (cat === 'CS Core') return 'cs-core'
   if (cat === 'GATE Prep') return 'gate-prep'
   if (cat === 'Programming') return 'programming'
   return cat.toLowerCase().replace(/\s+/g, '-')
}

export default function CategoryCard({ category, count }) {
  const style = getStyleForCategory(category)
  
  return (
     <Link to={`/courses/category/${getSlug(category)}`} className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-white shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:bg-bg2 cursor-pointer h-[20rem] text-left">
        <div className={`relative flex-1 p-6 bg-gradient-to-br ${style.bg} overflow-hidden flex flex-col justify-between`}>
          {/* Decorative Background abstract shape */}
          <svg className="absolute -right-8 -bottom-8 h-64 w-64 text-white opacity-5 transition-transform duration-700 group-hover:scale-125 group-hover:opacity-20 group-hover:-rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {getDecorativePath(category)}
          </svg>
          
          <div className="flex w-fit items-center justify-center gap-1.5 rounded-lg bg-white/10 backdrop-blur-md px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm ring-1 ring-white/30 relative z-10 transition-colors group-hover:bg-white/20">
            {count} {count === 1 ? 'Subject' : 'Subjects'} Included
          </div>

          <div className="flex flex-col text-white relative z-10 mt-6 md:mt-10 lg:mt-6">
            <h2 className={`font-heading font-black leading-tight tracking-tight drop-shadow-md pr-6 mb-2 ${category === 'GATE Prep' ? 'text-[22px] sm:text-2xl' : 'text-3xl'}`}>
              {category === 'GATE Prep' ? 'GATE PREPARATION' : category} <br/>Bundle
            </h2>
            <p className="text-white/80 text-[13px] font-medium pr-8 line-clamp-2 leading-relaxed">
              Dive deep into interactive educational modules curated specifically for the {category} syllabus.
            </p>
          </div>
        </div>
        
        <div className="flex bg-white dark:bg-bg2 px-8 py-5 items-center justify-between transition-colors relative z-20">
          <h3 className="font-heading text-[15px] font-black uppercase tracking-widest text-text group-hover:text-accent transition-colors">
            Explore Pathway
          </h3>
          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${style.badge} text-white shadow-md transition-transform duration-300 group-hover:translate-x-2`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
          </div>
        </div>
     </Link>
  )
}
