import i18nextConfig from './next-i18next.config.js'

const isProd = process.env.NODE_ENV === 'production'
const siteDomainEn = process.env.NEXT_PUBLIC_SITE_DOMAIN_EN || 'www.cantinbartel.dev'
const siteDomainFr = process.env.NEXT_PUBLIC_SITE_DOMAIN_FR || 'fr.cantinbartel.dev'

const domains = isProd
  ? [
      {
        domain: siteDomainEn,
        defaultLocale: 'en'
      },
      {
        domain: siteDomainFr,
        defaultLocale: 'fr'
      }
    ]
  : [
      {
        domain: 'localhost',
        defaultLocale: 'en',
        locales: ['en']
      },
      {
        domain: 'fr.localhost',
        defaultLocale: 'fr',
        locales: ['fr']
      }
    ]

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    ...i18nextConfig.i18n,
    domains
  }
}

export default nextConfig
