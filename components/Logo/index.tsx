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

  const logoSrc = colorMode === ThemeMode.Dark ? '/logos/CB_logo_dark.png' : '/logos/CB_logo.png'

  return (
    <AnimatePresence>
      <Link href="/" passHref>
        <MotionImage
          className={!isMobile ? styles.logo : ''}
          src={logoSrc}
          alt="Cantin Bartel Logo"
          width={isMobile ? 60 : 100}
          height={isMobile ? 60 : 100}
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
