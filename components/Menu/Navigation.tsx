import { memo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import {
  Container,
  Button,
  Flex,
  Box,
  IconButton,
  useColorMode,
  useColorModeValue,
  useBreakpointValue,
  Text
} from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { motion, useCycle, useReducedMotion, LayoutGroup } from 'framer-motion'
import styles from './styles.module.css'
import MobileMenu from './toggle'
import { ThemeMode, mobileBreakpointsMap } from 'config/theme'
import { easing, menuAnim, premiumEasing } from 'config/animations'
import useScrolledPastAbout from 'hooks/useScrolledPastAbout'
import useActiveSection from 'hooks/useActiveSection'
// ----------
import { useRouter } from 'next/router'
import { SITE_DOMAIN_EN, SITE_DOMAIN_FR } from 'lib/constants'
import { useColorModePreference } from 'hooks/useColorModePreference'

// Mirrors premiumEasing from config/animations.ts for CSS transitions.
const PREMIUM_CUBIC = `cubic-bezier(${premiumEasing.join(', ')})`

// Nav items in document order. `hash` matches the section ids in pages/index.tsx
// (and the ids observed by useActiveSection) so scroll-spy can light the match.
const NAV_ITEMS = [
  { hash: 'aboutMe', labelKey: 'navigation.about' },
  { hash: 'services', labelKey: 'navigation.services' },
  { hash: 'work', labelKey: 'navigation.work' },
  { hash: 'jobs', labelKey: 'navigation.experience' },
  { hash: 'contact', labelKey: 'navigation.contact' },
]

// Motion components MUST live at module scope. Defining `motion(...)` inside the
// component recreates a new component type on every render, so any re-render
// (e.g. the active section changing on scroll) unmounts and remounts the whole
// nav — replaying its entrance animation as a brutal "pop". Stable identities
// here keep the nav mounted; it updates in place, smoothly.
const MotionContainer = motion(Container)
const MotionFlex = motion(Flex)
const MotionBox = motion(Box)

const Navigation = () => {
  const { colorMode, setColorMode } = useColorMode()
  const { preference, setPreference } = useColorModePreference()
  const [isOpen, toggleOpen] = useCycle(false, true)
  const isMobile = useBreakpointValue(mobileBreakpointsMap)
  const menuButtonSize = useBreakpointValue({
    base: 'xl',
    md: 'sm',
  })

  const bg = useColorModeValue(
    'rgba(244, 247, 251, 0.95)',
    'rgba(16, 18, 22, 0.94)'
  )

  const borderColor = useColorModeValue('#263579', '#AEB9D6')
  // Accent applied to the active (scroll-spied) nav item.
  const activeColor = useColorModeValue('#263579', '#AEB9D6')
  const activeSection = useActiveSection()

  const IsDark = colorMode === ThemeMode.Dark
  const btnClassName = `${styles.blogBtn} ${!IsDark && styles.dark}`
  const ThemeIcon = IsDark ? SunIcon : MoonIcon

  const handleThemeToggle = () => {
    const next = IsDark ? 'light' : 'dark'
    setPreference(next)
    setColorMode(next)
  }

  const router = useRouter()
  const currentLocale = router.locale
  const currentPath = router.asPath
  const newLocale = currentLocale === 'en' ? 'fr' : 'en'
  const homePrefix = router.pathname === '/' ? '' : '/'

  const { t } = useTranslation('common')

  const getTargetDomain = () => {
    if (typeof window === 'undefined') return ''
    const currentHost = window.location.hostname

    if (newLocale === 'fr') {
      return currentHost.includes('localhost') ? 'fr.localhost:3000' : SITE_DOMAIN_FR
    } else {
      return currentHost.includes('localhost') ? 'localhost:3000' : SITE_DOMAIN_EN
    }
  }

  const handleLanguageSwitch = () => {
    const protocol = typeof window === 'undefined' ? 'https:' : window.location.protocol
    const target = new URL(`${protocol}//${getTargetDomain()}${currentPath}`)

    if (preference === 'light' || preference === 'dark') {
      target.searchParams.set('theme', preference)
    }

    window.location.href = target.toString()
  }

  const onMenuItemClick = useCallback(
    (e: React.MouseEvent<any>) => {
      e.stopPropagation()
      if (isMobile) {
        toggleOpen()
      }
    },
    [isMobile, toggleOpen]
  )

  // Desktop nav placement is driven by POSITION (have we left About?), not scroll
  // direction — so it flips exactly once at the boundary and stays put.
  const isPastAbout = useScrolledPastAbout()
  const prefersReducedMotion = useReducedMotion()
  // `displayedPastAbout` lags `isPastAbout`: it flips at the low point of the
  // opacity dip, so the row↔column / width reflow is hidden behind the cross-fade.
  const [displayedPastAbout, setDisplayedPastAbout] = useState(false)
  // Container opacity, driven declaratively so the show/hide reveal keeps working;
  // dips briefly during a header↔side switch to mask the layout reflow.
  const [dipOpacity, setDipOpacity] = useState(1)

  // Smooth single header↔side switch: dip opacity, swap the layout while it's
  // nearly invisible, then fade back. Instant (no dip) under reduced motion or on
  // mobile (where the desktop layout doesn't apply).
  useEffect(() => {
    // Settled (or already in sync): make sure the nav is fully visible. This also
    // recovers opacity if a fast boundary crossing cancelled a dip mid-way.
    if (isPastAbout === displayedPastAbout) {
      setDipOpacity(1)
      return
    }
    if (prefersReducedMotion || isMobile) {
      setDisplayedPastAbout(isPastAbout)
      return
    }
    setDipOpacity(0.08)
    const id = setTimeout(() => {
      setDisplayedPastAbout(isPastAbout)
      setDipOpacity(1)
    }, 170)
    return () => clearTimeout(id)
  }, [isPastAbout, displayedPastAbout, prefersReducedMotion, isMobile])

  const LanguageToggleButton = (
    <Button
      onClick={handleLanguageSwitch}
      variant="ghost"
      fontSize="sm"
      fontWeight="normal"
      opacity={0.8}
      transition="opacity 200ms cubic-bezier(0.22, 1, 0.36, 1)"
      _hover={{ opacity: 1 }}
      _focusVisible={{ opacity: 1 }}
      marginLeft={-0.5}
    >
      <Text
        as="span"
        fontWeight={currentLocale === 'en' ? 'bold' : 'normal'}
        textDecoration={currentLocale === 'en' ? 'underline' : 'none'}
        color={currentLocale === 'en' ? (IsDark ? '#AEB9D6' : '#263579') : 'inherit'}
        opacity={currentLocale === 'en' ? 1 : 0.6}
      >
        EN
      </Text>
      <Text as="span" mx={1} opacity={0.5}>/</Text>
      <Text
        as="span"
        fontWeight={currentLocale === 'fr' ? 'bold' : 'normal'}
        textDecoration={currentLocale === 'fr' ? 'underline' : 'none'}
        color={currentLocale === 'fr' ? (IsDark ? '#AEB9D6' : '#263579') : 'inherit'}
        opacity={currentLocale === 'fr' ? 1 : 0.6}
      >
        FR
      </Text>
    </Button>
  )

  return (
    <>
      <Box
        display={{ base: 'flex', xl: 'none' }}
        alignItems="center"
        paddingTop={1}
        className={styles.menuBar}
        zIndex={100}
        top="3%"
      >
        <Flex align="center">
          <IconButton
            aria-label="Theme"
            variant="ghost"
            icon={<ThemeIcon />}
            boxShadow="none"
            onClick={handleThemeToggle}
            padding={0}
          />
          <Text mx={2}>|</Text>
          {LanguageToggleButton}
        </Flex>
        <MobileMenu isDarkMode={IsDark} toggle={toggleOpen} isOpen={isOpen} />
      </Box>
      <MotionContainer
        width="100%"
        backgroundColor={bg}
        maxWidth={{ base: '100%', sm: '100%', lg: '50%', xl: '60%' }}
        className={styles.menu}
        right={{
          lg: !isMobile && displayedPastAbout ? '2%' : '3.5%',
        }}
        initial="hide"
        animate={(!isMobile || isOpen) && 'show'}
        // Morph the header↔side width/right smoothly (the item reflow is masked by
        // the inner cross-fade). Instant under reduced motion.
        sx={
          prefersReducedMotion
            ? undefined
            : {
                transition: `width 340ms ${PREMIUM_CUBIC}, right 340ms ${PREMIUM_CUBIC}`,
              }
        }
        style={{
          width: !isMobile && displayedPastAbout ? '12%' : '100%',
          top: !isOpen && isMobile && '-100vh',
          opacity: !isOpen && isMobile && '0',
          left: isOpen && isMobile && 0,
        }}
        borderColor={isOpen && isMobile && borderColor}
        borderBottomWidth={isOpen && isMobile && '1px'}
        paddingBottom={isOpen && isMobile && '1px'}
        ease={easing}
        variants={menuAnim}
        marginTop={0}
        paddingTop={1}
        as="nav"
      >
        <MotionFlex
          justifyContent={{ base: 'center', lg: 'flex-end' }}
          direction={{
            base: 'column',
            lg: displayedPastAbout ? 'column' : 'row',
          }}
          paddingX={{ base: '', sm: '10', lg: '0' }}
          paddingY={{
            base: '10',
            lg: displayedPastAbout ? '10' : '3',
          }}
          height={{ base: '100vh', lg: 'auto' }}
          paddingRight="0"
          paddingBottom={isMobile ? 10 : '0'}
          onClick={() => isMobile && toggleOpen()}
          // Cross-fade the nav items so the row↔column reflow is hidden.
          animate={{ opacity: dipOpacity }}
          transition={{ duration: 0.2, ease: premiumEasing }}
        >
          <LayoutGroup>
          {NAV_ITEMS.map((item, index) => {
            const isActive = activeSection === item.hash
            return (
              <Box
                key={item.hash}
                width={{ base: '100%', lg: 'auto' }}
                textAlign={{ base: 'center', lg: 'left' }}
                {...(index !== 0 && { marginY: { base: 2, lg: 0 } })}
              >
                <Button
                  fontWeight="light"
                  variant="ghost"
                  fontSize={menuButtonSize}
                  letterSpacing={2}
                  className={btnClassName}
                  padding={2}
                  marginX={2}
                  as="a"
                  href={`${homePrefix}#${item.hash}`}
                  rel="noreferrer"
                  onClick={onMenuItemClick}
                  aria-current={isActive ? 'true' : undefined}
                  // Active section keeps the accent text color. The underline is a
                  // SINGLE shared element (layoutId) that TRAVELS between items as
                  // the active section changes — echoing the scroll arc's gliding
                  // node — instead of popping on/off per item.
                  style={isActive ? { color: activeColor } : undefined}
                >
                  <Box
                    as="span"
                    className={styles.blogBtnLabel}
                    data-active={isActive ? '' : undefined}
                  >
                    {t(item.labelKey)}
                    {isActive && (
                      <MotionBox
                        layoutId="navActiveUnderline"
                        aria-hidden
                        position="absolute"
                        left={0}
                        right={0}
                        bottom="-0.12em"
                        height="0.1em"
                        borderRadius="full"
                        backgroundColor={activeColor}
                        transition={{
                          duration: prefersReducedMotion ? 0 : 0.42,
                          ease: premiumEasing,
                        }}
                      />
                    )}
                  </Box>
                </Button>
              </Box>
            )
          })}
          </LayoutGroup>
          {!isMobile && (
            <Box>
              <Flex align="center">
                <IconButton
                  marginX={1}
                  aria-label="Theme"
                  variant="ghost"
                  icon={<ThemeIcon />}
                  boxShadow="none"
                  onClick={handleThemeToggle}
                />
                <Text mx={2}>|</Text>
                {LanguageToggleButton}
              </Flex>
            </Box>
          )}
        </MotionFlex>
      </MotionContainer>
    </>
  )
}

export default memo(Navigation)
