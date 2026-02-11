import { Stack, Box, Heading, Text, List, ListItem, ListIcon, Link, Container } from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import type { UserConfig } from 'next-i18next'
import { useTranslation } from 'next-i18next'
import Menu from 'components/Menu'
import OpenGraphHead from 'components/Misc/OpenGraphHead'
import i18nConfig from '../next-i18next.config'
import Head from 'next/head'
import NextLink from 'next/link'
import { HStack, Tag } from '@chakra-ui/react'

const FreelancePage = (): JSX.Element => {
  const { t } = useTranslation('common')
  const bullets = t('freelance.bullets', { returnObjects: true }) as string[]
  const faqs = t('freelance.faq.items', { returnObjects: true }) as Array<{
    q: string
    a: string
  }>

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }

  return (
    <>
      <OpenGraphHead
        title={t('seo.pages.freelance.title')}
        description={t('seo.pages.freelance.description')}
        keywords={t('seo.pages.freelance.keywords')}
      />
      <Head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </Head>

      <Menu />
      <Container maxW="container.lg" px={{ base: 6, md: 10 }} py={{ base: 10, md: 16 }}>
        <Stack spacing={{ base: 10, md: 12 }}>
          <Box as="header">
            <Heading as="h1" size="2xl" mb={4}>
              {t('freelance.hero.title')}
            </Heading>
            <Text variant="description">
              {t('freelance.hero.subtitle')}
            </Text>
            <HStack spacing={3} mt={5} wrap="wrap">
              <Tag as={NextLink} href="/freelance/paris" variant="subtle" colorScheme="teal">
                Paris (remote)
              </Tag>
              <Tag as={NextLink} href="/freelance/bruxelles" variant="subtle" colorScheme="teal">
                Bruxelles / Brussels (remote)
              </Tag>
            </HStack>
          </Box>

          <Box as="section">
            <Heading as="h2" size="xl" mb={4} style={{ fontVariantCaps: 'small-caps' }}>
              {t('freelance.services.title')}
            </Heading>
            <Text variant="description" textAlign="justify" mb={4}>
              {t('freelance.services.intro')}
            </Text>
            <List spacing={3}>
              {bullets.map((item) => (
                <ListItem key={item} display="flex" alignItems="flex-start">
                  <ListIcon as={CheckCircleIcon} color="teal.400" mt={0.5} />
                  <Text as="span">{item}</Text>
                </ListItem>
              ))}
            </List>
          </Box>

          <Box as="section">
            <Heading as="h2" size="xl" mb={4} style={{ fontVariantCaps: 'small-caps' }}>
              {t('freelance.remote.title')}
            </Heading>
            <Text variant="description" textAlign="justify">
              {t('freelance.remote.body')}
            </Text>
          </Box>

          <Box as="section">
            <Heading as="h2" size="xl" mb={4} style={{ fontVariantCaps: 'small-caps' }}>
              {t('freelance.process.title')}
            </Heading>
            <Text variant="description" textAlign="justify">
              {t('freelance.process.body')}
            </Text>
          </Box>

          <Box as="section">
            <Heading as="h2" size="xl" mb={4} style={{ fontVariantCaps: 'small-caps' }}>
              {t('freelance.cta.title')}
            </Heading>
            <Text variant="description">
              {t('freelance.cta.body')}{' '}
              <Link href="/#contact" color="teal.400" textDecoration="underline">
                {t('freelance.cta.link')}
              </Link>
              .
            </Text>
          </Box>

          <Box as="section">
            <Heading as="h2" size="xl" mb={4} style={{ fontVariantCaps: 'small-caps' }}>
              {t('freelance.faq.title')}
            </Heading>
            <Stack spacing={5}>
              {faqs.map((item) => (
                <Box key={item.q}>
                  <Heading as="h3" size="md" mb={2}>
                    {item.q}
                  </Heading>
                  <Text variant="description" textAlign="justify">
                    {item.a}
                  </Text>
                </Box>
              ))}
            </Stack>
          </Box>

          <Box as="footer" opacity={0.8}>
            <Text fontSize="sm">
              <Link href="/" color="teal.400" textDecoration="underline">
                {t('freelance.backHome')}
              </Link>
            </Text>
          </Box>
        </Stack>
      </Container>
    </>
  )
}

export default FreelancePage

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'], i18nConfig as UserConfig)),
    },
  }
}
