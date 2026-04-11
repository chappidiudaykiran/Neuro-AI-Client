import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCourseById, saveWatchTime } from '../api/courses'
import { getMySubmissions } from '../api/assignments'
import YouTubePlayer from '../components/YouTubePlayer'
import FeedbackModal from '../components/FeedbackModal'
import StressBadge from '../components/StressBadge'
import AssignmentView from '../components/AssignmentView'
import { ArrowLeft } from 'lucide-react'

export default function VideoPlayer() {
  const { id } = useParams()
  const playerRef = useRef(null)

  const [course, setCourse] = useState(null)
  const [activeVideo, setActiveVideo] = useState(0)
  const [mySubmissions, setMySubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sessionStartTime] = useState(Date.now()) // Feedback modal timing
  const [hasShownFeedback, setHasShownFeedback] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [watchData, setWatchData] = useState(null)
  const [completedVideos, setCompleted] = useState(new Set())
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // Smoothly scroll exactly to the grid container
    if (playerRef.current) {
      playerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      window.scrollTo(0, 0)
    }

    setLoading(true)
    Promise.all([
      getCourseById(id),
      getMySubmissions(id).catch(() => ({ data: [] }))
    ])
      .then(([courseRes, subRes]) => {
        setCourse(courseRes.data)
        setMySubmissions(subRes.data)
      })
      .catch(() => setError('Course not found.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleVideoEnd = async (data) => {
    setWatchData(data)
    try {
      await saveWatchTime({
        subjectId: course._id,
        videoIndex: activeVideo,
        watchMinutes: data.watchMinutes,
        completionPct: data.completionPct,
      })
      setCompleted((prev) => new Set([...prev, activeVideo]))
    } catch {}
    setShowFeedback(true)
  }

  const handleFeedbackDone = () => {
    setShowFeedback(false)
    setWatchData(null)
    if (activeVideo < (course?.videos?.length ?? 0) - 1) {
      setTimeout(() => setActiveVideo((v) => v + 1), 400)
    }
  }

  if (loading) return <div className="page theme-video"><div className="loading-center"><div className="spinner" /></div></div>

  if (error || !course) {
    return (
      <div className="page theme-video">
        <div className="container">
          <div className="alert alert-error">{error || 'Course not found.'}</div>
          <Link to="/courses" className="btn btn-outline mt-3">Back to courses</Link>
        </div>
      </div>
    )
  }

  const video = activeVideo !== null ? course.videos?.[activeVideo] : null
  const totalCompleted = completedVideos.size
  const totalVideos = course.videos?.length ?? 0
  const progress = totalVideos ? Math.round((totalCompleted / totalVideos) * 100) : 0

  return (
    <div className="page theme-video">
      {showFeedback && watchData && (
        <FeedbackModal
          subject={course}
          watchData={watchData}
          onClose={() => setShowFeedback(false)}
          onSubmitted={handleFeedbackDone}
        />
      )}

      <div ref={playerRef} className="container pb-16 pt-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] items-start">
          <div className="flex flex-col min-w-0">
            <div className="-mt-2 mb-4 flex items-center gap-3 text-sm text-text2">
              <Link 
                to={`/courses/category/${course.category?.toLowerCase().replace(/\s+/g, '-')}`} 
                className="group inline-flex items-center gap-2 rounded-lg border border-border/40 bg-bg2/40 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-text2 backdrop-blur-md transition-all duration-300 hover:border-accent/40 hover:bg-bg2/60 hover:text-accent shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
                Return to {course.category || 'Subjects'}
              </Link>
              <span className="text-text3 opacity-40">/</span>
              <span className="truncate opacity-80">{course.name}</span>
            </div>

            <div className="mb-2">
              <div className="mb-1 flex flex-wrap items-center gap-2.5">
                <h1 className="font-heading text-xl font-extrabold tracking-tight">{course.name}</h1>
                <StressBadge tag={course.stressTag} />
              </div>
              {video && (
                <p className="text-xs text-text2">
                  Video {activeVideo + 1} of {totalVideos} - <strong className="text-text">{video.title}</strong>
                </p>
              )}
            </div>

            {video ? (
              <YouTubePlayer key={video.youtubeId} videoId={video.youtubeId} onVideoEnd={handleVideoEnd} />
            ) : (
              <div className="flex aspect-video items-center justify-center rounded-xl bg-bg2 text-text3 border border-border">Select a video from the playlist</div>
            )}

            <div className="mt-4">
              <div className="mb-1.5 flex justify-between text-xs text-text3">
                <span>Course progress</span>
                <span>{totalCompleted}/{totalVideos} completed</span>
              </div>
              <progress className="h-1.5 w-full overflow-hidden rounded bg-surface [&::-webkit-progress-bar]:bg-surface [&::-webkit-progress-value]:bg-accent [&::-moz-progress-bar]:bg-accent" max={100} value={progress} />
            </div>

            {course.description && (
              <div className="card mt-5">
                <h3 className="mb-2 font-heading text-sm font-bold">About this course</h3>
                <p className="text-[13px] leading-relaxed text-text2">{course.description}</p>
              </div>
            )}
          </div>

          <div className="card p-4 h-fit">
            <h3 className="mb-3.5 border-b border-border pb-3 font-heading text-sm font-bold shadow-sm">Playlist - {totalVideos} videos</h3>
            <div className="mb-3">
              <input
                type="text"
                placeholder="Search video topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-border bg-bg2 px-3 py-2 text-sm text-text outline-none transition focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>
            <div className="flex flex-col gap-1 max-h-[450px] lg:max-h-[600px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
              {(() => {
                const elements = [];
                let videoCount = 0;
                let moduleCount = 1;
                
                (course.videos || []).forEach((v, i) => {
                  if (v.title.toLowerCase().includes(searchQuery.toLowerCase().trim())) {
                    elements.push(
                      <button
                        key={`vid-${i}`}
                        onClick={() => setActiveVideo(i)}
                        className={`flex items-start gap-2.5 rounded-lg border-l-2 px-2.5 py-2.5 text-left transition ${activeVideo === i ? 'border-l-accent bg-accent/10 shadow-sm' : 'border-l-transparent hover:bg-bg3'}`}
                      >
                        <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded text-xs font-bold ${completedVideos.has(i)
                          ? 'bg-accent/20 text-accent'
                          : activeVideo === i
                            ? 'bg-accent/20 text-accent'
                            : 'bg-surface text-text3'}`}>
                          {completedVideos.has(i) ? 'OK' : i + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className={`truncate text-xs font-medium ${activeVideo === i ? 'text-accent' : completedVideos.has(i) ? 'text-text3' : 'text-text'}`}>{v.title}</div>
                          {v.duration > 0 && <div className={`mt-0.5 text-[11px] ${completedVideos.has(i) ? 'text-text3/50' : 'text-text3'}`}>{v.duration} min</div>}
                        </div>
                      </button>
                    )
                  }
                  
                  videoCount++;
                  if (videoCount === 5 || i === (course.videos || []).length - 1) {
                     const currentModule = moduleCount;
                     const isCompleted = mySubmissions.some(s => s.moduleNumber === currentModule && (s.subjectId === course._id || s.subjectId?._id === course._id))
                     elements.push(
                        <div key={`ass-wrap-${currentModule}`} className="my-3">
                          <Link
                            to={`/courses/${id}/assignment/${currentModule}`}
                            className={`w-full relative overflow-hidden flex items-center gap-3 rounded-xl p-3 text-left transition-all duration-300 bg-bg2/50 border ${isCompleted ? 'border-accent/30 hover:border-accent/50 shadow-sm bg-gradient-to-r from-accent/5 to-transparent' : 'border-border hover:border-accent/40'} hover:bg-bg3 hover:shadow-md`}
                          >
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg shadow-sm transition-colors ${isCompleted ? 'bg-accent text-white' : 'bg-surface text-text3'}`}>
                               {isCompleted ? (
                                 <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                               ) : (
                                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                               )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className={`truncate text-sm font-bold text-text`}>Module {currentModule} Knowledge Check</div>
                              <div className={`mt-0.5 text-xs font-semibold ${isCompleted ? 'text-accent' : 'text-text3'}`}>{isCompleted ? 'PASSED' : 'Multiple Choice Quiz'}</div>
                            </div>
                          </Link>
                        </div>
                     )
                     videoCount = 0;
                     moduleCount++;
                  }
                });
                return elements;
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
