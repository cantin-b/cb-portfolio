import { memo } from 'react'
import {
  Heading,
  Text,
  List,
  ListItem,
  ListIcon,
  Icon,
  SimpleGrid,
  Box,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react'
import {
  SiJavascript,
  SiTypescript,
  SiNodedotjs,
  SiNextdotjs,
  SiReact,
  SiPostgresql,
  SiDocker
} from 'react-icons/si'
import { AiOutlineApi } from "react-icons/ai"
import { IoMdOpen } from 'react-icons/io'

import { motion } from 'framer-motion'
import { stagger, revealItem } from 'config/animations'

import { useTranslation, Trans } from 'next-i18next'

const MotionStack = motion(Stack)
const MotionHeading = motion(Heading)

type ISkillSetModal = {
  onOpen(): void
}

const Detail = ({ onOpen }: ISkillSetModal) => {
  const emphasis = useColorModeValue('#263579', '#AEB9D6')
  const emphasisHover = useColorModeValue('#C1272D', '#C7D0E6')
  const currentDate = new Date();
  const startDate = new Date(2021, 8); // September is month 8 (zero-based index)
  const diffInMilliseconds = currentDate.getTime() - startDate.getTime();
  const diffInYears = diffInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
  const professionalYears = Math.floor(diffInYears);

  const { t } = useTranslation('common')

  return (
    <MotionStack
      variants={stagger}
      width={{ base: '100%', lg: '70%' }}
      spacing={{ base: 6, xl: 8 }}
      as="section"
    >
      <MotionHeading
        variants={revealItem}
        as="h2"
        size="2xl"
        letterSpacing={1.8}
        style={{
          fontVariantCaps: 'small-caps',
        }}
      >
        {t('about.title')}
      </MotionHeading>
      <MotionStack variants={revealItem} spacing={{ base: 6, xl: 8 }}>
        <Text variant="description" textAlign="justify">
          <Trans
            i18nKey="about.description"
            values={{ professionalYears }}
            components={{ b: <b /> }}
          />
          {/* {t('about.description', { professionalYears })} */}
        </Text>

        <SimpleGrid columns={2} spacing={4}>
        <List spacing={3}>
          <ListItem fontSize="small" display="flex" alignItems="center">
            <ListIcon as={SiJavascript} color={emphasis} fontSize="2em" />
            Javascript (ES6+)
          </ListItem>
          <ListItem fontSize="small" display="flex" alignItems="center">
            <ListIcon as={SiReact} color={emphasis} fontSize="2em" />
            React
          </ListItem>
          <ListItem fontSize="small" display="flex" alignItems="center">
            <ListIcon as={SiNodedotjs} color={emphasis} fontSize="2em" />
            Node
          </ListItem>
          <ListItem fontSize="small" display="flex" alignItems="center">
            <ListIcon as={SiPostgresql} color={emphasis} fontSize="2em" />
            Postgresql
          </ListItem>
        </List>
        <List spacing={3}>
          <ListItem fontSize="small" display="flex" alignItems="center">
            <ListIcon as={SiTypescript} color={emphasis} fontSize="2em" />
            Typescript
          </ListItem>
          <ListItem fontSize="small" display="flex" alignItems="center">
            <ListIcon as={SiNextdotjs} color={emphasis} fontSize="2em" />
            NextJS
          </ListItem>
          <ListItem fontSize="small" display="flex" alignItems="center">
            <ListIcon as={AiOutlineApi} color={emphasis} fontSize="2em" />
            REST API
          </ListItem>
          <ListItem fontSize="small" display="flex" alignItems="center">
            <ListIcon as={SiDocker} color={emphasis} fontSize="2em" />
            Docker
          </ListItem>
        </List>
        <Box>
          <Text
            as="button"
            variant="emphasis"
            fontSize="smaller"
            textAlign="left"
            onClick={onOpen}
            transition="color 200ms cubic-bezier(0.22, 1, 0.36, 1)"
            _hover={{ color: emphasisHover }}
            _focusVisible={{ color: emphasisHover, outline: 'none' }}
          >
            {t('about.tech-stack-button')} <Icon as={IoMdOpen} />
          </Text>
        </Box>
        </SimpleGrid>
      </MotionStack>
    </MotionStack>
  )
}

export default memo(Detail)
