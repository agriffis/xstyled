import {
  createGlobalStyle,
  ThemeContext,
  ThemeProvider,
} from 'styled-components'
import { createColorModeProvider, createColorStyles } from '@agriffis/xstyled-core'

const ColorModeStyle = createGlobalStyle`${(p: {
  theme: any
  targetSelector: string
}) => createColorStyles(p.theme, { targetSelector: p.targetSelector })}`

export const ColorModeProvider = createColorModeProvider({
  ThemeContext,
  ThemeProvider,
  ColorModeStyle,
})

export {
  useColorMode,
  getColorModeInitScriptElement,
  getColorModeInitScriptTag,
} from '@agriffis/xstyled-core'
