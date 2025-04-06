import i18nextConfig from './next-i18next.config.js'

const isProd = process.env.NODE_ENV === 'production'

const domains = isProd
  ? [
      {
        domain: process.env.NEXT_PUBLIC_SITE_DOMAIN_EN,
        defaultLocale: 'en'
      },
      {
        domain: process.env.NEXT_PUBLIC_SITE_DOMAIN_FR,
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
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  i18n: {
    ...i18nextConfig.i18n,
    domains
  }
}

export default nextConfig
