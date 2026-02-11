import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider, useColorMode } from '@chakra-ui/react'
import { AnimatePresence } from 'framer-motion'
import theme from 'config/theme'
import FavIconProvider from 'components/Misc/FavIconProvider'
import { appWithTranslation } from 'next-i18next'
import { useColorModePreference } from 'hooks/useColorModePreference'
import { useEffect } from 'react'

function getSystemColorMode(): 'light' | 'dark' {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function ColorModeSync() {
  const { preference } = useColorModePreference()
  const { setColorMode } = useColorMode()

  useEffect(() => {
    if (preference === 'light' || preference === 'dark') {
      setColorMode(preference)
      return
    }

    setColorMode(getSystemColorMode())

    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e: MediaQueryListEvent) => setColorMode(e.matches ? 'dark' : 'light')

    if (typeof mql.addEventListener === 'function') mql.addEventListener('change', onChange)
    else mql.addListener(onChange)

    return () => {
      if (typeof mql.removeEventListener === 'function') mql.removeEventListener('change', onChange)
      else mql.removeListener(onChange)
    }
  }, [preference, setColorMode])

  return null
}

function CBSite({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <AnimatePresence mode="wait">
      <ChakraProvider theme={theme}>
        <ColorModeSync />
        <FavIconProvider>
          <Component {...pageProps} />
        </FavIconProvider>
      </ChakraProvider>
    </AnimatePresence>
  )
}
export default appWithTranslation(CBSite)
