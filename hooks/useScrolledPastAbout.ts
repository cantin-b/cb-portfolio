import { useEffect, useState } from 'react'

// Flip once the About section's bottom has scrolled up past ~40% of the viewport
// (roughly when the avatar has left) — matching where the old design switched.
const PAST_THRESHOLD = 0.4

/**
 * True once the About section has scrolled up out of the way. Position-driven: it
 * re-reads `#aboutMe`'s box on each scroll, so it flips deterministically on
 * position (never on direction) and is immune to elements remounting. SSR-safe:
 * false until measured on the client.
 */
const useScrolledPastAbout = (targetId = 'aboutMe'): boolean => {
  const [isPast, setIsPast] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    let frame = 0
    const compute = () => {
      frame = 0
      const el = document.getElementById(targetId)
      if (!el) return
      const { bottom } = el.getBoundingClientRect()
      setIsPast(bottom <= window.innerHeight * PAST_THRESHOLD)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(compute)
    }

    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [targetId])

  return isPast
}

export default useScrolledPastAbout
