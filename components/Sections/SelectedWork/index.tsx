import { memo, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { ArrowForwardIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import {
  Badge,
  Box,
  Button,
  CloseButton,
  Heading,
  Icon,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Portal,
  SimpleGrid,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { FiMaximize2 } from 'react-icons/fi'
import { premiumEasing, stagger, revealItem } from 'config/animations'

const MotionStack = motion(Stack)
const MotionBox = motion(Box)

// Mirrors premiumEasing from config/animations.ts for CSS-driven hover/focus transitions.
const PREMIUM_CUBIC = `cubic-bezier(${premiumEasing.join(', ')})`

// Derive the dark-mode sibling asset (e.g. foo.png -> foo-dark.png).
const toDarkSrc = (src: string) => src.replace(/\.png$/, '-dark.png')

type ProjectLink = {
  href: string
  labelKey: string
}

type CaseStudySection = {
  id: 'publicSite' | 'backOffice' | 'crmWorkflow'
  image: string
}

type SelectedWorkProject = {
  id: 'scooter' | 'siamEstate' | 'prospectingCrm'
  image: string
  detailSections: CaseStudySection[]
  links: ProjectLink[]
  ctaKey: string
}

const projects: SelectedWorkProject[] = [
  {
    id: 'scooter',
    image: '/projects/selected-work/scooter-rental/scooter-rental.png',
    detailSections: [
      {
        id: 'publicSite',
        image: '/projects/selected-work/scooter-rental/scooter-rental.png',
      },
      {
        id: 'backOffice',
        image: '/projects/selected-work/scooter-rental/scooter-rental-backoffice.png',
      },
    ],
    links: [
      {
        href: 'https://scooter-rental.cantinbartel.dev',
        labelKey: 'selectedWork.actions.viewPublicWebsite',
      },
      {
        href: 'https://scooter-rental.cantinbartel.dev/app',
        labelKey: 'selectedWork.actions.viewBackOffice',
      },
    ],
    ctaKey: 'selectedWork.actions.viewDetails',
  },
  {
    id: 'siamEstate',
    image: '/projects/selected-work/siam-estate/real-estate.png',
    detailSections: [
      {
        id: 'publicSite',
        image: '/projects/selected-work/siam-estate/real-estate.png',
      },
      {
        id: 'backOffice',
        image: '/projects/selected-work/siam-estate/real-estate-backoffice.png',
      },
    ],
    links: [
      {
        href: 'https://siam-estate.cantinbartel.dev/',
        labelKey: 'selectedWork.actions.viewPublicWebsite',
      },
      {
        href: 'https://siam-estate.cantinbartel.dev/admin',
        labelKey: 'selectedWork.actions.viewBackOffice',
      },
    ],
    ctaKey: 'selectedWork.actions.viewDetails',
  },
  {
    id: 'prospectingCrm',
    image: '/projects/selected-work/crm-demo/crm-demo.png',
    detailSections: [
      {
        id: 'crmWorkflow',
        image: '/projects/selected-work/crm-demo/crm-demo.png',
      },
    ],
    links: [
      {
        href: 'https://crm-demo.cantinbartel.dev/',
        labelKey: 'selectedWork.actions.openCrmDemo',
      },
    ],
    ctaKey: 'selectedWork.actions.viewDetails',
  },
]

const ProjectTags = ({ tags }: { tags: string[] }) => {
  const tagBg = useColorModeValue('rgba(38, 53, 121, 0.08)', 'rgba(174, 185, 214, 0.1)')
  const tagColor = useColorModeValue('#263579', '#AEB9D6')

  return (
    <Box display="flex" gap={2} flexWrap="wrap">
      {tags.map((tag) => (
        <Badge
          key={tag}
          bg={tagBg}
          color={tagColor}
          fontWeight="medium"
          letterSpacing={0}
          textTransform="none"
          borderRadius="sm"
          px={2}
          py={1}
        >
          {tag}
        </Badge>
      ))}
    </Box>
  )
}

// Fills its (relatively-positioned) parent cell and swaps to the *-dark.png
// sibling in dark mode, falling back to the light asset if the dark one is missing.
const ProjectImage = ({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) => {
  const preferredSrc = useColorModeValue(src, toDarkSrc(src))
  const [resolvedSrc, setResolvedSrc] = useState(preferredSrc)

  useEffect(() => {
    setResolvedSrc(preferredSrc)
  }, [preferredSrc])

  return (
    <Image
      className={className}
      src={resolvedSrc}
      alt={alt}
      onError={() => {
        if (resolvedSrc !== src) setResolvedSrc(src)
      }}
      position="absolute"
      inset={0}
      width="100%"
      height="100%"
      objectFit="cover"
      objectPosition="top"
    />
  )
}

// Tap/click-to-expand view for a single case-study screenshot. Renders through a
// Portal so it escapes the case-study Modal's scroll/overflow context and covers
// the full viewport above it. Native pinch-zoom handles fine zoom once enlarged.
const ImageLightbox = ({
  src,
  alt,
  isOpen,
  onClose,
}: {
  src: string
  alt: string
  isOpen: boolean
  onClose: () => void
}) => {
  const { t } = useTranslation('common')
  const prefersReducedMotion = useReducedMotion()
  const closeRef = useRef<HTMLButtonElement>(null)

  // Mirror ProjectImage: prefer the *-dark.png sibling in dark mode so the enlarged
  // view matches the screenshot shown in the card, falling back on load error.
  const preferredSrc = useColorModeValue(src, toDarkSrc(src))
  const [resolvedSrc, setResolvedSrc] = useState(preferredSrc)

  useEffect(() => {
    setResolvedSrc(preferredSrc)
  }, [preferredSrc])

  // Escape closes only the lightbox. Listen in the *capture* phase so this runs
  // before the parent case-study Modal's own key handler (which stopPropagation()s
  // Escape on bubble) — otherwise it'd only reach us when focus happened to sit
  // outside the Modal. stopPropagation then keeps the Modal from acting on it too.
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown, true)
    return () => document.removeEventListener('keydown', handleKeyDown, true)
  }, [isOpen, onClose])

  // Nudge focus onto the close control when opening. The parent Modal keeps its
  // focus trap, so focus settles on a Modal-owned element rather than <body>.
  useEffect(() => {
    if (isOpen) closeRef.current?.focus()
  }, [isOpen])

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.3, ease: premiumEasing }

  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <MotionBox
            key="case-study-lightbox"
            position="fixed"
            inset={0}
            // Must sit above the parent case-study Modal (Chakra `modal` token = 1400).
            zIndex={1500}
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={{ base: 4, md: 8 }}
            bg="blackAlpha.600"
            backdropFilter="blur(3px)"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
          >
            <CloseButton
              ref={closeRef}
              aria-label={t('selectedWork.caseStudy.zoomImage')}
              onClick={onClose}
              position="absolute"
              top={4}
              right={4}
              size="lg"
              color="white"
              bg="blackAlpha.500"
              borderRadius="md"
              _hover={{ bg: 'blackAlpha.700' }}
            />
            <MotionBox
              position="relative"
              maxW="92vw"
              maxH="92vh"
              onClick={(event) => event.stopPropagation()}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={transition}
            >
              <Image
                src={resolvedSrc}
                alt={alt}
                onError={() => {
                  if (resolvedSrc !== src) setResolvedSrc(src)
                }}
                maxW="92vw"
                maxH="92vh"
                objectFit="contain"
                borderRadius="md"
              />
            </MotionBox>
          </MotionBox>
        )}
      </AnimatePresence>
    </Portal>
  )
}

