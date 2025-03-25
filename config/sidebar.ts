import { IconType } from 'react-icons'
import {
  FaLinkedin,
  FaGithub,
} from 'react-icons/fa'

type ExternalLinks = {
  label: string
  href: string
  icon: IconType
}

export const ExternalLinks: ExternalLinks[] = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/cantin-bartel/',
    icon: FaLinkedin,
  },
  {
    label: 'Github',
    href: 'https://github.com/cantin-b/cantin-b/',
    icon: FaGithub,
  }
]
