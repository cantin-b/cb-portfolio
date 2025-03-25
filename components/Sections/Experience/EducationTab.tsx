import { Stack, Text, Heading, Box } from '@chakra-ui/react'
import { EducationList } from 'config/education'

const EducationTab = () => {
  return (
    <Stack spacing={6} pt={4}>
      <Heading size="lg" fontWeight="semibold">
        Education
      </Heading>

      {EducationList.map((edu, index) => (
        <Box key={index}>
          <Text fontWeight="medium">{edu.degree}</Text>
          <Text color="gray.500">
            {edu.school}{edu.location ? ` • ${edu.location}` : ''}
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
