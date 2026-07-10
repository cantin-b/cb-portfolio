import { memo, useEffect, useRef, useState } from 'react'
import { Box, useColorModeValue } from '@chakra-ui/react'
import {
  motion,
  useScroll,
  useSpring,
  useMotionValue,
  useReducedMotion,
} from 'framer-motion'
import { simpleOpacity } from 'config/animations'

const MotionBox = motion(Box)

// Gutter band the arc lives in (between the intro text ~27% and the content ~35%).
const BAND_LEFT = 0.28
const BAND_WIDTH = 0.06

// A fixed, full-height SVG arc in the sidebar/content gutter that doubles as a page
// scroll-progress indicator: a faint track arc + an accent arc that draws itself from
// top to the reader's scroll position, with a small accent point riding its head.
// Echoes the site's old signature curve, far subtler. xl only.
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

  // Measure the viewport so the SVG uses a 1:1 pixel viewBox (no stroke/point
  // distortion). Rendered only after mount, so SSR/first client render match.
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null)
  useEffect(() => {
    const update = () => setDims({ w: window.innerWidth, h: window.innerHeight })
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // The traveling point rides the head of the drawn arc.
  const pathRef = useRef<SVGPathElement>(null)
  const cx = useMotionValue(0)
  const cy = useMotionValue(0)
  useEffect(() => {
    const path = pathRef.current
    if (!path) return
    const len = path.getTotalLength()
    const setPoint = (v: number) => {
      const clamped = Math.min(Math.max(v, 0), 1)
      const pt = path.getPointAtLength(clamped * len)
      cx.set(pt.x)
      cy.set(pt.y)
    }
    setPoint(smoothProgress.get())
    const unsubscribe = smoothProgress.on('change', setPoint)
    return unsubscribe
  }, [dims, smoothProgress, cx, cy])

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
        </defs>
        <path
          ref={pathRef}
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
              strokeWidth={1.8}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{ pathLength: smoothProgress }}
            />
            <motion.circle
              cx={cx}
              cy={cy}
              r={4}
              fill={accentColor}
              style={{ filter: `drop-shadow(0 0 4px ${accentColor})` }}
            />
          </>
        )}
      </svg>
    </MotionBox>
  )
}

export default memo(ScrollProgressArc)
