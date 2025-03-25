import { memo } from 'react'
import { Heading, Text, Stack } from '@chakra-ui/react'
import ExperienceTab from './ExperienceTab'
import EducationTab from './EducationTab'

const DetailSection = () => (
  <Stack
    width={{ base: '99%', lg: '60%', xl: '75%' }}
    height="100%"
    spacing={{ base: 6, xl: 8 }}
  >
    <Heading
      size="2xl"
      style={{
        fontVariantCaps: 'small-caps',
      }}
    >
      background
    </Heading>
    <Text variant="description">
      I’ve been working as a full-stack developer since 2021, contributing to projects in both 
      startup and freelance settings across frontend, backend, and deployment workflows.
    </Text>
    <ExperienceTab />
    <EducationTab />
  </Stack>
)

export default memo(DetailSection)
