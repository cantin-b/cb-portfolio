import { memo, useCallback } from 'react'
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
import { motion, useCycle } from 'framer-motion'
import styles from './styles.module.css'
import MobileMenu from './toggle'
import { ThemeMode, mobileBreakpointsMap } from 'config/theme'
import { easing, menuAnim } from 'config/animations'
import useScrollDirection, { ScrollDirection } from 'hooks/useScrollDirection'
import useActiveSection from 'hooks/useActiveSection'
// ----------
import { useRouter } from 'next/router'
import { SITE_DOMAIN_EN, SITE_DOMAIN_FR } from 'lib/constants'
import { useColorModePreference } from 'hooks/useColorModePreference'

// Nav items in document order. `hash` matches the section ids in pages/index.tsx
// (and the ids observed by useActiveSection) so scroll-spy can light the match.
const NAV_ITEMS = [
  { hash: 'aboutMe', labelKey: 'navigation.about' },
  { hash: 'services', labelKey: 'navigation.services' },
  { hash: 'work', labelKey: 'navigation.work' },
  { hash: 'jobs', labelKey: 'navigation.experience' },
  { hash: 'contact', labelKey: 'navigation.contact' },
]

const Navigation = () => {
  const { colorMode, setColorMode } = useColorMode()
  const { preference, setPreference } = useColorModePreference()
  const MotionContainer = motion(Container)
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
  const scrollDirection = useScrollDirection()

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
          lg:
            !isMobile && scrollDirection === ScrollDirection.Down
              ? '2%'
              : '3.5%',
        }}
        initial="hide"
        animate={(!isMobile || isOpen) && 'show'}
        style={{
          width:
            !isMobile && scrollDirection === ScrollDirection.Down
              ? '12%'
              : '100%',
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
        <Flex
          justifyContent={{ base: 'center', lg: 'flex-end' }}
          direction={{
            base: 'column',
            lg: scrollDirection === ScrollDirection.Down ? 'column' : 'row',
          }}
          paddingX={{ base: '', sm: '10', lg: '0' }}
          paddingY={{
            base: '10',
            lg: scrollDirection === ScrollDirection.Down ? '10' : '3',
          }}
          height={{ base: '100vh', lg: 'auto' }}
          paddingRight="0"
          paddingBottom={isMobile ? 10 : '0'}
          onClick={() => isMobile && toggleOpen()}
        >
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
                  // Persistent accent + underline for the active section. The
                  // underline animates in via .blogBtn's 200ms text-decoration
                  // transition; inline styles win over the class.
                  style={
                    isActive
                      ? { color: activeColor, textDecorationColor: activeColor }
                      : undefined
                  }
                >
                  {t(item.labelKey)}
                </Button>
              </Box>
            )
          })}
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
        </Flex>
      </MotionContainer>
    </>
  )
}

export default memo(Navigation)
