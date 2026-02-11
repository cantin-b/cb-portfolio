import { useTranslation, Trans } from 'next-i18next'
import { useHasMounted } from 'hooks/useHasMounted'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Stack,
  Heading,
  Text,
  Link,
  useColorModeValue,
} from '@chakra-ui/react'
import { GOOGLE_CALENDAR } from '../../../lib/constants'

type ContactFormProps = {
  formData: { name: string; email: string; message: string }
  errors: Record<string, string>
  isSubmitting: boolean
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

const ContactForm = ({
  formData,
  errors,
  isSubmitting,
  handleChange,
  handleSubmit
}: ContactFormProps) => {
  const hasMounted = useHasMounted()
  const { t } = useTranslation('common')

  const formBg = useColorModeValue('white', 'gray.800')
  const focusBorderColor = useColorModeValue('#319795', '#9DECF9')
  const buttonBg = useColorModeValue('#319795', '#9DECF9')
  const buttonHoverBg = useColorModeValue('#2c8583', '#8dd7e3')
  const buttonTextColor = useColorModeValue('white', '#121212')
  return (
    <Box
      maxW="lg"
      mx="auto"
      mt={12}
      p={8}
      borderRadius="lg"
      boxShadow="xl"
      bg={formBg}
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing={6}>
          <Heading size="lg" textAlign="center">
            {t('contact.form.title')}
          </Heading>
          <Text textAlign="center" color="gray.500">
            {t('contact.form.subtitle')}
          </Text>

          <FormControl id="name">
            <FormLabel>{t('contact.form.name.label')}</FormLabel>
            <Input
              name="name"
              placeholder={t('contact.form.name.placeholder')}
              value={formData.name}
              onChange={handleChange}
              isInvalid={!!errors.name}
              focusBorderColor={focusBorderColor}
            />
            {errors.name && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.name}
              </Text>
            )}
          </FormControl>
          <FormControl id="email">
            <FormLabel>{t('contact.form.email.label')}</FormLabel>
            <Input
              name="email"
              type="email"
              placeholder={t('contact.form.email.placeholder')}
              value={formData.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
              focusBorderColor={focusBorderColor}
            />
            {errors.email && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.email}
              </Text>
            )}
          </FormControl>
          <FormControl id="message">
            <FormLabel>{t('contact.form.message.label')}</FormLabel>
            <Textarea
              name="message"
              placeholder={t('contact.form.message.placeholder')}
              rows={6}
              value={formData.message}
              onChange={handleChange}
              isInvalid={!!errors.message}
              focusBorderColor={focusBorderColor}
            />
            {errors.message && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.message}
              </Text>
            )}
          </FormControl>
          <Button
            bg={buttonBg}
            _hover={{ bg: buttonHoverBg }}
            color={buttonTextColor}
            size="lg"
            type="submit"
            isDisabled={isSubmitting}
            opacity={isSubmitting ? 0.7 : 1}
            transition="opacity 0.3s"
          >
            {isSubmitting ? t('contact.form.button.sending') : t('contact.form.button.send')}
          </Button>
          {hasMounted && (
            <Text textAlign="center" fontSize="sm" pt={2}>
              <Trans i18nKey="contact.form.alternative" components={{
                1: <Link
                  href={GOOGLE_CALENDAR}
                  isExternal
                  fontWeight="medium"
                  color={buttonBg}
                  _hover={{
                    textDecoration: 'underline',
                    color: buttonHoverBg,
                  }} />,
              }} />
            </Text>
          )}
        </Stack>
      </form>
    </Box>
  )
}

export default ContactForm
