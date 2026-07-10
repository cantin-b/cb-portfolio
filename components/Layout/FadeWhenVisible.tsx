import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { stagger } from 'config/animations'

// Reveals its section once when scrolled into view, then propagates the "animate"
// variant label to descendant motion items (the section heading + content), which
// cascade via their own `stagger` container. With reduced motion, everything starts
// in the "animate" (fully visible) state so nothing is hidden or mid-transform.
const FadeInWhenVisible = ({ children }: { children: React.ReactNode }) => {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      style={{ margin: 0 }}
      variants={stagger}
      initial={prefersReducedMotion ? 'animate' : 'initial'}
      whileInView="animate"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  )
}

export default FadeInWhenVisible
