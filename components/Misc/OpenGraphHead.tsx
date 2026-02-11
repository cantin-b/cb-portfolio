import Head from 'next/head'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { getBaseUrlForLocale, getLocaleOg, stripQueryAndHash, toAbsoluteUrl } from 'lib/seo'

const DEFAULT_OG_IMAGE_PATH = '/avatars/CB_avatar.png'

const OpenGraphHead = () => {
  const router = useRouter()
  const { t } = useTranslation('common')

  const locale = router.locale || 'en'
  const baseUrl = getBaseUrlForLocale(locale)
  const path = stripQueryAndHash(router.asPath || '/')
  const canonicalUrl = toAbsoluteUrl(baseUrl, path)
  const ogImageUrl = toAbsoluteUrl(baseUrl, DEFAULT_OG_IMAGE_PATH)

  const title = t('seo.title')
  const description = t('seo.description')
  const keywords = t('seo.keywords')

  const enBaseUrl = getBaseUrlForLocale('en')
  const frBaseUrl = getBaseUrlForLocale('fr')
  const enUrl = toAbsoluteUrl(enBaseUrl, path)
  const frUrl = toAbsoluteUrl(frBaseUrl, path)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'Cantin Bartel',
        url: baseUrl,
        inLanguage: locale,
      },
      {
        '@type': 'WebPage',
        url: canonicalUrl,
        name: title,
        description,
        inLanguage: locale,
      },
      {
        '@type': 'Person',
        name: 'Cantin Bartel',
        url: baseUrl,
        image: ogImageUrl,
        jobTitle: t('sidebar.role'),
        sameAs: [
          'https://github.com/cantin-b',
          'https://www.linkedin.com/in/cantin-bartel/',
        ],
        knowsAbout: [
          'Node.js',
          'React',
          'Next.js',
          'TypeScript',
          'SaaS',
          'CRM',
          'API',
          'AI Engineering',
        ],
      },
    ],
  }

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Cantin Bartel" />
      <meta name="robots" content="index,follow,max-image-preview:large" />

      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="fr" href={frUrl} />
      <link rel="alternate" hrefLang="x-default" href={enUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Cantin Bartel" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content={getLocaleOg(locale)} />
      <meta
        property="og:locale:alternate"
        content={locale === 'fr' ? 'en_US' : 'fr_FR'}
      />
      <meta property="og:image" content={ogImageUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Head>
  )
}

export default OpenGraphHead
