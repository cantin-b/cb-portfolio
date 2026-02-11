import { memo } from 'react'
import { useTranslation } from 'next-i18next'
import { Heading, Text, Stack, List, ListItem, ListIcon } from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'

const ServicesSection = () => {
  const { t } = useTranslation('common')
  const services = t('services.items', { returnObjects: true }) as string[]

  return (
    <Stack
      width={{ base: '99%', lg: '60%', xl: '75%' }}
      height="100%"
      spacing={{ base: 6, xl: 8 }}
      as="section"
    >
      <Heading
        as="h2"
        size="2xl"
        style={{
          fontVariantCaps: 'small-caps',
        }}
      >
        {t('services.title')}
      </Heading>
      <Text variant="description" textAlign="justify">
        {t('services.intro')}
      </Text>
      <List spacing={3}>
        {services.map((item) => (
          <ListItem key={item} fontSize="small" display="flex" alignItems="flex-start">
            <ListIcon as={CheckCircleIcon} color="teal.400" mt={0.5} />
            <Text as="span">{item}</Text>
          </ListItem>
        ))}
      </List>
    </Stack>
  )
}

export default memo(ServicesSection)

