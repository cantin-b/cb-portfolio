export type Education = {
  school: string
  degree: string
  location?: string
  period: string
}

export const EducationList: Education[] = [
  {
    school: ['education', 'computer-science', 'school'].join('.'),
    degree: ['education', 'computer-science', 'title'].join('.'),
    location: 'France',
    period: 'Mar 2021 - Jul 2023',
  },
  {
    school: ['education', 'aircraft-engineering', 'school'].join('.'),
    degree: ['education', 'aircraft-engineering', 'title'].join('.'),
    location: 'Belgium',
    period: 'Sep 2010 - Jun 2014',
  },
]
