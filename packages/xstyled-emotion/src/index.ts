export * from './colorModes'
export {
  withEmotionCache,
  CacheProvider,
  ThemeContext,
  Global,
  ClassNames,
  keyframes,
  ThemeProvider,
  withTheme,
} from '@emotion/react'
export * from './breakpoints'
export * from './theme'
export * from './preflight'
export * from '@agriffis/xstyled-system'

// Create and export default system
import { system } from '@agriffis/xstyled-system'
import { createCss } from './create'

const { css, styled, x, createGlobalStyle, cx, jsx } = createCss(system)
export { css, styled as default, x, createGlobalStyle, cx, jsx }
