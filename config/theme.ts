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

const colors = {
  black: midnight.bg,
}

const styles = {
  global: (props: any) => ({
    body: {
      color: mode('gray.800', midnight.text)(props),
      bg: mode('gray.100', midnight.bg)(props),
    },
  }),
}

const textVariants = {
  emphasis: (props: ThemeComponentProps<ChakraTheme>) => ({
    color: mode('teal.500', midnight.accent)(props),
  }),
  description: (props: ThemeComponentProps<ChakraTheme>) => ({
    color: mode('gray.800', midnight.description)(props),
  }),
  accent: (props: ThemeComponentProps<ChakraTheme>) => ({
    color: mode('gray.800', midnight.accent)(props),
  }),
  accentAlternative: (props: ThemeComponentProps<ChakraTheme>) => ({
    color: mode('#595959', '#C1C9D4')(props),
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
        color: mode('teal.500', midnight.accent)(props),
        _hover: {
          color: mode('teal.600', midnight.accentHover)(props),
          textDecoration: 'none',
        },
      }),
      variants: {
        ...textVariants,
        description: (props: ThemeComponentProps<ChakraTheme>) => ({
          color: mode('gray.800', midnight.description)(props),
          _hover: {
            color: mode('teal.500', midnight.accent)(props),
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
          borderColor: mode('gray.800', midnight.accent)(props),
          color: mode('gray.800', midnight.text)(props),
          _hover: {
            backgroundColor: mode(
              'rgba(49, 151, 149, 0.06)',
              'rgba(143, 216, 232, 0.08)'
            )(props),
          },
        }),
        outlineAlternative: (props: ThemeComponentProps<ChakraTheme>) => ({
          borderWidth: '1px',
          borderRadius: 0,
          borderColor: mode('#595959', midnight.border)(props),
          _hover: {
            backgroundColor: mode(
              'rgba(49, 151, 149, 0.06)',
              'rgba(143, 216, 232, 0.08)'
            )(props),
          },
        }),
      },
    },
    Icon: {
      variants: {
        accent: (props: ThemeComponentProps<ChakraTheme>) => ({
          borderColor: mode('gray.800', midnight.border)(props),
        }),
      },
    },
    Divider: {
      variants: {
        solid: (props: ThemeComponentProps<ChakraTheme>) => ({
          borderColor: mode('gray.800', midnight.border)(props),
          marginLeft: 'auto',
          marginRight: 'auto',
        }),
      },
    },
    Modal: {
      baseStyle: (props: ThemeComponentProps<ChakraTheme>) => ({
        dialog: {
          bg: mode('white', midnight.surface)(props),
          color: mode('gray.800', midnight.text)(props),
          boxShadow: mode('xl', '0 24px 60px rgba(0, 0, 0, 0.38)')(props),
        },
      }),
    },
  },
})
export default theme
