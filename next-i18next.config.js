/** @type {import('next-i18next').UserConfig} */
const config = {
  i18n: {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
    localeDetection: false,
  },
  localePath: './public/locales',
  localeExtension: 'yml',
}

export default config
