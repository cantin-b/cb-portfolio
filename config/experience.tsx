export type Company = 'wizito' | 'sabca' | 'freelance'

export type CompanyDetail = {
  name: string
  longName: string
  subDetail?: string
  url: string
  position: string
  duration: string
  logo: {
    light: string
    dark?: string
  }
  roles?: string[]
}

export const Experiences: {
  [key in Company]: CompanyDetail
} = {
  freelance: {
    name: 'Freelance',
    longName: 'Independent Freelance Projects',
    subDetail: 'experience.jobs.freelance.sub-detail',
    url: '/#',
    position: 'experience.jobs.freelance.position',
    duration: 'Oct 2023 - Present',
    logo: {
      light: '/logos/CB_logo.png',
      dark: '/logos/CB_logo_dark.png',
    },
    roles: [
      'experience.jobs.freelance.missions.0',
      'experience.jobs.freelance.missions.1',
      'experience.jobs.freelance.missions.2',
      'experience.jobs.freelance.missions.3',
      'experience.jobs.freelance.missions.4',
    ],
  },
  wizito: {
    name: 'Wizito',
    longName: 'Wizito SAS',
    subDetail: 'experience.jobs.wizito.sub-detail',
    url: 'https://www.wizito.com/en',
    position: 'experience.jobs.wizito.position',
    duration: 'Sep 2021 - Sep 2023',
    logo: {
      light: '/logos/wizito_logo_black.png',
      dark: '/logos/wizito_logo_white.png',
    },
    roles: [
      'experience.jobs.wizito.missions.0',
      'experience.jobs.wizito.missions.1',
      'experience.jobs.wizito.missions.2',
      'experience.jobs.wizito.missions.3',
    ],
  },
  sabca: {
    name: 'Sabca',
    longName: 'Sabca - Sabena Engineering',
    subDetail: 'experience.jobs.sabca.sub-detail',
    url: 'https://www.sabena-engineering.com/defence/',
    position: 'experience.jobs.sabca.position',
    duration: 'Sep 2018 - Mar 2021',
    logo: {
      light: '/logos/sabca_logo.png',
      dark: '/logos/sabca_logo_dark.png',
    },
    roles: [
      'experience.jobs.sabca.missions.0',
    ],
  }
}

export const ExperiencesList = [
  Experiences.freelance,
  Experiences.wizito,
  Experiences.sabca,
]
