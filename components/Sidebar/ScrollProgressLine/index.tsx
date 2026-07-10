import { memo } from 'react'
import { Box, useColorModeValue } from '@chakra-ui/react'
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion'
import { useHasMounted } from 'hooks/useHasMounted'
import { lineDrawVertical } from 'config/animations'

const MotionBox = motion(Box)

// Fade the very top/bottom ends of the track to transparent for an elegant seam.
const TRACK_MASK =
  'linear-gradient(to bottom, transparent 0%, #000 6%, #000 94%, transparent 100%)'
// Soften the traveling segment's ends so it reads as a gentle glowing dash.
const SEGMENT_MASK =
  'linear-gradient(to bottom, transparent 0%, #000 30%, #000 70%, transparent 100%)'

// A thin vertical line at the sidebar/content boundary that doubles as a page
// scroll-progress indicator: a low-contrast full-height track with a short accent
// segment that travels top->bottom as the page scrolls. lg/xl only.
const ScrollProgressLine = () => {
  const trackColor = useColorModeValue('#C9D3E1', '#323846')
  const accentColor = useColorModeValue('#263579', '#AEB9D6')
  const prefersReducedMotion = useReducedMotion()
  const hasMounted = useHasMounted()
  // Only apply the reduced-motion branch after mount so the server and first
  // client render match (useReducedMotion is false during SSR) — avoids a
  // hydration mismatch.
  const reduce = hasMounted && prefersReducedMotion

  const { scrollYProgress } = useScroll()
  // Spring-smoothed follow for a premium, slightly-lagging travel.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  })
  // Segment is ~20% tall, so travel its top from 0% -> 80% across the page.
  const segmentTop = useTransform(smoothProgress, [0, 1], ['0%', '80%'])

  // xl only: the sidebar/content columns sit side-by-side just at xl; below that
  // the grid stacks to a single column (globals.css), so a boundary line would
  // overlap the content. Hidden on mobile/tablet, matching where the layout stacks.
  const position = {
    display: { base: 'none', xl: 'block' },
    position: 'fixed' as const,
    top: 0,
    left: { xl: '39%' },
    height: '100vh',
    width: '2px',
    zIndex: 1,
    pointerEvents: 'none' as const,
  }

  // Reduced motion: a static, subtle line with no travel or draw-in.
  if (reduce) {
    return (
      <Box
        aria-hidden
        {...position}
        bg={trackColor}
        sx={{ maskImage: TRACK_MASK, WebkitMaskImage: TRACK_MASK }}
      />
    )
  }

  return (
    <MotionBox
      aria-hidden
      {...position}
      variants={lineDrawVertical}
      initial="initial"
      animate="animate"
      style={{ transformOrigin: 'top' }}
    >
      <Box
        position="absolute"
        inset={0}
        bg={trackColor}
        sx={{ maskImage: TRACK_MASK, WebkitMaskImage: TRACK_MASK }}
      />
      <MotionBox
        position="absolute"
        left={0}
        right={0}
        height="20%"
        bg={accentColor}
        borderRadius="full"
        style={{ top: segmentTop }}
        sx={{ maskImage: SEGMENT_MASK, WebkitMaskImage: SEGMENT_MASK }}
      />
    </MotionBox>
  )
}

export default memo(ScrollProgressLine)
