import {
  Stack,
  Heading,
  Text,
  Button,
  Container,
  Box,
  useBreakpointValue,
} from '@chakra-ui/react'
import { motion, useReducedMotion } from 'framer-motion'
import styles from './styles.module.css'
import {
  revealItem,
  nameReveal,
  nameLineReveal,
  heroStaggerLead,
} from 'config/animations'
import ScrollProgressArc from './ScrollProgressArc'
import { useTranslation } from 'next-i18next'

// Module scope: motion(...) defined inside the component recreates the type on
// every render (e.g. a resize changing surNameSize, or a theme toggle) and
// remounts the subtree, replaying the entrance. Stable identities keep it mounted.
const MotionHeading = motion(Heading)
const MotionText = motion(Text)
const MotionStack = motion(Stack)
const MotionButton = motion(Button)
const MotionBox = motion(Box)

const Sidebar = () => {
  const surNameSize = useBreakpointValue({ base: '3xl', md: '4xl' })
  const prefersReducedMotion = useReducedMotion()

  const { t } = useTranslation('common')

  return (
    <>
      <ScrollProgressArc />
      <MotionBox
        initial={prefersReducedMotion ? 'animate' : 'initial'}
        animate="animate"
        position={{ xl: 'fixed' }}
        maxWidth={{ xl: '34%' }}
        top={{ lg: 0 }}
      >
      <Container
        padding={0}
        margin={0}
        height={{ xl: '100vh' }}
        display={{ xl: 'flex' }}
        alignItems={{ xl: 'center' }}
      >
        <MotionStack variants={heroStaggerLead} spacing={6} w="100">
          <MotionText
            variants={revealItem}
            variant="accent"
            fontWeight="light"
          >
            {t('sidebar.greeting')}
          </MotionText>
          <MotionHeading
            as="h1"
            size={surNameSize}
            className={styles.marginTopForce}
            textTransform="uppercase"
            variants={nameReveal}
            lineHeight={0.95}
            letterSpacing={0}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
          >
            <MotionBox as="span" display="block" overflow="hidden">
              <MotionBox
                as="span"
                display="block"
                variants={nameLineReveal}
                style={{ willChange: 'transform' }}
              >
                Cantin
              </MotionBox>
            </MotionBox>
            <MotionBox as="span" display="block" overflow="hidden">
              <MotionBox
                as="span"
                display="block"
                variants={nameLineReveal}
                style={{ willChange: 'transform' }}
              >
                Bartel
              </MotionBox>
            </MotionBox>
          </MotionHeading>
          <MotionHeading
            as="h2"
            size="md"
            variant="emphasis"
            className={styles.marginTopSmall}
            variants={revealItem}
          >
            {t('sidebar.role')}
          </MotionHeading>
          <MotionText
            variant="description"
            textAlign="justify"
            fontSize="small"
            paddingRight={{ lg: '12' }}
            variants={revealItem}
            maxWidth={{ base: '100%', lg: '80%' }}
          >
            {t('sidebar.thanks')}
            <br />
            <br/>
            {t('sidebar.description')} {" "}
            <Text variant="emphasis" as="span">
              {t('sidebar.idea')} {" "}
            </Text>
            {t('sidebar.support')}
          </MotionText>
          <MotionButton
            size="lg"
            variant="outline"
            borderWidth="1px"
            borderRadius="0"
            fontWeight="normal"
            fontSize="sm"
            width="120px"
            variants={revealItem}
            as={'a'}
            href="/#contact"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {t('sidebar.button')}
          </MotionButton>
        </MotionStack>
      </Container>
      </MotionBox>
    </>
  )
}

export default Sidebar
