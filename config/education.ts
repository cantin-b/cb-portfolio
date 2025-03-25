export type Education = {
  school: string
  degree: string
  location?: string
  period: string
}

export const EducationList: Education[] = [
  {
    school: 'Conservatoire National des Arts et Métiers',
    degree: 'Bachelor of Computer Science',
    location: 'France',
    period: 'Mar 2021 - Jul 2023',
  },
  {
    school: 'Haute École Condorcet',
    degree: 'Bachelor of Aircraft Engineering',
    location: 'Belgium',
    period: 'Sep 2010 - Jun 2014',
  },
]
