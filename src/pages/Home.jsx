import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getCourses } from '../api/courses'
import CourseCard from '../components/CourseCard'

export default function Home() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCourses()
      .then(r => setCourses(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page bg-bg text-text selection:bg-accent/30 selection:text-accent">
      
      {/* 1. Hero Section */}
      <section className="relative flex min-h-[90vh] items-center overflow-hidden border-b border-border">
        {/* Abstract Background Orbs */}
        <div className="absolute top-0 right-0 -m-32 h-96 w-96 rounded-full bg-accent/20 blur-[100px]" />
        <div className="absolute bottom-0 left-0 -m-32 h-[30rem] w-[30rem] rounded-full bg-blue-600/10 blur-[120px]" />
        
        <div className="container relative z-10 py-20 text-center">
          <div className="fade-up inline-flex items-center gap-2 mb-8 rounded-full border border-border bg-bg2 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-text2 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Accelerate Your Growth
          </div>
          
          <h1 className="fade-up-2 mb-6 font-heading text-[clamp(40px,8vw,72px)] font-extrabold leading-[1.05] tracking-tight">
            Unlock Your True <br/>
            <span className="bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent drop-shadow-sm">
              Learning Potential
            </span>
          </h1>
          
          <p className="fade-up-3 mx-auto mb-10 max-w-2xl text-[1.1rem] leading-relaxed text-text2 font-medium">
            Bend your learning curve with personalized, expertly curated courses designed to help you excel. Learn at your own pace, master new topics, and achieve academic brilliance.
          </p>
          
          <div className="fade-up-4 flex flex-col sm:flex-row justify-center gap-4">
            {user ? (
              <Link to="/courses" className="btn btn-primary px-8 py-3.5 text-[15px] shadow-lg shadow-accent/25 hover:-translate-y-1 transition-transform">Enter Study Dashboard</Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary px-8 py-3.5 text-[15px] shadow-lg shadow-accent/25 hover:-translate-y-1 transition-transform">Start Learning Now</Link>
                <Link to="/login" className="btn bg-bg2 border border-border text-text hover:bg-border px-8 py-3.5 text-[15px] shadow-sm transition-colors">Educator Login</Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 2. Featured Courses */}
      <section className="py-24 border-b border-border relative bg-bg2/30">
        <div className="container">
          <div className="text-center mb-16">
             <h2 className="font-heading text-3xl font-extrabold md:text-4xl mb-4">Explore Our Curriculum</h2>
             <p className="max-w-xl mx-auto text-text2">Start making progress today with our curated selection of expert subjects.</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-10"><div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin"/></div>
          ) : courses.length > 0 ? (
            <>
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {[
                  courses.find(c => c.category === 'CS Core'),
                  courses.find(c => c.category === 'GATE Prep'),
                  courses.find(c => c.category === 'Programming') || courses.find(c => c.category === 'MERN Stack')
                ].filter(Boolean)
                 .concat(courses)
                 .filter((v, i, a) => a.findIndex(t => t._id === v._id) === i)
                 .slice(0, 3)
                 .map((c, i) => (
                   <div key={c._id} className="fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                     <CourseCard course={c} index={i} />
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
        <p className="font-medium text-text2">© 2026 ECurve Platform.</p>
        <p className="mt-1 opacity-80">Empowering learners everywhere to achieve their greatest potential.</p>
      </footer>
    </div>
  )
}
