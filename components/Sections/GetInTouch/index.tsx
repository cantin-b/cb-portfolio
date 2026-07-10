import { memo, useState } from 'react'
import { useTranslation, Trans } from 'next-i18next'
import { useHasMounted } from 'hooks/useHasMounted'
import {
  Heading,
  Text,
  Stack,
  Link,
  Box,
  useColorModeValue,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { stagger, revealItem } from 'config/animations'
import ContactForm from './ContactForm'

const MotionStack = motion(Stack)
const MotionHeading = motion(Heading)

const WHATSAPP_BUSINESS_URL = 'https://wa.me/33756977524'

type FormData = {
  name: string
  email: string
  message: string
  website: string
}

const GetInTouch = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
    website: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const hasMounted = useHasMounted()
  const { t } = useTranslation('common')
  const contactLinkColor = useColorModeValue('#263579', '#AEB9D6')
  const contactLinkHoverColor = useColorModeValue('#C1272D', '#C1272D')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear the field-specific error if the user is typing something valid
    if (errors[name] && value.trim() !== '') {
      setErrors((prev) => {
        const updated = { ...prev }
        delete updated[name]
        return updated
      })
    }
  }

  const validate = () => {
    let newErrors: Record<string, string> = {}
    if (!formData.name) newErrors.name = 'Name is required'
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email'
    }
    if (!formData.message) newErrors.message = 'Message is required'
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        alert(t('contact.form.success'))
        setFormData({ name: '', email: '', message: '', website: '' })
        // Redirect to homepage after successful submit
        window.location.href = '/#'
      } else {
        alert(t('contact.form.fail'))
      }
    } catch (error) {
      alert(t('contact.form.error'))
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <MotionStack
      variants={stagger}
      width={{ base: '99%', lg: '60%', xl: '75%' }}
      height="100%"
      spacing={{ base: 6, xl: 8 }}
      as="footer"
    >
      <MotionHeading
        variants={revealItem}
        as="h2"
        size="2xl"
        style={{
          fontVariantCaps: 'small-caps',
        }}
      >
        {t('contact.title')}
      </MotionHeading>
      <MotionStack variants={revealItem} spacing={{ base: 6, xl: 8 }}>
        {hasMounted && (
        <Text variant="description" textAlign="justify">
          <Trans i18nKey="contact.intro" components={{
            1: <Link
              href="mailto:hello@cantinbartel.dev"
              isExternal
              color={contactLinkColor}
              fontWeight="bold"
              _hover={{ color: contactLinkHoverColor }}
            />,
            2: <Link
              href={WHATSAPP_BUSINESS_URL}
              isExternal
              color={contactLinkColor}
              fontWeight="bold"
              _hover={{ color: contactLinkHoverColor }}
            />,
            3: <Link
              href="https://www.linkedin.com/in/cantin-bartel/"
              isExternal
              color={contactLinkColor}
              fontWeight="bold"
              _hover={{ color: contactLinkHoverColor }}
            />,
            }} />
        </Text>
        )}
        <ContactForm
          formData={formData}
          errors={errors}
          isSubmitting={isSubmitting}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
        <Box
          textAlign="center"
          fontFamily="monospace"
          paddingTop={{ base: 10, lg: 20, xl: 20 }}
          paddingBottom={{ base: 5, lg: 18 }}
        >
          <Link
            variant="description"
            textDecoration="none"
            rel="noreferrer"
            href={WHATSAPP_BUSINESS_URL}
            target="_blank"
            _focus={{ boxShadow: 'none' }}
          >
            <Text as="span">
              Cantin Bartel © {new Date().getFullYear()}
            </Text>
          </Link>
        </Box>
      </MotionStack>
    </MotionStack>
  )
}

export default memo(GetInTouch)
