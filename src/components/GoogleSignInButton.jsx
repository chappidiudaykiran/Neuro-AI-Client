import { useEffect, useRef } from 'react'

const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client'

const loadGoogleScript = () => new Promise((resolve, reject) => {
  const existing = document.querySelector(`script[src="${GOOGLE_SCRIPT_SRC}"]`)
  if (existing) {
    if (window.google?.accounts?.id) return resolve()
    existing.addEventListener('load', () => resolve(), { once: true })
    existing.addEventListener('error', () => reject(new Error('Failed to load Google script.')), { once: true })
    return
  }

  const script = document.createElement('script')
  script.src = GOOGLE_SCRIPT_SRC
  script.async = true
  script.defer = true
  script.onload = () => resolve()
  script.onerror = () => reject(new Error('Failed to load Google script.'))
  document.head.appendChild(script)
})

export default function GoogleSignInButton({ onCredential, onError }) {
  const containerRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    const mountButton = async () => {
      try {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
        if (!clientId) {
          onError?.('Google Client ID is missing in frontend environment.')
          return
        }

        await loadGoogleScript()
        if (cancelled || !containerRef.current || !window.google?.accounts?.id) return

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (!response?.credential) {
              onError?.('Google did not return a credential token.')
              return
            }
            onCredential(response.credential)
          },
        })

        containerRef.current.innerHTML = ''
        window.google.accounts.id.renderButton(containerRef.current, {
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          width: 320,
          text: 'continue_with',
        })
      } catch (err) {
        onError?.(err.message || 'Google sign-in setup failed.')
      }
    }

    mountButton()

    return () => {
      cancelled = true
    }
  }, [onCredential, onError])

  return <div ref={containerRef} className="flex justify-center" />
}
