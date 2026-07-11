import { useEffect, useState } from 'react'

// Section ids in document order; these match the nav hashes in Navigation.tsx.
const SECTION_IDS = ['aboutMe', 'services', 'work', 'jobs', 'contact']

// Bias the "active" band to the vertical center of the viewport so a section
// counts as active only while it dominates the screen.
const ROOT_MARGIN = '-45% 0px -45% 0px'

/**
 * Tracks which section currently occupies the viewport center via an
 * IntersectionObserver. SSR-safe: returns null until observed on the client.
 */
const useActiveSection = (): string | null => {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return
    }

    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    )
    if (elements.length === 0) return

    const visible = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        })
        // Pick the first section (document order) inside the center band. If none
        // is (between sections), keep the last active id to avoid flicker.
        const next = SECTION_IDS.find((id) => visible.has(id))
        if (next) setActiveId(next)
      },
      { rootMargin: ROOT_MARGIN, threshold: 0 }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return activeId
}

export default useActiveSection
