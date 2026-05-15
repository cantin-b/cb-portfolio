import { memo, useState } from 'react'
import { useColorMode, useBreakpointValue } from '@chakra-ui/react'
import Link from 'next/link'
import Image from 'next/image' 
import { motion, AnimatePresence } from 'framer-motion'
import styles from './styles.module.css'
import { ThemeMode, mobileBreakpointsMap } from 'config/theme'
import { simpleOpacity } from 'config/animations'

const MotionImage = motion(Image)

const Logo = () => {
  const { colorMode } = useColorMode()
  const [isLogoLoaded, setLogoLoaded] = useState(false)
  const isMobile = useBreakpointValue(mobileBreakpointsMap)
  const isDark = colorMode === ThemeMode.Dark

  const logoSrc = isDark
    ? '/logos/CB_logo_dark.png'
    : '/logos/cb-web-artisan-logo-no-subtitle.png'
  const logoWidth = isMobile ? 60 : 100
  const logoHeight = isMobile ? (isDark ? 60 : 27) : (isDark ? 100 : 45)

  return (
    <AnimatePresence>
      <Link
        href="/"
        passHref
        className={!isMobile ? styles.logo : styles.mobileLogo}
      >
        <MotionImage
          src={logoSrc}
          alt="Cantin Bartel Logo"
          width={logoWidth}
          height={logoHeight}
          onLoad={() => setLogoLoaded(true)}
          variants={simpleOpacity}
          initial="initial"
          animate={isLogoLoaded ? 'animate' : 'initial'}
          priority
        />
      </Link>
    </AnimatePresence>
  )
}

export default memo(Logo)
