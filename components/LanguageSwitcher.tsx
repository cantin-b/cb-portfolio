import { HStack, Button } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { SITE_DOMAIN_EN, SITE_DOMAIN_FR } from '../lib/constants'

export default function LanguageSwitcher() {
  const router = useRouter()
  const currentLocale = router.locale
  const currentPath = router.asPath

  const newLocale = currentLocale === 'en' ? 'fr' : 'en'

  const getTargetDomain = () => {
    if (typeof window === 'undefined') return ''
    const currentHost = window.location.hostname
    return newLocale === 'fr'
      ? currentHost.includes('localhost') ? 'fr.localhost:3000' : SITE_DOMAIN_FR
      : currentHost.includes('localhost') ? 'localhost:3000' : SITE_DOMAIN_EN
  }

  const handleClick = () => {
    const target = `http://${getTargetDomain()}${currentPath}`
    window.location.href = target
  }

  return (
    <HStack spacing={1} fontSize="sm" opacity={0.6} _hover={{ opacity: 1 }}>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
        px={2}
        fontWeight="normal"
      >
        {newLocale.toUpperCase()}
      </Button>
    </HStack>
  )
}
