import { IconType } from 'react-icons'
import {
  SiJavascript,
  SiTypescript,
  SiNodedotjs,
  SiNextdotjs,
  SiReact,
  SiPm2,
  SiWordpress, 
  SiStrapi,
  SiTailwindcss,
  SiPostgresql,
  SiDocker,
  SiNginx,
  SiLinux,
  SiWoocommerce,
  SiMysql,
  SiMongodb,
  SiElectron,
  SiGnubash,
  SiExpress 
} from 'react-icons/si'
import { AiOutlineApi } from "react-icons/ai"

export type SkillCategory =
  | 'backend'
  | 'frontend'
  | 'devops'
  | 'database'
  | 'CMS'
  | 'languages'

export type Skill = {
  name: string
  icon: IconType
}

export const Skills: {
  [key in SkillCategory]: Skill[]
} = {
  languages: [
    {
      name: 'Javascript (ES6+)',
      icon: SiJavascript,
    },
    {
      name: 'Typescript',
      icon: SiTypescript,
    },
  ],
  backend: [
    {
      name: 'Node',
      icon: SiNodedotjs,
    },
    {
      name: 'Strapi',
      icon: SiStrapi,
    },
    {
      name: 'Express',
      icon: SiExpress,
    },
    {
      name: 'REST API',
      icon: AiOutlineApi,
    },
  ],
  frontend: [
    {
      name: 'React',
      icon: SiReact,
    },
    {
      name: 'Tailwind CSS',
      icon: SiTailwindcss,
    },
    {
      name: 'NextJS',
      icon: SiNextdotjs,
    }
  ],
  database: [
    {
      name: 'PostgreSQL',
      icon: SiPostgresql,
    },
    {
      name: 'MongoDb',
      icon: SiMongodb,
    },
    {
      name: 'MySQL',
      icon: SiMysql,
    }
  ],
  devops: [
    {
      name: 'Docker',
      icon: SiDocker,
    },
    {
      name: 'NGINX',
      icon: SiNginx,
    },
    
    {
      name: 'PM2',
      icon: SiPm2,
    },
    {
      name: 'Linux',
      icon: SiLinux,
    },
    {
      name: 'Bash',
      icon: SiGnubash,
    },
  ],
  CMS: [
    {
      name: 'Wordpress',
      icon: SiWordpress,
    },
    {
      name: 'WooCommerce',
      icon: SiWoocommerce,
    },
  ]
}

export const splitSkills = (srcArray: Skill[]) => {
  if (!Array.isArray(srcArray) || srcArray.length === 0) return []
  const arrLength = srcArray.length
  const isEvenChunk = arrLength % 2 === 0

  let chunk = 4
  if (isEvenChunk) {
    chunk = arrLength / 2
  } else if (arrLength <= 5 && arrLength > 2) {
    chunk = 3
  }

  let i = 0
  let j = 0
  const temporary = []
  for (i = 0, j = srcArray.length; i < j; i += chunk) {
    temporary.push(srcArray.slice(i, i + chunk))
  }
  return temporary
}
