import { memo, useEffect, useState } from 'react'
import { Box, useColorModeValue } from '@chakra-ui/react'
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion'
import { simpleOpacity } from 'config/animations'

const MotionBox = motion(Box)

// Gutter band the arc lives in (between the intro text ~27% and the content ~35%).
const BAND_LEFT = 0.28
const BAND_WIDTH = 0.06

// Length of the gliding segment as a fraction of the arc (tunable 0.14–0.20).
const SEGMENT_LENGTH = 0.16

// A fixed, full-height SVG arc in the sidebar/content gutter that doubles as a page
// scroll-progress indicator: a faint track arc with a single soft glowing segment
// that glides along the curve to the reader's scroll position — no fill, no hard
// point. Echoes the site's old signature curve, far subtler. xl only.
const ScrollProgressArc = () => {
  const trackColor = useColorModeValue('#C9D3E1', '#323846')
  const accentColor = useColorModeValue('#263579', '#AEB9D6')
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll()
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  })
  // The arc is normalized to a path length of 1 (pathLength="1"), so a dash of
  // SEGMENT_LENGTH followed by a large gap yields a single traveling dash. A
  // negative stroke-dashoffset glides that dash forward along the path: 0 keeps it
  // at the top, -(1 - SEGMENT_LENGTH) puts it at the bottom. Clamped so spring
  // overshoot never runs it off the ends.
  const dashOffset = useTransform(
    smoothProgress,
    [0, 1],
    [0, -(1 - SEGMENT_LENGTH)],
    { clamp: true }
  )

  // Measure the viewport so the SVG uses a 1:1 pixel viewBox (no stroke distortion).
  // Rendered only after mount, so SSR/first client render match.
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null)
  useEffect(() => {
    const update = () => setDims({ w: window.innerWidth, h: window.innerHeight })
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  if (!dims) return null

  const bandLeft = dims.w * BAND_LEFT
  const w = dims.w * BAND_WIDTH
  const h = dims.h
  // Gentle vertical bow convex toward the content side (right).
  const sx = w * 0.32
  const cxp = w * 0.92
  const ex = w * 0.32
  const d = `M ${sx} ${h * 0.04} Q ${cxp} ${h * 0.5} ${ex} ${h * 0.96}`

  return (
    <MotionBox
      aria-hidden
      display={{ base: 'none', xl: 'block' }}
      position="fixed"
      top={0}
      left={`${bandLeft}px`}
      width={`${w}px`}
      height="100vh"
      zIndex={1}
      pointerEvents="none"
      variants={simpleOpacity}
      initial={prefersReducedMotion ? false : 'initial'}
      animate="animate"
    >
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        fill="none"
        style={{ overflow: 'visible', display: 'block' }}
      >
        <defs>
          <linearGradient id="arcTrackFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={trackColor} stopOpacity="0" />
            <stop offset="0.08" stopColor={trackColor} stopOpacity="0.75" />
            <stop offset="0.92" stopColor={trackColor} stopOpacity="0.75" />
            <stop offset="1" stopColor={trackColor} stopOpacity="0" />
          </linearGradient>
          {/* Feather the segment: a wide soft glow + a lightly-blurred core, so
              the dash has no hard edges. */}
          <filter id="arcSegmentGlow" x="-60%" y="-10%" width="220%" height="120%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
          <filter id="arcSegmentCore" x="-60%" y="-10%" width="220%" height="120%">
            <feGaussianBlur stdDeviation="0.8" />
          </filter>
        </defs>
        {/* Faint full track — never drawn in accent. */}
        <path
          d={d}
          stroke="url(#arcTrackFade)"
          strokeWidth={1.6}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {!prefersReducedMotion && (
          <>
            <motion.path
              d={d}
              stroke={accentColor}
              strokeWidth={3.2}
              strokeOpacity={0.4}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              filter="url(#arcSegmentGlow)"
              pathLength={1}
              strokeDasharray={`${SEGMENT_LENGTH} 1`}
              style={{ strokeDashoffset: dashOffset }}
            />
            <motion.path
              d={d}
              stroke={accentColor}
              strokeWidth={1.8}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              filter="url(#arcSegmentCore)"
              pathLength={1}
              strokeDasharray={`${SEGMENT_LENGTH} 1`}
              style={{ strokeDashoffset: dashOffset }}
            />
          </>
        )}
      </svg>
    </MotionBox>
  )
}

export default memo(ScrollProgressArc)
