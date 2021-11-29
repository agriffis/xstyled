import {
  useThemeScreens,
  useThemeBreakpoint,
  useThemeUp,
  useThemeDown,
} from '@agriffis/xstyled-core'
import { Screens } from '@agriffis/xstyled-system'
import { useTheme } from '@emotion/react'

export { useViewportWidth } from '@agriffis/xstyled-core'

export const useScreens = (): Screens => useThemeScreens(useTheme())

export const useBreakpoint = (): string | null => useThemeBreakpoint(useTheme())

export const useUp = (key: string | number): boolean =>
  useThemeUp(useTheme(), key)

export const useDown = (key: string | number): boolean =>
  useThemeDown(useTheme(), key)
