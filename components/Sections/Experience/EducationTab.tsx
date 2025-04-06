import { useTranslation } from 'next-i18next'
import { Stack, Text, Heading, Box } from '@chakra-ui/react'
import { EducationList } from 'config/education'

const EducationTab = () => {
  const { t } = useTranslation('common')
  return (
    <Stack spacing={6} pt={4}>
      <Heading 
        size="lg" 
        fontWeight="semibold"
        style={{
          fontVariantCaps: 'small-caps',
        }} >
        {t('education.title')}
      </Heading>

      {EducationList.map((edu, index) => (
        <Box key={index}>
          <Text fontWeight="medium">{t(edu.degree)}</Text>
          <Text color="gray.500">
            {/* {t(edu.school)}{edu.location ? ` • ${edu.location}` : ''} */}
            {t(edu.school)}
          </Text>
          <Text fontSize="sm" color="gray.400">
            {edu.period}
          </Text>
        </Box>
      ))}
    </Stack>
  )
}

export default EducationTab
