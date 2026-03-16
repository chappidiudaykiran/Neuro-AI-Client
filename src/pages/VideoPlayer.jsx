import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCourseById, saveWatchTime } from '../api/courses'
import YouTubePlayer from '../components/YouTubePlayer'
import FeedbackModal from '../components/FeedbackModal'
import StressBadge from '../components/StressBadge'

export default function VideoPlayer() {
  const { id } = useParams()

  const [course, setCourse] = useState(null)
  const [activeVideo, setActiveVideo] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [watchData, setWatchData] = useState(null)
  const [completedVideos, setCompleted] = useState(new Set())

  useEffect(() => {
    getCourseById(id)
      .then((r) => setCourse(r.data))
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

  if (loading) return <div className="page"><div className="loading-center"><div className="spinner" /></div></div>

  if (error || !course) {
    return (
      <div className="page">
        <div className="container">
          <div className="alert alert-error">{error || 'Course not found.'}</div>
          <Link to="/courses" className="btn btn-outline mt-3">Back to courses</Link>
        </div>
      </div>
    )
  }

  const video = course.videos?.[activeVideo]
  const totalCompleted = completedVideos.size
  const totalVideos = course.videos?.length ?? 0
  const progress = totalVideos ? Math.round((totalCompleted / totalVideos) * 100) : 0

  return (
    <div className="page">
      {showFeedback && watchData && (
        <FeedbackModal
          subject={course}
          watchData={watchData}
          onClose={() => setShowFeedback(false)}
          onSubmitted={handleFeedbackDone}
        />
      )}

      <div className="container pb-16 pt-6">
        <div className="mb-6 flex items-center gap-2 text-sm text-text2">
          <Link to="/courses" className="text-text3 hover:text-text">Courses</Link>
          <span className="text-text3">/</span>
          <span>{course.name}</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <div className="mb-4">
              <div className="mb-2 flex flex-wrap items-center gap-2.5">
                <h1 className="font-heading text-2xl font-extrabold tracking-tight">{course.name}</h1>
                <StressBadge tag={course.stressTag} />
              </div>
              {video && (
                <p className="text-sm text-text2">
                  Video {activeVideo + 1} of {totalVideos} - <strong className="text-text">{video.title}</strong>
                </p>
              )}
            </div>

            {video ? (
              <YouTubePlayer key={video.youtubeId} videoId={video.youtubeId} onVideoEnd={handleVideoEnd} />
            ) : (
              <div className="flex aspect-video items-center justify-center rounded-xl bg-bg2 text-text3">No video available</div>
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

          <div className="card p-4">
            <h3 className="mb-3.5 border-b border-border pb-3 font-heading text-sm font-bold">Playlist - {totalVideos} videos</h3>
            <div className="flex flex-col gap-1">
              {course.videos?.map((v, i) => (
                <button
                  key={i}
                  onClick={() => setActiveVideo(i)}
                  className={`flex items-start gap-2.5 rounded-lg border-l-2 px-2.5 py-2.5 text-left transition ${activeVideo === i ? 'border-l-accent bg-accent/10' : 'border-l-transparent hover:bg-bg3'}`}
                >
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded text-xs font-bold ${completedVideos.has(i)
                    ? 'bg-green-500/20 text-green-300'
                    : activeVideo === i
                      ? 'bg-accent/20 text-accent'
                      : 'bg-surface text-text3'}`}>
                    {completedVideos.has(i) ? 'OK' : i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className={`truncate text-xs font-medium ${activeVideo === i ? 'text-accent' : 'text-text'}`}>{v.title}</div>
                    {v.duration && <div className="mt-0.5 text-[11px] text-text3">{v.duration} min</div>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
