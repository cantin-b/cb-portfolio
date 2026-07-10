import {
  Grid,
  GridItem,
  Stack,
  Box,
  useBreakpointValue,
} from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import Script from 'next/script'
import OpenGraphHead from 'components/Misc/OpenGraphHead'
import FadeInLayout from 'components/Layout/FadeWhenVisible'
import Menu from 'components/Menu'
import Sidebar from 'components/Sidebar'
import Avatar from 'components/Avatar'
import About from 'components/Sections/About'
import Experience from 'components/Sections/Experience'
import Services from 'components/Sections/Services'
import SelectedWork from 'components/Sections/SelectedWork'
import ScrollMore from 'components/Misc/ScrollMore'
import { Article } from 'types/article'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import type { UserConfig } from 'next-i18next'
import i18nConfig from '../next-i18next.config'

// These are on bottom sections so no need to render it instantly
const GetInTouch = dynamic(() => import('components/Sections/GetInTouch'))

const Portfolio = ({ articles }: { articles: Article[] }): JSX.Element => {
  const sideBarPadding = useBreakpointValue({ base: '5', md: '8', lg: '14' })
  const mainContent = useBreakpointValue({
    base: '5',
    md: '14',
    lg: '14',
    xl: 0,
  })
  const paddTop = useBreakpointValue({ base: '20', sm: 20, md: 20 })
  // Anchor-scroll offset so the fixed Menu doesn't overlap section tops on nav
  // navigation (≈ menu height + a little air).
  const sectionScrollOffset = { base: 24, lg: 28 }
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_ANALYTICS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_ANALYTICS_ID}');
        `}
      </Script>
      <OpenGraphHead />
      <Menu />
      <Grid
        id="mainGrid"
        templateColumns={{
          base: 'repeat(1, 1fr)',
          lg: 'repeat(3, 1fr)',
          // At xl the columns sit side-by-side. A 35/65 split pulls the content
          // column left (~35% start instead of ~40%) so the vertical rail has
          // roughly symmetric gutters. The fixed sidebar text only reaches ~27%,
          // so the earlier content start does not collide with it.
          xl: '35fr 65fr',
        }}
        templateRows={{
          sm: 'repeat(1, 0)',
          lg: 'repeat(2, 1fr)',
        }}
        gap={4}
      >
        <GridItem
          padding={sideBarPadding}
          marginTop={paddTop}
          rowSpan={2}
          colSpan={{ base: 1, sm: 1, md: 1, lg: 1, xl: 1 }}
          display="flex"
          alignContent="center"
          as="div"
          flexDirection={'row'}
        >
          <Sidebar />
        </GridItem>
        <GridItem
          as="main"
          padding={mainContent}
          rowSpan={2}
          colSpan={{ base: 1, sm: 2, md: 2, lg: 3, xl: 1 }}
          overflow="hidden"
          // Paint the content above the fixed sidebar's (mostly empty) container
          // box so its left edge stays clickable where the two now nearly meet at
          // xl — while staying below the Menu (z-index 1). No effect on the
          // sidebar's own interactive region, which the content never covers.
          position="relative"
          zIndex={0}
        >
          {/* Single source of truth for inter-section vertical rhythm.
              ~5rem (base) → ~9rem (xl) between sections. Per-section paddings
              were removed so the gap stays constant; the only exceptions are the
              About full-height hero and Contact's bottom breathing room below. */}
          <Stack w="100%" spacing={{ base: 20, lg: 28, xl: 36 }}>
            <FadeInLayout>
              <Box
                id="aboutMe"
                className="contentRow"
                minH={{ lg: '100vh' }}
                display="flex"
                alignItems="center"
                flexDirection={{
                  base: 'column-reverse',
                  lg: 'row',
                }}
              >
                {/* <About professionalYears={professionalYears} /> */}
                <About />
                <Avatar />
              </Box>
            </FadeInLayout>
            <FadeInLayout>
              <Box
                id="services"
                className="contentRow"
                scrollMarginTop={sectionScrollOffset}
                flexDirection={'row'}
              >
                <Services />
              </Box>
            </FadeInLayout>
            <FadeInLayout>
              <Box
                id="work"
                className="contentRow"
                scrollMarginTop={sectionScrollOffset}
                flexDirection={'row'}
              >
                <SelectedWork />
              </Box>
            </FadeInLayout>
            <FadeInLayout>
              <Box
                id="jobs"
                className="contentRow"
                scrollMarginTop={sectionScrollOffset}
                flexDirection={'row'}
              >
                <Experience />
              </Box>
            </FadeInLayout>
            <FadeInLayout>
              <Box
                id="contact"
                className="contentRow"
                scrollMarginTop={sectionScrollOffset}
                paddingBottom={{ base: 16, xl: 24 }}
                flexDirection={'row'}
              >
                <GetInTouch />
              </Box>
            </FadeInLayout>
          </Stack>
        </GridItem>
      </Grid>
      <ScrollMore />
    </>
  )
}

export default Portfolio

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'], i18nConfig as UserConfig))
    }
  }
}
