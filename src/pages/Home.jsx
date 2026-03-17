import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const FEATURES = [
  { icon: 'Video', title: 'Curated Video Courses', desc: 'Hand-picked YouTube lectures for CS subjects.' },
  { icon: 'AI', title: 'AI Stress Detection', desc: 'Dual ML model tracks stress and academic performance.' },
  { icon: 'Smart', title: 'Smart Suggestions', desc: 'Personalized subject actions: focus more, break, or continue.' },
]

const SUBJECTS = [
  { name: 'GATE Preparation', tag: 'High Stress', tone: 'border-red-400/25 bg-red-500/10 text-red-300' },
  { name: 'Data Structures', tag: 'Medium Stress', tone: 'border-amber-400/25 bg-amber-500/10 text-amber-300' },
  { name: 'Operating Systems', tag: 'High Stress', tone: 'border-red-400/25 bg-red-500/10 text-red-300' },
  { name: 'C Programming', tag: 'Low Stress', tone: 'border-green-400/25 bg-green-500/10 text-green-300' },
  { name: 'DBMS', tag: 'Medium Stress', tone: 'border-amber-400/25 bg-amber-500/10 text-amber-300' },
  { name: 'Computer Networks', tag: 'High Stress', tone: 'border-red-400/25 bg-red-500/10 text-red-300' },
]

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="page">
      <section className="relative flex min-h-[88vh] items-center overflow-hidden border-b border-border bg-bg">
        <div className="container relative z-10 py-20 text-center">
          <div className="fade-up mb-7 inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-accent">
            AI-Powered Education Platform
          </div>
          <h1 className="fade-up-2 mb-6 font-heading text-[clamp(38px,7vw,68px)] font-extrabold leading-none tracking-tight text-text">
            Learn Smarter.
            <br />
            <span className="bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">Stress Less.</span>
          </h1>
          <p className="fade-up-3 mx-auto mb-10 max-w-[560px] text-lg leading-relaxed text-text2">
            Watch curated video lectures, rate your experience, and let AI predict your performance and guide your study plan in real time.
          </p>
          <div className="fade-up-4 flex flex-wrap justify-center gap-3">
            {user ? (
              <Link to="/courses" className="btn btn-primary px-8 py-3 text-[15px]">Browse Courses -&gt;</Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary px-8 py-3 text-[15px]">Get Started Free -&gt;</Link>
                <Link to="/login" className="btn btn-outline px-7 py-3 text-[15px]">Sign In</Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="border-b border-border py-14">
        <div className="container">
          <p className="mb-7 text-center text-xs uppercase tracking-[0.18em] text-text3">Subjects covered</p>
          <div className="flex flex-wrap justify-center gap-3">
            {SUBJECTS.map((s) => (
              <div key={s.name} className="flex items-center gap-2 rounded-full border border-border bg-bg2 px-4 py-2 text-sm">
                <span className="text-text">{s.name}</span>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${s.tone}`}>{s.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border py-20">
        <div className="container">
          <h2 className="mb-2 text-center font-heading text-4xl font-extrabold tracking-tight">How it works</h2>
          <p className="mb-12 text-center text-text2">Four steps from watching to personalized insights</p>
          <div className="grid-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="card text-center">
                <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-sm font-bold text-blue-700">{f.icon}</div>
                <h3 className="mb-2 font-heading text-base font-bold">{f.title}</h3>
                <p className="text-[13px] leading-relaxed text-text2">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {!user && (
        <section className="border-b border-border py-20">
          <div className="container text-center">
            <h2 className="mb-4 font-heading text-3xl font-extrabold tracking-tight">Ready to study smarter?</h2>
            <p className="mb-8 text-text2">Join and let AI guide your learning journey.</p>
            <Link to="/register" className="btn btn-primary px-9 py-3 text-[15px]">Create Free Account -&gt;</Link>
          </div>
        </section>
      )}

      <footer className="border-t border-border py-7 text-center">
      </footer>
    </div>
  )
}
