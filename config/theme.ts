import {
  extendTheme,
  ColorMode,
  ChakraTheme,
  ThemeComponentProps,
} from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

interface IThemeMode {
  Light: ColorMode
  Dark: ColorMode
}

export const ThemeMode: IThemeMode = {
  Light: 'light',
  Dark: 'dark',
}

export const mobileBreakpointsMap = {
  base: true,
  md: true,
  lg: true,
  xl: false,
}

// Theme Config
const config = {
  initialColorMode: 'system',
  useSystemColorMode: false,
}

const midnight = {
  bg: '#0B1118',
  surface: '#111827',
  surfaceElevated: '#162033',
  text: '#F3F4F6',
  description: '#A7B0C0',
  accent: '#8FD8E8',
  accentHover: '#B7ECF5',
  accentDeep: '#5AA6A6',
  border: '#263241',
}

const daylight = {
  bg: '#F4F7FB',
  surface: '#FFFFFF',
  text: '#172033',
  description: '#334155',
  accent: '#263579',
  accentHover: '#C1272D',
  muted: '#64748B',
  border: '#C9D3E1',
}

const colors = {
  black: midnight.bg,
}

const styles = {
  global: (props: any) => ({
    body: {
      color: mode(daylight.text, midnight.text)(props),
      bg: mode(daylight.bg, midnight.bg)(props),
    },
  }),
}

const textVariants = {
  emphasis: (props: ThemeComponentProps<ChakraTheme>) => ({
    color: mode(daylight.accent, midnight.accent)(props),
  }),
  description: (props: ThemeComponentProps<ChakraTheme>) => ({
    color: mode(daylight.description, midnight.description)(props),
  }),
  accent: (props: ThemeComponentProps<ChakraTheme>) => ({
    color: mode(daylight.accent, midnight.accent)(props),
  }),
  accentAlternative: (props: ThemeComponentProps<ChakraTheme>) => ({
    color: mode(daylight.muted, '#C1C9D4')(props),
  }),
}

const theme = extendTheme({
  config,
  fonts: {
    body: 'Poppins',
  },
  colors,
  styles,
  components: {
    Link: {
      baseStyle: (props: ThemeComponentProps<ChakraTheme>) => ({
        color: mode(daylight.accent, midnight.accent)(props),
        _hover: {
          color: mode(daylight.accentHover, midnight.accentHover)(props),
          textDecoration: 'none',
        },
      }),
      variants: {
        ...textVariants,
        description: (props: ThemeComponentProps<ChakraTheme>) => ({
          color: mode(daylight.description, midnight.description)(props),
          _hover: {
            color: mode(daylight.accent, midnight.accent)(props),
            textDecoration: 'none',
          },
        }),
      },
    },
    Text: {
      variants: textVariants,
    },
    Heading: {
      variants: textVariants,
    },
    Button: {
      variants: {
        outline: (props: ThemeComponentProps<ChakraTheme>) => ({
          borderColor: mode(daylight.accent, midnight.accent)(props),
          color: mode(daylight.text, midnight.text)(props),
          _hover: {
            backgroundColor: mode(
              'rgba(38, 53, 121, 0.07)',
              'rgba(143, 216, 232, 0.08)'
            )(props),
          },
        }),
        outlineAlternative: (props: ThemeComponentProps<ChakraTheme>) => ({
          borderWidth: '1px',
          borderRadius: 0,
          borderColor: mode(daylight.border, midnight.border)(props),
          _hover: {
            backgroundColor: mode(
              'rgba(193, 39, 45, 0.07)',
              'rgba(143, 216, 232, 0.08)'
            )(props),
          },
        }),
      },
    },
    Icon: {
      variants: {
        accent: (props: ThemeComponentProps<ChakraTheme>) => ({
          borderColor: mode(daylight.border, midnight.border)(props),
        }),
      },
    },
    Divider: {
      variants: {
        solid: (props: ThemeComponentProps<ChakraTheme>) => ({
          borderColor: mode(daylight.border, midnight.border)(props),
          marginLeft: 'auto',
          marginRight: 'auto',
        }),
      },
    },
    Modal: {
      baseStyle: (props: ThemeComponentProps<ChakraTheme>) => ({
        dialog: {
          bg: mode(daylight.surface, midnight.surface)(props),
          color: mode(daylight.text, midnight.text)(props),
          boxShadow: mode('xl', '0 24px 60px rgba(0, 0, 0, 0.38)')(props),
        },
      }),
    },
  },
})
export default theme