const ProjectCard = ({
  project,
  onOpenDetails,
}: {
  project: SelectedWorkProject
  onOpenDetails: (project: SelectedWorkProject) => void
}) => {
  const { t } = useTranslation('common')
  const surface = useColorModeValue('white', '#171A21')
  const imageBg = useColorModeValue('#F4F7FB', '#101216')
  const borderColor = useColorModeValue('#C9D3E1', '#323846')
  const hoverBorderColor = useColorModeValue('#263579', '#AEB9D6')
  const labelColor = useColorModeValue('#C1272D', '#C7D0E6')
  // Faint accent glow on hover/focus — derived alpha of the palette accent color.
  const hoverGlow = useColorModeValue(
    '0 18px 40px -24px rgba(38, 53, 121, 0.35)',
    '0 18px 40px -24px rgba(174, 185, 214, 0.28)'
  )
  const title = t(`selectedWork.projects.${project.id}.title`)
  const tags = t(`selectedWork.projects.${project.id}.tags`, {
    returnObjects: true,
  }) as string[]

  const openProject = () => onOpenDetails(project)

  const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openProject()
    }
  }

  return (
    <Box
      as="article"
      role="button"
      tabIndex={0}
      aria-label={`${t(project.ctaKey)}: ${title}`}
      onClick={openProject}
      onKeyDown={handleCardKeyDown}
      bg={surface}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="md"
      cursor="pointer"
      overflow="hidden"
      height="100%"
      display={{ base: 'block', md: 'grid' }}
      gridTemplateColumns={{ md: 'minmax(280px, 5fr) minmax(260px, 3fr)' }}
      transition={`border-color 160ms ease, transform 160ms ease, box-shadow 300ms ${PREMIUM_CUBIC}`}
      _hover={{
        borderColor: hoverBorderColor,
        transform: 'translateY(-2px)',
        boxShadow: hoverGlow,
      }}
      _focusVisible={{
        borderColor: hoverBorderColor,
        transform: 'translateY(-2px)',
        boxShadow: `0 0 0 1px ${hoverBorderColor}, ${hoverGlow}`,
        outline: 'none',
      }}
      sx={{
        '.project-image': {
          transformOrigin: 'center',
          transition: `transform 350ms ${PREMIUM_CUBIC}`,
        },
        '.cta-arrow': {
          opacity: 0,
          transform: 'translateX(-4px)',
          transition: `opacity 300ms ${PREMIUM_CUBIC}, transform 300ms ${PREMIUM_CUBIC}`,
        },
        '&:hover .project-image, &:focus-visible .project-image': {
          transform: 'scale(1.04)',
        },
        '&:hover .cta-arrow, &:focus-visible .cta-arrow': {
          opacity: 1,
          transform: 'translateX(0)',
        },
      }}
    >
      <Box position="relative" bg={imageBg} minW={0} overflow="hidden">
        {/* Spacer: sets a 4:3 minimum height on wide screens while letting the
            cell stretch to match a taller text column on narrow (MacBook) widths,
            so the card surface never shows below the image. */}
        <Box aspectRatio={4 / 3} width="100%" aria-hidden />
        <ProjectImage src={project.image} alt={title} className="project-image" />
      </Box>
      <Stack spacing={4} p={{ base: 5, md: 6 }} justify="space-between" minW={0}>
        <Stack spacing={3}>
          <Text
            fontSize="xs"
            fontWeight="semibold"
            color={labelColor}
            textTransform="uppercase"
          >
            {t(`selectedWork.projects.${project.id}.type`)}
          </Text>
          <Heading as="h3" size="md">
            {title}
          </Heading>
          <Text variant="description" fontSize="sm" noOfLines={6}>
            {t(`selectedWork.projects.${project.id}.description`)}
          </Text>
          <ProjectTags tags={tags} />
        </Stack>
        <Button
          as="span"
          size="sm"
          variant="outlineAlternative"
          alignSelf="flex-start"
          pointerEvents="none"
        >
          {t(project.ctaKey)}
          <ArrowForwardIcon className="cta-arrow" aria-hidden ml={2} boxSize={3.5} />
        </Button>
      </Stack>
    </Box>
  )
}

