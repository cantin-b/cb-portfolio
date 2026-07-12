const DURATIONS = {
  VeryFast: 0.3,
  Fast: 0.6,
  Normal: 0.8,
  Slow: 1.2,
  VerySlow: 1.8,
}
const easing = [0.6, -0.05, 0.01, 0.99]
const premiumEasing = [0.22, 1, 0.36, 1]

const fadeInUp = {
  initial: {
    y: 60,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: DURATIONS.Fast,
      ease: easing,
    },
  },
}

const fadeInUpSlower = {
  initial: {
    y: 80,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: DURATIONS.Normal,
      ease: easing,
    },
  },
}

const letterSpace = {
  initial: {
    opacity: 0,
  },
  animate: {
    letterSpacing: ['0px', '-10px', '0px'],
    opacity: 1,
    transition: {
      duration: DURATIONS.Slow,
      ease: easing,
    },
  },
}

const nameReveal = {
  initial: {},
  animate: {
    transition: {
      delayChildren: 0.05,
      staggerChildren: 0.14,
    },
  },
}

const nameLineReveal = {
  initial: {
    y: '110%',
    opacity: 1,
  },
  animate: {
    y: '0%',
    opacity: 1,
    transition: {
      duration: DURATIONS.Normal,
      ease: premiumEasing,
    },
  },
}

const simpleOpacity = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: DURATIONS.Fast,
      ease: easing,
    },
  },
}

const scaleUp = {
  initial: {
    scale: 0,
    opacity: 0,
  },
  animate: {
    opacity: [0, 1],
    scale: [1, 1.05, 1],
    transition: {
      duration: DURATIONS.VerySlow,
      ease: easing,
    },
  },
  lightMode: {
    opacity: [0, 1],
    scale: [0.99, 1.05, 1],
    transition: {
      duration: DURATIONS.VerySlow,
      ease: easing,
    },
  },
}

const menuAnim = {
  show: {
    y: 0,
    opacity: 1,
    transition: {
      ease: easing,
      duration: DURATIONS.VeryFast,
    },
  },
  hide: {
    opacity: 0,
    y: -100,
    transition: {
      ease: easing,
      duration: DURATIONS.VeryFast,
    },
  },
}

const avatarAnimation = {
  initial: {
    opacity: 0,
    y: 60,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: DURATIONS.Fast,
      ease: easing,
    },
  },
  exit: {
    opacity: 0,
  },
}

const lineDraw = {
  initial: {
    scaleX: 0,
  },
  animate: {
    scaleX: 1,
    transition: {
      duration: DURATIONS.Normal,
      ease: premiumEasing,
    },
  },
}

// Gentle top-anchored draw-in for a vertical line (e.g. the scroll-progress track).
const lineDrawVertical = {
  initial: {
    scaleY: 0,
    opacity: 0,
  },
  animate: {
    scaleY: 1,
    opacity: 1,
    transition: {
      duration: DURATIONS.Slow,
      ease: premiumEasing,
    },
  },
}

// Gentle section-reveal rise (opacity + small y). Deliberately softer than
// fadeInUp/fadeInUpSlower so the whole-page cascade stays restrained.
const revealItem = {
  initial: {
    y: 24,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: DURATIONS.Fast,
      ease: premiumEasing,
    },
  },
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

// Hero page-load orchestration. Two phased stagger containers coordinate the
// hero's three independent subtrees (left column, avatar, right panel) into one
// cascade so it "writes itself" as a single sequence instead of separate pops.
// Item variants (revealItem, nameReveal, nameLineReveal) are reused unchanged.
const heroStaggerLead = {
  initial: {},
  animate: {
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.12,
    },
  },
}

// The right "WHAT I DO" panel follows the left column: it starts its own inner
// cascade a beat later so the eye reads the left column first, then the right.
const heroStaggerFollow = {
  initial: {},
  animate: {
    transition: {
      delayChildren: 0.45,
      staggerChildren: 0.1,
    },
  },
}
const galleryStagger = {
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
}

export {
  DURATIONS,
  easing,
  premiumEasing,
  fadeInUp,
  fadeInUpSlower,
  letterSpace,
  lineDraw,
  lineDrawVertical,
  revealItem,
  nameReveal,
  nameLineReveal,
  stagger,
  heroStaggerLead,
  heroStaggerFollow,
  galleryStagger,
  simpleOpacity,
  menuAnim,
  scaleUp,
  avatarAnimation,
}
