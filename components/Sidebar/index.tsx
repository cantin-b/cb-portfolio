import {
  Stack,
  Heading,
  Text,
  Button,
  useColorMode,
  Container,
  Box,
  useBreakpointValue,
} from '@chakra-ui/react'
import { motion, useTransform } from 'framer-motion'
import styles from './styles.module.css'
import {
  fadeInUp,
  letterSpace,
  simpleOpacity,
  stagger,
  scaleUp,
} from 'config/animations'
import { useTranslation } from 'next-i18next'

const Sidebar = () => {
  const { colorMode } = useColorMode()
  const display = useBreakpointValue({ base: 'none', lg: 'block' })
  const surNameSize = useBreakpointValue({ base: '3xl', md: '4xl' })
  const MotionHeading = motion(Heading)
  const MotionText = motion(Text)
  const MotionStack = motion(Stack)
  const MotionButton = motion(Button)
  const MotionBox = motion(Box)

  const { t } = useTranslation('common')

  return (
    <MotionBox
      initial="initial"
      animate="animate"
      position={{ xl: 'fixed' }}
      maxWidth={{ xl: '34%' }}
      top={{ lg: 0 }}
    >
      <motion.div
        id="sidebarCircle"
        className={`${styles.sidebar} ${
          colorMode === 'light' ? styles.dark : ''
        }`}
        variants={scaleUp}
        style={{ display: display }}
        animate={colorMode === 'dark' ? 'animate' : 'lightMode'}
      ></motion.div>
      <Container
        padding={0}
        margin={0}
        height={{ xl: '100vh' }}
        display={{ xl: 'flex' }}
        alignItems={{ xl: 'center' }}
      >
        <MotionStack variants={stagger} spacing={6} w="100">
          <MotionText
            variants={fadeInUp}
            delay={1}
            variant="accent"
            fontWeight="light"
          >
            {t('sidebar.greeting')}
          </MotionText>
          <MotionHeading
            as="h2"
            size={surNameSize}
            className={styles.marginTopForce}
            textTransform="uppercase"
            variants={letterSpace}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Cantin
          </MotionHeading>
          <MotionHeading
            as="h3"
            size="md"
            variant="emphasis"
            className={styles.marginTopSmall}
            variants={fadeInUp}
          >
            {t('sidebar.role')}
          </MotionHeading>
          <MotionText
            variant="description"
            textAlign="justify"
            fontSize="small"
            paddingRight={{ lg: '12' }}
            variants={fadeInUp}
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
            variants={simpleOpacity}
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
  )
}

export default Sidebar
