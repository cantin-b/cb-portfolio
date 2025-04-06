import { memo } from 'react'
import { useTranslation } from 'next-i18next'
import { Heading, Text, Stack } from '@chakra-ui/react'
import ExperienceTab from './ExperienceTab'
import EducationTab from './EducationTab'

const DetailSection = () => {
  const { t } = useTranslation('common')
  return (
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
        {t('experience.title')}
      </Heading>
      <Text variant="description" textAlign="justify">
        {t('experience.description')}
      </Text>
      <ExperienceTab />
      <EducationTab />
    </Stack>
)}

export default memo(DetailSection)
