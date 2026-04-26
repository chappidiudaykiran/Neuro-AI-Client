import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain, Zap, GraduationCap, ChevronRight, BarChart3, Clock, AlertTriangle, CheckCircle2, Activity, Database, Settings } from 'lucide-react'
import { getResults, getPreview, triggerPredict } from '../../api/predict'
import { getMySubjects } from '../../api/courses'
import { useAuth } from '../../context/AuthContext'
import CourseCard from '../CourseCard'

export default function DashboardSection({ isHome = false }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [latest, setLatest] = useState(null)
  const [enrolledSubjects, setEnrolledSubjects] = useState([])
  const [mlPayload, setMlPayload] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)

  const syncDashboard = async () => {
    try {
      // Auto-trigger a fresh ML prediction on every page load
      await triggerPredict().catch(err => console.warn('[Auto-predict]:', err.message))

      const [resResults, resSubjects, resPreview] = await Promise.all([
        getResults().catch(() => ({ data: [] })),
        getMySubjects().catch(() => ({ data: [] })),
        getPreview().catch(() => ({ data: null }))
      ])
      
      const data = resResults.data || []
      if (data.length > 0) setLatest(data[0])
      
      const previewData = resPreview.data || {}
      const gradesRaw = previewData.gradesBreakdown || []
      
      const sortedGrades = [...gradesRaw].sort((a, b) => b.calculatedGrade - a.calculatedGrade)
      
      setMlPayload({
        ...previewData,
        gradesBreakdown: sortedGrades
      })

      const enrolledRaw = resSubjects.data || []
      const sortedSubjects = sortedGrades.map(g => enrolledRaw.find(s => s._id === g.subjectId)).filter(Boolean)
      const otherSubjects = enrolledRaw.filter(s => !sortedGrades.find(g => g.subjectId === s._id))
      setEnrolledSubjects([...sortedSubjects, ...otherSubjects])
    } catch (err) {
      console.error('Dashboard sync error:', err)
    } finally {
      setLoading(false)
      setIsSyncing(false)
    }
  }

  const handlePredict = async () => {
    setIsSyncing(true)
    try {
      await triggerPredict()
      await syncDashboard()
    } catch (err) {
      console.error('Prediction trigger error:', err)
      setIsSyncing(false)
    }
  }

  useEffect(() => {
    syncDashboard()
  }, [])

  if (loading) {
    return <div className="w-full flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin"/></div>
  }

  const stressMap = {
    0: { label: 'Low', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle2, desc: 'Your cognitive load is optimal. You exhibit high focus and low mental fatigue. Perfect time for complex problem solving.' },
    1: { label: 'Moderate', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Activity, desc: 'Your brain is working hard. You are in a "Flow State" but approaching mental capacity. Consider a short break soon.' },
    2: { label: 'High', color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: AlertTriangle, desc: 'Warning: High cognitive stress detected. Your performance may decrease due to fatigue. We recommend switching to a lighter subject.' }
  }

  const stressData = latest ? (stressMap[latest.stress ?? latest.rawResponse?.stress] || stressMap[0]) : stressMap[0]
  const Icon = stressData.icon
  const grades = mlPayload?.gradesBreakdown || []

  return (
    <div className={`fade-up ${isHome ? 'mb-4' : 'space-y-12 pb-12 mt-4'}`}>




      {/* 1. Psychological Monitor */}
      {!isHome && latest && (
        <section>
          <div className="mb-6 flex items-center justify-between pb-4">
            <div className="flex items-center gap-3">
               <div className="p-2.5 rounded-xl bg-accent/10 text-accent">
                 <Brain size={24} />
               </div>
               <div>
                <h2 className="font-heading text-2xl font-extrabold tracking-tight text-text leading-none">Psychological Monitor</h2>
                <p className="mt-1.5 text-xs font-medium text-text3 uppercase tracking-wider">Live Biometric Prediction</p>
               </div>
            </div>
          </div>

          <div className={`glass-panel p-8 sm:p-10 relative overflow-hidden bg-bg2/40 border-2 ${stressData.border}`}>
            <div className={`absolute -right-8 -top-8 opacity-5 transition-transform duration-700 hover:rotate-12`}>
                <Icon size={200} />
            </div>

            <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
              <div className="shrink-0">
                <div className={`flex h-32 w-32 items-center justify-center rounded-3xl ${stressData.bg} ${stressData.color} border border-white/10 shadow-2xl relative group transition-all duration-500`}>
                  <div className="absolute inset-0 rounded-3xl bg-current opacity-[0.03] blur-xl group-hover:opacity-10 transition-opacity" />
                  <Icon size={56} className="relative z-10" />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${stressData.bg} ${stressData.color} border ${stressData.border}`}>
                    {stressData.label} Stress
                  </span>
                  <span className="text-[11px] font-bold text-text3 uppercase tracking-wider opacity-50 flex items-center gap-1.5 italic">
                      <Activity size={12} className="animate-pulse" /> Analyzed Focus State
                  </span>
                </div>
                
                <h3 className="text-3xl font-heading font-black mb-3 text-text leading-tight">
                  {latest.stress === 0 && "Optimal Cognitive State"}
                  {latest.stress === 1 && "Heightened Mental Profile"}
                  {latest.stress === 2 && "Critical Pressure Alert"}
                </h3>
                
                <p className="text-text2 text-[15px] max-w-xl leading-relaxed">
                  {stressData.desc}
                </p>
              </div>


            </div>
          </div>
        </section>
      )}

      {/* 1.5 Dynamic AI Recommendation */}
      {(() => {
        const subjectsCount = enrolledSubjects.length
        if (subjectsCount === 0 || !latest) return null;

        const currentStress = latest.stress ?? latest.rawResponse?.stress

        let tier1 = [], tier2 = [], tier3 = []
        if (subjectsCount === 1) {
          tier1 = [enrolledSubjects[0]]; tier2 = [enrolledSubjects[0]]; tier3 = [enrolledSubjects[0]]
        } else if (subjectsCount === 2) {
          tier1 = [enrolledSubjects[0]]; tier2 = [enrolledSubjects[0], enrolledSubjects[1]]; tier3 = [enrolledSubjects[1]]
        } else {
          const q = Math.floor(subjectsCount / 3)
          const r = subjectsCount % 3
          const s1 = q + (r > 0 ? 1 : 0), s2 = q + (r > 1 ? 1 : 0)
          tier1 = enrolledSubjects.slice(0, s1)
          tier2 = enrolledSubjects.slice(s1, s1 + s2)
          tier3 = enrolledSubjects.slice(s1 + s2)
        }

        let recs = [], sLabel = "", sDesc = ""
        if (currentStress === 2) { 
          recs = tier1; sLabel = "High Stress: Comfort Zone"; sDesc = "Your stress is high. Focus on your strongest subjects to maintain momentum." 
        } else if (currentStress === 1) { 
          recs = tier2; sLabel = "Medium Stress: Steady Progress"; sDesc = "Moderate pressure detected. Good time for your balanced subjects." 
        } else { 
          recs = tier3; sLabel = "Low Stress: Growth Mode"; sDesc = "Energy is high! Tackle your weakest subjects now to close gaps." 
        }

        return (
          <section className="fade-up-2">
            <div className="mb-6 flex items-center justify-between pb-4">
              <div className="flex items-center gap-3">
                 <div className={`p-2.5 rounded-xl ${currentStress === 0 ? 'bg-blue-500/10 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : currentStress === 1 ? 'bg-amber-500/10 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-red-500/10 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]'}`}>
                   <Zap size={24} className="animate-pulse" />
                 </div>
                 <div>
                  <h2 className="font-heading text-2xl font-extrabold tracking-tight text-text leading-none">Focus Recommendation</h2>
                  <p className="mt-1.5 text-xs font-medium text-text3 uppercase tracking-wider">{sLabel}</p>
                 </div>
              </div>
            </div>



            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recs.map((subject, idx) => {
                return <CourseCard course={subject} index={idx} key={`rec-${idx}`} />
              })}
            </div>
          </section>
        )
      })()}

      {!isHome && (
        <>
          {/* 2. Academic Performance Grading */}
          {grades.length > 0 && (
            <section className="fade-up-2">
              <div className="mb-6 flex items-center justify-between pb-4">
                <div className="flex items-center gap-3">
                   <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                     <GraduationCap size={24} />
                   </div>
                   <div>
                    <h2 className="font-heading text-2xl font-extrabold tracking-tight text-text leading-none">Subject Grading</h2>
                    <p className="mt-1.5 text-xs font-medium text-text3 uppercase tracking-wider">Consolidated Matrix (Watch + Quizzes + Consistency)</p>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {enrolledSubjects.map((subject, idx) => {
                  const g = grades.find(gr => gr.subjectId === subject._id)
                  return (
                    <div key={idx} className="glass-panel p-6 border-border/40 hover:border-accent/40 transition-all duration-300 group cursor-pointer" onClick={() => navigate(`/courses/${subject._id}`)}>
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-bg flex items-center justify-center border border-border group-hover:bg-accent/5 group-hover:border-accent/20 transition-colors">
                            <BarChart3 size={20} className="text-text3 group-hover:text-accent transition-colors" />
                          </div>
                          <div>
                            <h4 className="font-bold text-text leading-none mb-1">{subject.name}</h4>
                            <span className="text-[10px] uppercase font-black tracking-widest text-text3 opacity-60">
                              {subject.stressTag?.replace('_', ' ') || 'standard'}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black font-heading text-text leading-none">{g?.calculatedGrade || 0}<span className="text-[10px] opacity-40 ml-0.5">%</span></div>
                          <div className="text-[9px] font-bold uppercase tracking-tighter text-text3">Neural Score</div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-1.5 px-1">
                            <span className="text-[10px] uppercase font-bold text-text2 tracking-wider">Watch Progress</span>
                            <span className="text-[11px] font-black text-text">{g?.watchProgress || 0}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-bg rounded-full overflow-hidden border border-border/30">
                            <div className="h-full bg-accent rounded-full transition-all duration-1000" style={{ width: `${g?.watchProgress || 0}%` }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1.5 px-1">
                            <span className="text-[10px] uppercase font-bold text-text2 tracking-wider">Quiz Accuracy</span>
                            <span className="text-[11px] font-black text-text">{g?.assignmentPerformance || 0}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-bg rounded-full overflow-hidden border border-border/30">
                            <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${g?.assignmentPerformance || 0}%` }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1.5 px-1">
                            <span className="text-[10px] uppercase font-bold text-text2 tracking-wider">Consistency</span>
                            <span className="text-[11px] font-black text-text">{g?.consistencyScore || 0}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-bg rounded-full overflow-hidden border border-border/30">
                            <div className="h-full bg-violet-500 rounded-full transition-all duration-1000" style={{ width: `${g?.consistencyScore || 0}%` }} />
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-5 pt-4 border-t border-border/30 flex items-center justify-between">
                         <div className="flex items-center gap-1.5 text-[10px] font-bold text-text3 uppercase italic">
                            <ChevronRight size={10} className="text-accent" /> Status: {latest?.suggestions?.find(s => s.subject === subject.name)?.action?.replace('_', ' ') || 'Active'}
                         </div>
                         <div className="text-[10px] font-black uppercase text-accent group-hover:translate-x-1 transition-transform">
                            Go to Videos →
                         </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* 0. Enrolled Index */}
          <section className="fade-up">
            <div className="mb-4 flex items-center justify-between pb-2">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text3">Subscribed Subjects Matrix</h3>
            </div>
            <div className="glass-panel p-6 bg-bg2/10">
              <div className="space-y-4">
                {enrolledSubjects.length > 0 ? (
                  enrolledSubjects.map((subject, idx) => {
                    const gradeInfo = grades.find(g => g.subjectId === subject._id);
                    return (
                      <div key={idx} className="flex items-center justify-between text-sm group cursor-pointer" onClick={() => navigate(`/courses/${subject._id}`)}>
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-accent font-black tracking-tighter w-4 text-left">{idx + 1})</span>
                          <span className="font-bold text-text group-hover:text-accent transition-colors">
                            {subject.name}
                          </span>
                        </div>
                        {gradeInfo ? (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-bold">
                             Grade: {gradeInfo.calculatedGrade}%
                          </span>
                        ) : (
                          <span className="text-[10px] uppercase font-bold text-text3 opacity-40 italic">Syncing...</span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-sm text-text3 italic">No subjects enrolled yet.</div>
                )}
              </div>
            </div>
          </section>

          {/* 3. Debug Section - Input */}
          {mlPayload && (
            <section className="fade-up-2">
              <details className="group glass-panel rounded-2xl overflow-hidden border-border/40 hover:border-accent/30 transition-all duration-300">
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none select-none bg-bg2/30 hover:bg-bg2/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent/10 text-accent">
                      <Database size={18} />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-bold text-text">Input Matrix</h3>
                      <p className="text-[11px] text-text3">Raw JSON payload being sent to ML prediction link</p>
                    </div>
                  </div>
                  <div className="text-text3 transition-transform duration-300 group-open:rotate-180">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                  </div>
                </summary>
                
                <div className="p-5 bg-black/5 dark:bg-black/20 border-t border-border/40">
                  <div className="mb-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-500 border border-orange-500/20 w-fit">
                    <Settings size={12} className="animate-spin-slow" />
                    <span className="text-[10px] font-bold uppercase tracking-widest truncate max-w-full">Active Link: https://neuro-ai-api-6zst.onrender.com/api/v1/predict</span>
                  </div>
                  
                  <div className="relative">
                    <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-text3 ml-1 flex items-center gap-2">
                       <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" /> Data Sent from Server
                    </div>
                    <pre className="p-4 rounded-xl bg-bg/80 border border-border/50 text-xs font-mono text-blue-500 dark:text-blue-400 overflow-x-auto max-h-[400px] scrollbar-thin">
{JSON.stringify({
  student_id: user?._id,
  features: mlPayload?.payload || {
    StudyHours: mlPayload?.StudyHours,
    Attendance: mlPayload?.Attendance,
    Resources: mlPayload?.Resources,
    OnlineCourses: mlPayload?.OnlineCourses,
    Discussions: mlPayload?.Discussions,
    AssignmentCompletion: mlPayload?.AssignmentCompletion,
    EduTech: mlPayload?.EduTech,
    Extracurricular: mlPayload?.Extracurricular
  }
}, null, 2)}
                    </pre>
                  </div>
                </div>
              </details>
            </section>
          )}

          {/* 4. Debug Section - Output */}
          {mlPayload && (
            <section className="fade-up-2 mt-6">
              <details className="group glass-panel rounded-2xl overflow-hidden border-border/40 hover:border-emerald-500/30 transition-all duration-300">
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none select-none bg-bg2/30 hover:bg-bg2/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                      <Database size={18} />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-bold text-text">Output Matrix</h3>
                      <p className="text-[11px] text-text3">Raw JSON response received from ML prediction link</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-text3 transition-transform duration-300 group-open:rotate-180">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                  </div>
                </summary>
                
                <div className="p-5 bg-black/5 dark:bg-black/20 border-t border-border/40">
                  <div className="relative">
                    <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-text3 ml-1 flex items-center gap-2">
                       <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Data Received from ML Engine
                    </div>
                    <pre className="p-4 rounded-xl bg-bg/80 border border-border/50 text-xs font-mono text-emerald-500 dark:text-emerald-400 overflow-x-auto max-h-[400px] scrollbar-thin">
{latest ? JSON.stringify(latest.rawResponse || latest, null, 2) : "No prediction data available"}
                    </pre>
                  </div>
                </div>
              </details>
            </section>
          )}
        </>
      )}
    </div>
  )
}
