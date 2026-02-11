import type { GetServerSideProps } from 'next'
import { getBaseUrlForLocale, toAbsoluteUrl } from 'lib/seo'

const SITE_PATHS = [
  '/' as const,
  '/freelance' as const,
  '/freelance/paris' as const,
  '/freelance/bruxelles' as const,
]

function buildSitemapXml() {
  const enBaseUrl = getBaseUrlForLocale('en')
  const frBaseUrl = getBaseUrlForLocale('fr')
  const lastmod = new Date().toISOString()

  const urlset = SITE_PATHS.map((path) => {
    const enUrl = toAbsoluteUrl(enBaseUrl, path)
    const frUrl = toAbsoluteUrl(frBaseUrl, path)
    return `
  <url>
    <loc>${enUrl}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="fr" href="${frUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}" />
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`
  }).join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlset}
</urlset>`
}

const Sitemap = () => null

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const xml = buildSitemapXml()

  res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800')
  res.write(xml)
  res.end()

  return { props: {} }
}

export default Sitemap
