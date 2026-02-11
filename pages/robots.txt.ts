import type { GetServerSideProps } from 'next'

const Robots = () => null

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const host = req.headers.host || ''
  const protocolHeader = req.headers['x-forwarded-proto']
  const protocol =
    (Array.isArray(protocolHeader) ? protocolHeader[0] : protocolHeader)?.split(',')[0] ||
    'https'

  const baseUrl = host ? `${protocol}://${host}` : 'https://www.cantinbartel.dev'
  const body = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800')
  res.write(body)
  res.end()

  return { props: {} }
}

export default Robots

