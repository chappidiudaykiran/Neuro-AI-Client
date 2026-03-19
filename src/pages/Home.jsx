import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getCategoriesSummary } from '../api/courses'
import CategoryCard from '../components/CategoryCard'
import { getSlug } from '../components/CategoryCard'

const SUBJECTS = ['Data Structures', 'Machine Learning', 'Operating Systems', 'GATE Prep', 'Python', 'DBMS', 'Computer Networks', 'C Programming']

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState(null)
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex(prev => (prev + 1) % SUBJECTS.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    getCategoriesSummary()
      .then(r => {
          const sorted = r.data.sort((a, b) => {
            const order = ['GATE Prep', 'Programming', 'CS Core'];
            const indexA = order.indexOf(a.category);
            const indexB = order.indexOf(b.category);
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            return indexA !== -1 ? -1 : indexB !== -1 ? 1 : a.category.localeCompare(b.category);
          });
          setCategories(sorted);
          if (sorted.length > 0) setActiveCategory(sorted[0].category);
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const greetUser = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  return (
    <div className="page bg-bg text-text selection:bg-accent/30 selection:text-accent">
      
      {/* ====== Hero ====== */}
      <section className="relative flex min-h-[calc(100vh-64px)] items-center overflow-hidden border-b border-border">
        {/* Background */}
        <div className="absolute top-0 right-0 -m-32 h-96 w-96 rounded-full bg-accent/20 blur-[100px]" />
        <div className="absolute bottom-0 left-0 -m-32 h-[30rem] w-[30rem] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(var(--color-accent) 1px, transparent 1px), linear-gradient(90deg, var(--color-accent) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />

        <div className="container relative z-10 py-16 text-center">
          {/* Main Heading */}
          <h1 className="fade-up mb-4 font-heading text-[clamp(32px,7vw,56px)] font-extrabold leading-[1.08] tracking-tight">
            {user ? (
              <>{greetUser()}, <span className="hero-gradient-text">{user.name?.split(' ')[0]}</span>!</>
            ) : (
              <>Learn Smarter with{' '}<br className="hidden sm:block" />
              <span className="hero-gradient-text">Neuro-AI</span></>
            )}
          </h1>

          {/* Motto */}
          <p className="fade-up-2 mx-auto mb-8 max-w-2xl text-[1.05rem] leading-relaxed text-text2">
            An adaptive learning platform that understands how you study, tracks your progress, and delivers personalized recommendations to help you reach your full academic potential.
          </p>

          {/* Search Bar */}
          <div className="fade-up-3 mx-auto mb-10 max-w-3xl">
            <div className="flex items-center rounded-2xl border border-border shadow-lg shadow-black/5 transition-all focus-within:border-accent focus-within:shadow-accent/10 focus-within:shadow-xl">
              <div className="pl-5 text-text3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </div>
              <input
                type="text"
                placeholder={SUBJECTS[wordIndex]}
                className="flex-1 bg-transparent px-4 py-4 text-[15px] text-text placeholder:text-text3 outline-none"
                onKeyDown={(e) => { if (e.key === 'Enter' && e.target.value.trim()) navigate('/courses') }}
              />
            </div>
          </div>

          {/* Category Quick-Links */}
          {!loading && categories.length > 0 && (
            <div className="fade-up-4 flex flex-wrap justify-center gap-2.5">
              {categories.map((c) => (
                <Link
                  key={c.category}
                  to={`/courses/category/${getSlug(c.category)}`}
                  className={`rounded-full border px-5 py-2 text-[13px] font-semibold transition-all hover:-translate-y-0.5 ${
                    activeCategory === c.category
                      ? 'border-accent bg-accent text-white shadow-md shadow-accent/25'
                      : 'border-border bg-bg2 text-text hover:border-accent/40 hover:text-accent'
                  }`}
                  onMouseEnter={() => setActiveCategory(c.category)}
                >
                  {c.category}
                  <span className="ml-1.5 text-[11px] opacity-70">({c.count})</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ====== Courses ====== */}
      <section className="py-24 border-b border-border relative bg-bg2/30">
        <div className="container">
          <div className="text-center mb-16">
             <h2 className="font-heading text-3xl font-extrabold md:text-4xl mb-4">Explore Our Curriculum</h2>
             <p className="max-w-xl mx-auto text-text2">Start making progress today with our curated selection of expert subjects.</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-10"><div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin"/></div>
          ) : categories.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 max-w-6xl mx-auto">
                {categories.slice(0, 3).map((c, i) => (
                   <div key={c.category} className="fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                     <CategoryCard category={c.category} count={c.count} />
                   </div>
                ))}
              </div>
              <div className="text-center fade-up-3">
                <Link to="/courses" className="btn bg-bg2 border border-border text-text hover:bg-border hover:border-accent/40 px-8 py-3.5 shadow-sm inline-flex items-center gap-2 group transition-all">
                  View All Courses 
                  <svg className="w-4 h-4 text-accent transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </Link>
              </div>
            </>
          ) : null}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-sm text-text3 bg-bg2 flex flex-col items-center">
        <p className="font-medium text-text2">© 2026 Neuro-AI · Adaptive Educational Intelligence</p>
        <p className="mt-1 opacity-80">Developed by students of CSE 3B Team 14</p>
      </footer>
    </div>
  )
}
