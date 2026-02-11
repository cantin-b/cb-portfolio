import { SITE_DOMAIN_EN, SITE_DOMAIN_FR } from './constants'

export type SupportedLocale = 'en' | 'fr'

const DEFAULT_PROTOCOL =
  process.env.NEXT_PUBLIC_SITE_PROTOCOL ||
  (process.env.NODE_ENV === 'production' ? 'https' : 'http')

export function getDomainForLocale(locale?: string): string {
  if (locale === 'fr') return SITE_DOMAIN_FR
  return SITE_DOMAIN_EN
}

export function getBaseUrlForLocale(locale?: string): string {
  return `${DEFAULT_PROTOCOL}://${getDomainForLocale(locale)}`
}

export function stripQueryAndHash(path: string): string {
  const [withoutHash] = path.split('#')
  const [withoutQuery] = withoutHash.split('?')
  return withoutQuery || '/'
}

export function toAbsoluteUrl(baseUrl: string, path: string): string {
  if (!path.startsWith('/')) return `${baseUrl}/${path}`
  return `${baseUrl}${path}`
}

export function getLocaleOg(locale?: string): string {
  return locale === 'fr' ? 'fr_FR' : 'en_US'
}
