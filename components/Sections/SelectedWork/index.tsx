import { memo, type KeyboardEvent } from 'react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import {
  Badge,
  Box,
  Button,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

type SelectedWorkProject = {
  id: string
  image: string
  featured?: boolean
  url?: string
  backOfficeUrl?: string
  ctaKey: string
}

type CaseStudySection = {
  id: 'publicSite' | 'backOffice'
  image: string
}

const projects: SelectedWorkProject[] = [
  {
    id: 'scooter',
    image: '/projects/selected-work/scooter-rental/00-marketing.png',
    featured: true,
    url: 'https://scooter-rental.cantinbartel.dev',
    backOfficeUrl: 'https://scooter-rental.cantinbartel.dev/app',
    ctaKey: 'selectedWork.actions.viewDetails',
  },
  {
    id: 'painter',
    image: '/projects/selected-work/painter-website.svg',
    ctaKey: 'selectedWork.actions.viewProject',
  },
  {
    id: 'restaurant',
    image: '/projects/selected-work/restaurant-cafe.svg',
    ctaKey: 'selectedWork.actions.viewProject',
  },
  {
    id: 'crm',
    image: '/projects/selected-work/crm-workflow.svg',
    ctaKey: 'selectedWork.actions.viewScreenshots',
  },
]

const scooterCaseStudySections: CaseStudySection[] = [
  {
    id: 'publicSite',
    image: '/projects/selected-work/scooter-rental/02-public-site-marketing.png',
  },
  {
    id: 'backOffice',
    image: '/projects/selected-work/scooter-rental/01-backoffice-marketing.png',
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

const ProjectCard = ({
  project,
  isFeatured = false,
  onOpenDetails,
}: {
  project: SelectedWorkProject
  isFeatured?: boolean
  onOpenDetails?: () => void
}) => {
  const { t } = useTranslation('common')
  const surface = useColorModeValue('white', '#171A21')
  const imageBg = useColorModeValue('#F4F7FB', '#101216')
  const borderColor = useColorModeValue('#C9D3E1', '#323846')
  const hoverBorderColor = useColorModeValue('#263579', '#AEB9D6')
  const labelColor = useColorModeValue('#C1272D', '#C7D0E6')
  const title = t(`selectedWork.projects.${project.id}.title`)
  const tags = t(`selectedWork.projects.${project.id}.tags`, {
    returnObjects: true,
  }) as string[]
  const isInteractive = isFeatured && Boolean(onOpenDetails)

  const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isInteractive) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onOpenDetails?.()
    }
  }

  return (
    <Box
      as="article"
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-label={isInteractive ? t(project.ctaKey) : undefined}
      onClick={isInteractive ? onOpenDetails : undefined}
      onKeyDown={handleCardKeyDown}
      bg={surface}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="md"
      cursor={isInteractive ? 'pointer' : undefined}
      overflow="hidden"
      height="100%"
      display={isFeatured ? { base: 'block', md: 'grid' } : 'block'}
      gridTemplateColumns={
        isFeatured ? { md: 'minmax(0, 3fr) minmax(260px, 2fr)' } : undefined
      }
      transition="border-color 160ms ease, transform 160ms ease"
      _hover={
        isInteractive
          ? {
              borderColor: hoverBorderColor,
              transform: 'translateY(-2px)',
            }
          : undefined
      }
      _focusVisible={
        isInteractive
          ? {
              borderColor: hoverBorderColor,
              boxShadow: `0 0 0 1px ${hoverBorderColor}`,
              outline: 'none',
            }
          : undefined
      }
    >
      <Box
        aspectRatio={isFeatured ? 3 / 4 : 16 / 10}
        bg={imageBg}
        display="flex"
        alignItems="center"
        justifyContent="center"
        alignSelf={isFeatured ? 'start' : undefined}
        minW={0}
        overflow="hidden"
      >
        <Image
          src={project.image}
          alt={title}
          objectFit="contain"
          width="100%"
          height="100%"
        />
      </Box>
      <Stack
        spacing={4}
        p={isFeatured ? { base: 5, md: 6 } : 5}
        justify="space-between"
        minW={0}
      >
        <Stack spacing={3}>
          <Text
            fontSize="xs"
            fontWeight="semibold"
            color={labelColor}
            textTransform="uppercase"
          >
            {t(`selectedWork.projects.${project.id}.type`)}
          </Text>
          <Heading as="h3" size={isFeatured ? 'md' : 'sm'}>
            {title}
          </Heading>
          <Text variant="description" fontSize="sm">
            {t(`selectedWork.projects.${project.id}.description`)}
          </Text>
          <ProjectTags tags={tags} />
        </Stack>
        {isInteractive ? (
          <Button
            as="span"
            size="sm"
            variant="outlineAlternative"
            alignSelf="flex-start"
            pointerEvents="none"
          >
            {t(project.ctaKey)}
          </Button>
        ) : project.url ? (
          <Button
            as="a"
            href={project.url}
            target="_blank"
            rel="noreferrer"
            size="sm"
            variant="outlineAlternative"
            alignSelf="flex-start"
            rightIcon={<ExternalLinkIcon />}
          >
            {t(project.ctaKey)}
          </Button>
        ) : null}
      </Stack>
    </Box>
  )
}

