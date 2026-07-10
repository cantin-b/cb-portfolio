import { memo, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import {
  Heading,
  Text,
  Stack,
  List,
  ListItem,
  Box,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react'
import { FiCheck } from 'react-icons/fi'
import { motion, useAnimation, useReducedMotion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { stagger, fadeInUp, simpleOpacity, lineDraw, revealItem } from 'config/animations'

const MotionList = motion(List)
const MotionListItem = motion(ListItem)
const MotionBox = motion(Box)
const MotionStack = motion(Stack)
const MotionHeading = motion(Heading)

// Mirrors premiumEasing from config/animations.ts for CSS hover micro-interactions.
const HOVER_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'
const HOVER_TRANSITION = `200ms ${HOVER_EASE}`

const ServicesSection = () => {
  const { t } = useTranslation('common')
  const services = t('services.items', { returnObjects: true }) as string[]

  const checkColor = useColorModeValue('#263579', '#AEB9D6')
  const checkHoverColor = useColorModeValue('#C1272D', '#C7D0E6')
  const dividerColor = useColorModeValue('#C9D3E1', '#323846')
  const dividerHoverColor = useColorModeValue('#263579', '#AEB9D6')

  const prefersReducedMotion = useReducedMotion()
  const controls = useAnimation()
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true })

  useEffect(() => {
    if (inView) {
      controls.start('animate')
    }
  }, [controls, inView])

  const rowVariant = prefersReducedMotion ? simpleOpacity : fadeInUp
  const lineVariant = prefersReducedMotion ? undefined : lineDraw

  return (
    <MotionStack
      variants={stagger}
      width={{ base: '99%', lg: '60%', xl: '75%' }}
      height="100%"
      spacing={{ base: 6, xl: 8 }}
      as="section"
    >
      <MotionHeading
        variants={revealItem}
        as="h2"
        size="2xl"
        style={{
          fontVariantCaps: 'small-caps',
        }}
      >
        {t('services.title')}
      </MotionHeading>
      <MotionStack variants={revealItem} spacing={{ base: 6, xl: 8 }}>
        <Text variant="description" textAlign="justify">
          {t('services.intro')}
        </Text>
        <MotionList
          ref={ref}
          variants={stagger}
          initial="initial"
          animate={controls}
          styleType="none"
          spacing={0}
        >
          {services.map((item) => (
          <MotionListItem key={item} variants={rowVariant} role="group">
            <Flex
              align="flex-start"
              gap={{ base: 3, md: 4 }}
              py={{ base: 4, md: 5 }}
              transition={`transform ${HOVER_TRANSITION}`}
              _groupHover={
                prefersReducedMotion ? undefined : { transform: 'translateX(6px)' }
              }
            >
              <Box
                as={FiCheck}
                aria-hidden="true"
                boxSize={5}
                mt="2px"
                flexShrink={0}
                color={checkColor}
                transition={`color ${HOVER_TRANSITION}, transform ${HOVER_TRANSITION}, filter ${HOVER_TRANSITION}`}
                _groupHover={
                  prefersReducedMotion
                    ? { color: checkHoverColor }
                    : {
                        color: checkHoverColor,
                        transform: 'scale(1.08)',
                        filter: `drop-shadow(0 0 5px ${checkHoverColor})`,
                      }
                }
              />
              <Text as="span" fontSize="small" flex="1">
                {item}
              </Text>
            </Flex>
            <MotionBox
              variants={lineVariant}
              height="1px"
              bg={dividerColor}
              transformOrigin="left"
              transition={`background-color ${HOVER_TRANSITION}`}
              _groupHover={{ bg: dividerHoverColor }}
            />
          </MotionListItem>
          ))}
        </MotionList>
      </MotionStack>
    </MotionStack>
  )
}

export default memo(ServicesSection)
