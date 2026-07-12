import {
  Box,
  Image as ChkImage,
  SkeletonCircle,
  useColorModeValue,
} from '@chakra-ui/react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useEffect } from 'react'
import { avatarAnimation } from 'config/animations'

const AvatarImages = {
  DarkMode: '/avatars/CB_avatar.png',
  LightMode: '/avatars/CB_avatar_light.png',
}

// Module scope: defining motion(...) inside the component recreates the type on
// every render and remounts the subtree (replaying the entrance). Keep it stable.
const MotionBox = motion(Box)

declare global {
  interface Window {
    preloadedPictures?: HTMLImageElement[]
  }
}

const Avatar = () => {
  const prefersReducedMotion = useReducedMotion()
  const imgAvatar = useColorModeValue(
    AvatarImages.LightMode,
    AvatarImages.DarkMode
  )
  useEffect(() => {
    // Some nice preloading and caching
    const images = [AvatarImages.DarkMode, AvatarImages.LightMode]
    const preloadedImages = images.map((imageSrc) => {
      const img = new Image()
      img.src = imageSrc
      return img
    })
    window.preloadedPictures = preloadedImages
  }, [])
  return (
    <AnimatePresence>
      <MotionBox
        id="CBAvatar"
        boxSize={{ base: 64, lg: 'sm' }}
        padding={{ base: 8 }}
        marginBottom={{ base: 10, md: 0, lg: 0 }}
        initial={prefersReducedMotion ? 'animate' : 'initial'}
        animate={'animate'}
        variants={avatarAnimation}
        // Phased into the hero load cascade: the avatar lands alongside the
        // left column's role/description. delay merges with the variant's own
        // transition (which sets duration/ease but no delay).
        transition={{ delay: prefersReducedMotion ? 0 : 0.4 }}
        exit={{ opacity: 0 }}
      >
        <ChkImage
          src={imgAvatar}
          alt="Cantin Bartel Avatar"
          htmlWidth="250"
          htmlHeight="250"
          margin="auto"
          fallback={<SkeletonCircle height="100%" width="100%" />}
        />
      </MotionBox>
    </AnimatePresence>
  )
}

export default Avatar
