import { useEffect, useRef } from 'react'
import { useWatchTimer } from '../hooks/useWatchTimer'

let ytScriptLoaded = false

function loadYTScript(cb) {
  if (ytScriptLoaded) { cb(); return }
  const tag = document.createElement('script')
  tag.src = 'https://www.youtube.com/iframe_api'
  document.head.appendChild(tag)
  window.onYouTubeIframeAPIReady = () => { ytScriptLoaded = true; cb() }
}

export default function YouTubePlayer({ videoId, onVideoEnd, onProgress }) {
  const playerRef = useRef(null)
  const containerRef = useRef(null)
  const { start, pause, getMinutes, reset } = useWatchTimer()

  useEffect(() => {
    let player

    loadYTScript(() => {
      player = new window.YT.Player(containerRef.current, {
        videoId,
        width: '100%',
        height: '100%',
        playerVars: {
          autoplay: 0,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onStateChange: (e) => {
            const S = window.YT.PlayerState
            if (e.data === S.PLAYING) {
              start()
            } else if (e.data === S.PAUSED || e.data === S.BUFFERING) {
              pause()
            } else if (e.data === S.ENDED) {
              pause()
              const mins = getMinutes()
              const duration = player.getDuration() / 60
              const pct = Math.min(100, Math.round((mins / duration) * 100))
              onVideoEnd?.({ watchMinutes: mins, completionPct: pct })
              reset()
            }
          },
        },
      })
      playerRef.current = player
    })

    return () => {
      pause()
      player?.destroy?.()
    }
  }, [videoId])

  return (
    <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
      <div ref={containerRef} className="absolute inset-0 h-full w-full" />
    </div>
  )
}
