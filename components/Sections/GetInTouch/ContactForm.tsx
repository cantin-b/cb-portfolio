type ContactFormProps = {
  formData: { name: string; email: string; message: string }
  errors: Record<string, string>
  isSubmitting: boolean
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

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

const ContactForm = ({
  formData,
  errors,
  isSubmitting,
  handleChange,
  handleSubmit
}: ContactFormProps) => {
  return (
    <Box
      maxW="lg"
      mx="auto"
      mt={12}
      p={8}
      borderRadius="lg"
      boxShadow="xl"
      bg={useColorModeValue('white', 'gray.800')}
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing={6}>
          <Heading size="lg" textAlign="center">
            Get In Touch
          </Heading>
          <Text textAlign="center" color="gray.500">
            Let’s collaborate on your next big idea.
          </Text>

          <FormControl id="name">
            <FormLabel>Name</FormLabel>
            <Input
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              isInvalid={!!errors.name} 
              focusBorderColor={useColorModeValue('#319795', '#9DECF9')}
            />
            {errors.name && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.name}
              </Text>
            )}
          </FormControl>
          <FormControl id="email">
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              placeholder="Your email"
              value={formData.email}
              onChange={handleChange}
              isInvalid={!!errors.email} 
              focusBorderColor={useColorModeValue('#319795', '#9DECF9')}
            />
            {errors.email && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.email}
              </Text>
            )}
          </FormControl>
          <FormControl id="message">
            <FormLabel>Message</FormLabel>
            <Textarea
              name="message"
              placeholder="Project details: What do you need help with?"
              rows={6}
              value={formData.message}
              onChange={handleChange}
              isInvalid={!!errors.message}
              focusBorderColor={useColorModeValue('#319795', '#9DECF9')}
            />
            {errors.message && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.message}
              </Text>
            )}
          </FormControl>
          <Button
            bg={useColorModeValue('#319795', '#9DECF9')}
            _hover={{ bg: useColorModeValue('#2c8583', '#8dd7e3') }}
            color={useColorModeValue('white', '#121212')}
            size="lg"
            type="submit"
            isDisabled={isSubmitting}
            opacity={isSubmitting ? 0.7 : 1}
            transition="opacity 0.3s"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
          <Text textAlign="center" fontSize="sm" pt={2}>
            Prefer to schedule a call?{' '}
            <Link
              href={process.env.GOOGLE_CALENDAR}
              isExternal
              fontWeight="medium"
              color={useColorModeValue('#319795', '#9DECF9')}
              _hover={{
                textDecoration: 'underline',
                color: useColorModeValue('#2c8583', '#8dd7e3'),
              }}
            >
              Book a Meeting with Google Meet
            </Link>
          </Text>
        </Stack>
      </form>
    </Box>
  )
}

export default ContactForm