const ProjectCaseStudyModal = ({
  project,
  isOpen,
  onClose,
}: {
  project: SelectedWorkProject
  isOpen: boolean
  onClose: () => void
}) => {
  const { t } = useTranslation('common')
  const surface = useColorModeValue('white', '#171A21')
  const imageBg = useColorModeValue('#F4F7FB', '#101216')
  const borderColor = useColorModeValue('#C9D3E1', '#323846')
  const labelColor = useColorModeValue('#C1272D', '#C7D0E6')
  const footerShadow = useColorModeValue(
    '0 -18px 28px -28px rgba(23, 32, 51, 0.55)',
    '0 -18px 28px -28px rgba(0, 0, 0, 0.85)'
  )
  const title = t(`selectedWork.projects.${project.id}.title`)
  const tags = t(`selectedWork.projects.${project.id}.tags`, {
    returnObjects: true,
  }) as string[]

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl" scrollBehavior="inside" isCentered>
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(3px)" />
      <ModalContent
        bg={surface}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="md"
        overflow="hidden"
        mx={{ base: 4, md: 8 }}
      >
        <ModalCloseButton />
        <ModalHeader px={{ base: 5, md: 8 }} pt={{ base: 6, md: 8 }} pb={4}>
          <Stack spacing={4} maxW="780px">
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
              {t('selectedWork.caseStudy.summary')}
            </Text>
            <ProjectTags tags={tags} />
          </Stack>
        </ModalHeader>

        <ModalBody px={{ base: 5, md: 8 }} py={2} pb={{ base: 5, md: 6 }}>
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
            {scooterCaseStudySections.map((section) => (
              <Box
                key={section.id}
                border="1px solid"
                borderColor={borderColor}
                borderRadius="md"
                overflow="hidden"
                bg={surface}
              >
                <Box
                  bg={imageBg}
                  aspectRatio={16 / 9}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  overflow="hidden"
                >
                  <Image
                    src={section.image}
                    alt={t(`selectedWork.caseStudy.sections.${section.id}.imageAlt`)}
                    objectFit="contain"
                    width="100%"
                    height="100%"
                  />
                </Box>
                <Stack spacing={2} p={{ base: 4, md: 5 }}>
                  <Heading as="h4" size="sm">
                    {t(`selectedWork.caseStudy.sections.${section.id}.title`)}
                  </Heading>
                  <Text variant="description" fontSize="sm">
                    {t(`selectedWork.caseStudy.sections.${section.id}.description`)}
                  </Text>
                </Stack>
              </Box>
            ))}
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
            <Button
              as="a"
              href={project.url}
              target="_blank"
              rel="noreferrer"
              variant="outlineAlternative"
              rightIcon={<ExternalLinkIcon />}
            >
              {t('selectedWork.actions.viewPublicWebsite')}
            </Button>
            <Button
              as="a"
              href={project.backOfficeUrl}
              target="_blank"
              rel="noreferrer"
              variant="outlineAlternative"
              rightIcon={<ExternalLinkIcon />}
            >
              {t('selectedWork.actions.viewBackOffice')}
            </Button>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

const SelectedWorkSection = () => {
  const { t } = useTranslation('common')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const featuredProject = projects.find((project) => project.featured)
  const compactProjects = projects.filter((project) => !project.featured)

  return (
    <Stack
      width={{ base: '99%', lg: '60%', xl: '75%' }}
      height="100%"
      spacing={{ base: 6, xl: 8 }}
      as="section"
    >
      <Stack spacing={{ base: 4, xl: 6 }}>
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
      </Stack>

      {featuredProject && (
        <>
          <ProjectCard project={featuredProject} isFeatured onOpenDetails={onOpen} />
          <ProjectCaseStudyModal
            project={featuredProject}
            isOpen={isOpen}
            onClose={onClose}
          />
        </>
      )}

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
        {compactProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </SimpleGrid>
    </Stack>
  )
}

export default memo(SelectedWorkSection)
