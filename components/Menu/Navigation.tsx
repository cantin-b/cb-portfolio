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
// ----------
import { useRouter } from 'next/router'
import { SITE_DOMAIN_EN, SITE_DOMAIN_FR } from 'lib/constants'

const Navigation = () => {
  const { toggleColorMode, colorMode } = useColorMode()
  const MotionContainer = motion(Container)
  const [isOpen, toggleOpen] = useCycle(false, true)
  const isMobile = useBreakpointValue(mobileBreakpointsMap)
  const menuButtonSize = useBreakpointValue({
    base: 'xl',
    md: 'sm',
  })

  const bg = useColorModeValue(
    'rgba(237, 242, 247, 0.95)',
    'rgba(18, 18, 18, 0.9)'
  )

  const borderColor = useColorModeValue('teal.500', 'cyan.200')

  const IsDark = colorMode === ThemeMode.Dark
  const btnClassName = `${styles.blogBtn} ${!IsDark && styles.dark}`
  const Icon = IsDark ? SunIcon : MoonIcon

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
    const target = `${protocol}//${getTargetDomain()}${currentPath}`
    window.location.href = target
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
      _hover={{ opacity: 1 }}
      marginLeft={-0.5}
    >
      <Text
        as="span"
        fontWeight="bold"
        textDecoration="underline"
        color={IsDark ? '#9DECF9' : "#319795"}
      >
        {currentLocale?.toUpperCase()}
      </Text>
      <Text as="span" mx={1} opacity={0.5}>/</Text>
      <Text as="span" opacity={0.6}>{newLocale.toUpperCase()}</Text>
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
            aria-label="Color Mode"
            variant="ghost"
            icon={<Icon />}
            boxShadow="none"
            onClick={toggleColorMode}
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
          <Box
            width={{ base: '100%', lg: 'auto' }}
            textAlign={{ base: 'center', lg: 'left' }}
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
              href={`${homePrefix}#aboutMe`}
              rel="noreferrer"
              onClick={onMenuItemClick}
            >
              {t('navigation.about')}
            </Button>
          </Box>
          <Box
            width={{ base: '100%', lg: 'auto' }}
            textAlign={{ base: 'center', lg: 'left' }}
            marginY={{ base: 2, lg: 0 }}
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
              href={`${homePrefix}#services`}
              rel="noreferrer"
              onClick={onMenuItemClick}
            >
              {t('navigation.services')}
            </Button>
          </Box>
          <Box
            width={{ base: '100%', lg: 'auto' }}
            textAlign={{ base: 'center', lg: 'left' }}
            marginY={{ base: 2, lg: 0 }}
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
              href={`${homePrefix}#jobs`}
              rel="noreferrer"
              onClick={onMenuItemClick}
            >
              {t('navigation.experience')}
            </Button>
          </Box>
          <Box
            width={{ base: '100%', lg: 'auto' }}
            textAlign={{ base: 'center', lg: 'left' }}
            marginY={{ base: 2, lg: 0 }}
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
              href="/freelance"
              rel="noreferrer"
              onClick={onMenuItemClick}
            >
              {t('navigation.freelance')}
            </Button>
          </Box>
          <Box
            width={{ base: '100%', lg: 'auto' }}
            textAlign={{ base: 'center', lg: 'left' }}
            marginY={{ base: 2, lg: 0 }}
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
              href={`${homePrefix}#contact`}
              rel="noreferrer"
              onClick={onMenuItemClick}
            >
              {t('navigation.contact')}
            </Button>
          </Box>
          {!isMobile && (
            <Box>
              <Flex align="center">
                <IconButton
                  marginX={1}
                  aria-label="Color Mode"
                  variant="ghost"
                  icon={<Icon />}
                  boxShadow="none"
                  onClick={toggleColorMode}
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
