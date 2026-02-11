import {
  Stack,
  Box,
  Heading,
  Text,
  List,
  ListItem,
  ListIcon,
  Link,
  Container,
} from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'
import Head from 'next/head'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import type { UserConfig } from 'next-i18next'
import { useTranslation } from 'next-i18next'
import Menu from 'components/Menu'
import OpenGraphHead from 'components/Misc/OpenGraphHead'
import i18nConfig from '../../next-i18next.config'

const FreelanceBruxellesPage = (): JSX.Element => {
  const { t } = useTranslation('common')
  const bullets = t('freelanceCities.bruxelles.bullets', { returnObjects: true }) as string[]
  const faqs = t('freelanceCities.bruxelles.faq.items', { returnObjects: true }) as Array<{
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
        title={t('seo.pages.freelanceBruxelles.title')}
        description={t('seo.pages.freelanceBruxelles.description')}
        keywords={t('seo.pages.freelanceBruxelles.keywords')}
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
              {t('freelanceCities.bruxelles.hero.title')}
            </Heading>
            <Text variant="description">
              {t('freelanceCities.bruxelles.hero.subtitle')}
            </Text>
          </Box>

          <Box as="section">
            <Heading as="h2" size="xl" mb={4} style={{ fontVariantCaps: 'small-caps' }}>
              {t('freelanceCities.bruxelles.why.title')}
            </Heading>
            <Text variant="description" textAlign="justify">
              {t('freelanceCities.bruxelles.why.body')}
            </Text>
          </Box>

          <Box as="section">
            <Heading as="h2" size="xl" mb={4} style={{ fontVariantCaps: 'small-caps' }}>
              {t('freelanceCities.bruxelles.services.title')}
            </Heading>
            <Text variant="description" textAlign="justify" mb={4}>
              {t('freelanceCities.bruxelles.services.intro')}
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
              {t('freelanceCities.bruxelles.cta.title')}
            </Heading>
            <Text variant="description">
              {t('freelanceCities.bruxelles.cta.body')}{' '}
              <Link href="/#contact" color="teal.400" textDecoration="underline">
                {t('freelanceCities.bruxelles.cta.link')}
              </Link>
              .
            </Text>
          </Box>

          <Box as="section">
            <Heading as="h2" size="xl" mb={4} style={{ fontVariantCaps: 'small-caps' }}>
              {t('freelanceCities.bruxelles.faq.title')}
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
              <Link href="/freelance" color="teal.400" textDecoration="underline">
                {t('freelanceCities.backToFreelance')}
              </Link>
            </Text>
          </Box>
        </Stack>
      </Container>
    </>
  )
}

export default FreelanceBruxellesPage

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'], i18nConfig as UserConfig)),
    },
  }
}

