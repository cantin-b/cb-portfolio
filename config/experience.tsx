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
  roles?: JSX.Element[]
}

export const Experiences: {
  [key in Company]: CompanyDetail
} = {
  freelance: {
    name: 'Freelance',
    longName: 'Independent Freelance Projects',
    subDetail: 'Remote full-stack development services for global clients',
    url: '/#',
    position: 'Full-Stack Developer',
    duration: 'Oct 2023 - Present',
    logo: {
      light: '/logos/CB_logo.png',
      dark: '/logos/CB_logo_dark.png',
    },
    roles: [
      <>
        Work on frontend integration and responsive UI implementation.
      </>,
      <>
        Create and integrate RESTful APIs with third-party services.
      </>,
      <>
        Build full-stack web applications using modern technologies like React, Node.js, and Next.js.
      </>,
      <>
        Develop custom e-commerce plateforms using WooCommerce.
      </>,
      <>
        Handle VPS-based deployment, NGINX reverse proxy, and process management with PM2 in a Linux environment.
      </>,
    ],
  },
  wizito: {
    name: 'Wizito',
    longName: 'Wizito SAS',
    subDetail: 'B2B Photo Booth Rental Services Paris & Lyon - France',
    url: 'https://www.wizito.com/en',
    position: 'Full-Stack Developer',
    duration: 'Sep 2021 - Sep 2023',
    logo: {
      light: '/logos/wizito_logo_black.png',
      dark: '/logos/wizito_logo_white.png',
    },
    roles: [
      <>
        Modernized a legacy codebase and improved overall maintainability.
      </>,
      <>
        Helped migrate a monolithic Ruby app into Express and Strapi-based microservices.
      </>,
      <>
        Built frontend layouts from mockups for the English-market website.
      </>,
      <>
        Developed frontend features for the internal back-office used by company staff.
      </>,
    ],
  },
  sabca: {
    name: 'Sabca',
    longName: 'Sabca - Sabena Engineering',
    subDetail: 'F-16 maintenance site in Gosselies - Belgium',
    url: 'https://www.sabena-engineering.com/defence/',
    position: 'F-16 Aircraft Technician',
    duration: 'Sep 2018 - Mar 2021',
    logo: {
      light: '/logos/sabca_logo.png',
      dark: '/logos/sabca_logo_dark.png',
    },
    roles: [
      <>
        Worked as an aircraft technician on F-16 fighter jets for both the Belgian and Dutch military fleets.
      </>,
    ],
  }
}

export const ExperiencesList = [
  Experiences.freelance,
  Experiences.wizito,
  Experiences.sabca,
]