const ProjectCaseStudyModal = ({
  project,
  isOpen,
  onClose,
}: {
  project?: SelectedWorkProject
  isOpen: boolean
  onClose: () => void
}) => {
  const { t } = useTranslation('common')
  const surface = useColorModeValue('white', '#171A21')
  const imageBg = useColorModeValue('#F4F7FB', '#101216')
  const borderColor = useColorModeValue('#C9D3E1', '#323846')
  const accentColor = useColorModeValue('#263579', '#AEB9D6')
  const labelColor = useColorModeValue('#C1272D', '#C7D0E6')
  const footerShadow = useColorModeValue(
    '0 -18px 28px -28px rgba(23, 32, 51, 0.55)',
    '0 -18px 28px -28px rgba(0, 0, 0, 0.85)'
  )

  // Lightbox state lives here so Escape/focus can be coordinated with this Modal.
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null)
  // The image trigger that opened the lightbox, so focus can return to it on close.
  const lightboxTriggerRef = useRef<HTMLDivElement | null>(null)

  const openLightbox = (
    event: { currentTarget: HTMLDivElement },
    image: { src: string; alt: string }
  ) => {
    lightboxTriggerRef.current = event.currentTarget
    setLightboxImage(image)
  }

  const closeLightbox = () => {
    setLightboxImage(null)
    // Return focus to the triggering image so it never falls back to <body>.
    lightboxTriggerRef.current?.focus()
  }

  const handleImageKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    image: { src: string; alt: string }
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openLightbox(event, image)
    }
  }
  // Mobile opens as a full-screen sheet sliding up from the bottom; desktop keeps
  // the centered scale preset. (motionPreset isn't a responsive prop, so pick it
  // per breakpoint — the modal only renders on client interaction, so SSR is moot.)
  const modalMotion = useBreakpointValue<'slideInBottom' | 'scale'>({
    base: 'slideInBottom',
    md: 'scale',
  })

  if (!project) return null

  const title = t(`selectedWork.projects.${project.id}.title`)
  const tags = t(`selectedWork.projects.${project.id}.tags`, {
    returnObjects: true,
  }) as string[]
  const sectionColumns = project.detailSections.length > 1 ? { base: 1, lg: 2 } : 1

  // Shared intro block (eyebrow + title + summary + tags). On desktop it lives in
  // a fixed ModalHeader; on mobile the same block is rendered inside the scroll
  // area so the case-study images get the full sheet height instead of a sliver.
  const caseStudyIntro = (
    <Stack spacing={4} maxW={{ base: 'full', md: '780px' }}>
      <Text
        fontSize="xs"
        fontWeight="semibold"
        color={labelColor}
        textTransform="uppercase"
      >
        {t('selectedWork.caseStudy.eyebrow')}
      </Text>
      <Heading as="h3" size="lg">
        {title}
      </Heading>
      <Text variant="description" fontSize="sm">
        {t(`selectedWork.projects.${project.id}.caseStudy.summary`)}
      </Text>
      <ProjectTags tags={tags} />
    </Stack>
  )

  return (
    <>
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={{ base: 'full', md: '5xl' }}
      scrollBehavior="inside"
      motionPreset={modalMotion}
      isCentered
      // While the lightbox is open, disable the Modal's own Escape-to-close so a
      // single Escape dismisses only the lightbox (its capture-phase listener
      // owns the key); the parent Modal stays open.
      closeOnEsc={!lightboxImage}
    >
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(3px)" />
      <ModalContent
        bg={surface}
        border="1px solid"
        borderColor={borderColor}
        borderRadius={{ base: 0, md: 'md' }}
        overflow="hidden"
        mx={{ base: 0, md: 8 }}
      >
        <ModalCloseButton />
        {/* Desktop: fixed header. Hidden on mobile, where the same intro scrolls
            inside the body (see below) so the images fill the full-screen sheet. */}
        <ModalHeader
          display={{ base: 'none', md: 'block' }}
          px={{ base: 5, md: 8 }}
          pt={{ base: 6, md: 8 }}
          pb={4}
        >
          {caseStudyIntro}
        </ModalHeader>

        <ModalBody px={{ base: 5, md: 8 }} pt={{ base: 12, md: 2 }} pb={{ base: 5, md: 6 }}>
          {/* Mobile-only: the intro scrolls with the content instead of pinning. */}
          <Box display={{ base: 'block', md: 'none' }} mb={6}>
            {caseStudyIntro}
          </Box>
          <SimpleGrid columns={sectionColumns} spacing={4}>
            {project.detailSections.map((section) => {
              const imageAlt = t(
                `selectedWork.projects.${project.id}.caseStudy.sections.${section.id}.imageAlt`
              )

              return (
              <Box
                key={section.id}
                border="1px solid"
                borderColor={borderColor}
                borderRadius="md"
                overflow="hidden"
                bg={surface}
              >
                <Box
                  role="button"
                  tabIndex={0}
                  aria-label={t('selectedWork.caseStudy.zoomImage')}
                  onClick={(event) =>
                    openLightbox(event, { src: section.image, alt: imageAlt })
                  }
                  onKeyDown={(event) =>
                    handleImageKeyDown(event, { src: section.image, alt: imageAlt })
                  }
                  bg={imageBg}
                  aspectRatio={4 / 3}
                  position="relative"
                  overflow="hidden"
                  cursor="pointer"
                  _focusVisible={{
                    outline: '2px solid',
                    outlineColor: accentColor,
                    outlineOffset: '-2px',
                  }}
                  sx={{
                    // Mirror ProjectCard's .cta-arrow: hidden by default, revealed on
                    // hover/focus-visible. On touch (no hover) it stays faintly visible.
                    '.zoom-affordance': {
                      opacity: 0,
                      transform: 'scale(0.9)',
                      transition: `opacity 250ms ${PREMIUM_CUBIC}, transform 250ms ${PREMIUM_CUBIC}`,
                    },
                    '@media (hover: none)': {
                      '.zoom-affordance': { opacity: 0.85, transform: 'scale(1)' },
                    },
                    '&:hover .zoom-affordance, &:focus-visible .zoom-affordance': {
                      opacity: 1,
                      transform: 'scale(1)',
                    },
                  }}
                >
                  <ProjectImage src={section.image} alt={imageAlt} />
                  <Box
                    className="zoom-affordance"
                    aria-hidden
                    position="absolute"
                    top={2}
                    right={2}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    boxSize={8}
                    borderRadius="md"
                    bg="blackAlpha.600"
                    color="white"
                    pointerEvents="none"
                  >
                    <Icon as={FiMaximize2} boxSize={4} />
                  </Box>
                </Box>
                <Stack spacing={2} p={{ base: 4, md: 5 }}>
                  <Heading as="h4" size="sm">
                    {t(`selectedWork.projects.${project.id}.caseStudy.sections.${section.id}.title`)}
                  </Heading>
                  <Text variant="description" fontSize="sm">
                    {t(
                      `selectedWork.projects.${project.id}.caseStudy.sections.${section.id}.description`
                    )}
                  </Text>
                </Stack>
              </Box>
              )
            })}
          </SimpleGrid>
        </ModalBody>

        <ModalFooter
          borderTop="1px solid"
          borderColor={borderColor}
          boxShadow={footerShadow}
          px={{ base: 5, md: 8 }}
          py={{ base: 5, md: 6 }}
        >
          <Stack
            direction={{ base: 'column', sm: 'row' }}
            spacing={3}
            width="100%"
            justify="flex-end"
            align={{ base: 'stretch', sm: 'center' }}
          >
            {project.links.map((link) => (
              <Button
                key={link.href}
                as="a"
                href={link.href}
                target="_blank"
                rel="noreferrer"
                variant="outlineAlternative"
                rightIcon={<ExternalLinkIcon />}
              >
                {t(link.labelKey)}
              </Button>
            ))}
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
    <ImageLightbox
      src={lightboxImage?.src ?? ''}
      alt={lightboxImage?.alt ?? ''}
      isOpen={Boolean(lightboxImage)}
      onClose={closeLightbox}
    />
    </>
  )
}

const SelectedWorkSection = () => {
  const { t } = useTranslation('common')
  const [activeProject, setActiveProject] = useState<SelectedWorkProject>()

  const handleClose = () => setActiveProject(undefined)

  return (
    <MotionStack
      variants={stagger}
      width={{ base: '99%', lg: '60%', xl: '75%' }}
      height="100%"
      spacing={{ base: 6, xl: 8 }}
      as="section"
    >
      <MotionStack variants={revealItem} spacing={{ base: 4, xl: 6 }}>
        <Heading
          as="h2"
          size="2xl"
          style={{
            fontVariantCaps: 'small-caps',
          }}
        >
          {t('selectedWork.title')}
        </Heading>
        <Text variant="description" textAlign="justify">
          {t('selectedWork.intro')}
        </Text>
      </MotionStack>

      <MotionStack variants={revealItem} spacing={5}>
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onOpenDetails={setActiveProject}
          />
        ))}
      </MotionStack>

      <ProjectCaseStudyModal
        project={activeProject}
        isOpen={Boolean(activeProject)}
        onClose={handleClose}
      />
    </MotionStack>
  )
}

export default memo(SelectedWorkSection)
