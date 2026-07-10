import { memo } from 'react'
import { useTranslation } from 'next-i18next'
import { Heading, Text, Stack } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { stagger, revealItem } from 'config/animations'
import ExperienceTab from './ExperienceTab'
import EducationTab from './EducationTab'

const MotionStack = motion(Stack)
const MotionHeading = motion(Heading)

const DetailSection = () => {
  const { t } = useTranslation('common')
  return (
    <MotionStack
      variants={stagger}
      width={{ base: '99%', lg: '60%', xl: '75%' }}
      height="100%"
      spacing={{ base: 6, xl: 8 }}
    >
      <MotionHeading
        variants={revealItem}
        as="h2"
        size="2xl"
        style={{
          fontVariantCaps: 'small-caps',
        }}
      >
        {t('experience.title')}
      </MotionHeading>
      <MotionStack variants={revealItem} spacing={{ base: 6, xl: 8 }}>
        <Text variant="description" textAlign="justify">
          {t('experience.description')}
        </Text>
        <ExperienceTab />
        <EducationTab />
      </MotionStack>
    </MotionStack>
)}

export default memo(DetailSection)
